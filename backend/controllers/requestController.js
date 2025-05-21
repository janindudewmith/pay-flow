import Request from '../models/requestModel.js';
import { sendOTP, sendFormNotification, sendRejectionNotification } from '../services/emailService.js';
import Form from '../models/Form.js';
//import websocketService from '../services/websocketService.js';

// Helper functions
const getDepartmentCodeFromEmail = (email) => {
  if (!email || !email.includes('@')) return null;

  try {
    // Assuming email format like user@eie.ruh.ac.lk
    const domainPart = email.split('@')[1];
    if (!domainPart || !domainPart.includes('.')) return null;

    // Extract department code (eie, cee, mme, etc.)
    return domainPart.split('.')[0];
  } catch (error) {
    console.error('Error extracting department code from email:', error);
    return null;
  }
};

const getHodEmailForDepartment = (departmentCode) => {
  // This could be stored in a database or environment variables
  const departmentHodMap = {
    'eie': 'hod-eie@ruh.ac.lk',
    'cee': 'hod-cee@ruh.ac.lk',
    'mme': 'hod-mme@ruh.ac.lk',
    // Add other departments as needed
  };

  return departmentHodMap[departmentCode] || null;
};

// Submit a new request
export const submitRequest = async (req, res) => {
  try {
    const { formType, formData, submittedBy } = req.body;

    // Send OTP for verification
    await sendOTP(submittedBy, 'form_submission');

    res.status(200).json({
      success: true,
      message: 'OTP sent for verification',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting request',
      error: error.message,
    });
  }
};

// Get a specific request by ID
export const getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is authorized to view this request
    const isAdmin = req.user.isAdmin;

    // Extract department code from user email to check if they're the appropriate department head
    const userEmailDomain = req.user.email.split('@')[1] || '';
    const userDepartmentCode = userEmailDomain.split('.')[0];

    const isDepartmentHead = req.user.role === 'department_head' &&
      userDepartmentCode === request.departmentCode;

    const isFinanceOfficer = req.user.role === 'finance_officer';

    // Check if the user is the one who submitted the request
    const isRequestSubmitter = req.user.id === request.submittedBy.userId;

    // Only allow access if user is admin, appropriate department head, finance officer, or the submitter
    if (!isAdmin && !isDepartmentHead && !isFinanceOfficer && !isRequestSubmitter) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ message: 'Server error fetching request', error: error.message });
  }
};

// Get requests for a user
export const getUserRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ 'submittedBy.userId': userId })
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Server error fetching requests', error: error.message });
  }
};

// Get requests for department head
export const getDepartmentRequests = async (req, res) => {
  try {
    // Get department code from user email
    const departmentCode = getDepartmentCodeFromEmail(req.user.email);
    if (!departmentCode) {
      return res.status(400).json({ message: 'Could not determine department from user email' });
    }

    // Find requests for this department that are pending HOD approval
    const requests = await Request.find({
      departmentCode,
      status: 'pending_hod_approval',
      currentApproverEmail: req.user.email
    }).sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching department requests:', error);
    res.status(500).json({ message: 'Server error fetching requests', error: error.message });
  }
};

// Handle form approval
export const approveRequest = async (req, res) => {
  try {
    const { requestId, approverEmail } = req.body;

    // Send OTP for approval verification
    await sendOTP(approverEmail, 'approval');

    res.status(200).json({
      success: true,
      message: 'OTP sent for approval verification',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving request',
      error: error.message,
    });
  }
};

// Handle form rejection
export const rejectRequest = async (req, res) => {
  try {
    const { requestId, rejectorEmail, reason } = req.body;

    // Send OTP for rejection verification
    await sendOTP(rejectorEmail, 'rejection');

    res.status(200).json({
      success: true,
      message: 'OTP sent for rejection verification',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting request',
      error: error.message,
    });
  }
};

/**
 * Get requests for finance officer
 * @route GET /api/requests/finance
 * @access Finance Officer
 */
export const getFinanceRequests = async (req, res) => {
  try {
    // Check if user has finance officer role
    if (!req.user.role || req.user.role !== 'finance_officer') {
      return res.status(403).json({ message: 'Not authorized as finance officer' });
    }

    const { status } = req.query;
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    } else {
      // By default, show pending requests for finance approval
      query.status = 'pending_finance_approval';
      query.currentApproverEmail = req.user.email;
    }

    const requests = await Request.find(query)
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching finance requests:', error);
    res.status(500).json({ message: 'Server error fetching finance requests', error: error.message });
  }
};

/**
 * Get all requests (admin only)
 * @route GET /api/requests
 * @access Admin
 */
export const getRequests = async (req, res) => {
  try {
    // Check if user has admin role
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access all requests' });
    }

    const { status, department, startDate, endDate, search } = req.query;
    let query = {};

    // Apply filters if provided
    if (status) {
      query.status = status;
    }

    if (department) {
      query.departmentCode = department;
    }

    // Date range filter
    if (startDate || endDate) {
      query.submissionDate = {};
      if (startDate) {
        query.submissionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.submissionDate.$lte = new Date(endDate);
      }
    }

    // Search by submitter name or email
    if (search) {
      query.$or = [
        { 'submittedBy.fullName': { $regex: search, $options: 'i' } },
        { 'submittedBy.email': { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await Request.find(query)
      .sort({ submissionDate: -1 })
      .limit(parseInt(req.query.limit) || 100);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error fetching requests', error: error.message });
  }
};

// Submit form
export const submitForm = async (req, res) => {
  try {
    const { formType, formData, userId } = req.body;
    const user = req.user; // From Clerk auth

    if (!user || !user.id || !user.email) {
      return res.status(401).json({
        success: false,
        message: 'User information is missing'
      });
    }

    // Create form in database
    const form = await Form.create({
      formType,
      formData,
      submittedBy: {
        userId: user.id,
        email: user.email,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
        department: user.department || 'unknown'
      },
      status: 'pending_hod_approval'
    });

    console.log('Form created successfully:', form._id);

    // Send real-time update
    websocketService.sendUpdate(user.id, {
      type: 'form_submitted',
      message: 'Your form has been submitted successfully',
      formId: form._id
    });

    // Debug log before sending email
    console.log('About to send form notification email to', user.email);
    await sendFormNotification(
      user.email, // or another recipient
      'Form Submission Received',
      `Dear ${user.fullName},\n\nYour form has been received and is pending approval.\n\nThank you!`
    );
    // Debug log after sending email
    console.log('Form notification email sent!');

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      formId: form._id
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

