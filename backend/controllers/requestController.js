import Request from '../models/requestModel.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/emailService.js';

// Submit new request
const submitRequest = async (req, res) => {
  const { userEmail, formType, formData } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user || !user.isVerified) {
      return res.status(403).json({ message: 'OTP verification required.' });
    }

    // Extract department from email
    const domain = userEmail.split('@')[1];
    const departmentCode = domain.split('.')[0]; // eie, cee, etc.
    
    // Map department codes to department names
    const departments = {
      'eie': 'Electrical',
      'cee': 'Civil',
      'mme': 'Mechanical'
    };
    
    const department = departments[departmentCode] || 'Other';
    
    // Create the request
    const request = await Request.create({
      userEmail,
      formType,
      formData,
      department,
      currentApprover: 'department_head',
      approvalHistory: [{ 
        role: 'user', 
        status: 'submitted',
        timestamp: new Date()
      }]
    });

    // Reset verification status
    user.isVerified = false;
    await user.save();

    // Send notification to department head
    // Get department head email
    const departmentHeadEmail = `head@${departmentCode}.ruh.ac.lk`; // Example format
    
    await sendEmail(
      departmentHeadEmail,
      `New ${formType} Request Submission`,
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">PayFlow Notification</h2>
        <p>A new ${formType} request has been submitted and requires your review.</p>
        <p><strong>Submitted by:</strong> ${userEmail}</p>
        <p><strong>Request ID:</strong> ${request._id}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>Please log in to the PayFlow dashboard to review this request.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} PayFlow. All rights reserved.</p>
      </div>`
    );

    res.status(201).json({ 
      success: true,
      message: 'Request submitted successfully', 
      request 
    });
  } catch (err) {
    console.error('Error submitting request:', err);
    res.status(500).json({ 
      success: false,
      message: 'Submission failed', 
      error: err.message 
    });
  }
};

// Approve request
const approveRequest = async (req, res) => {
  const { id } = req.params;
  const { adminEmail, role } = req.body;

  try {
    const admin = await User.findOne({ email: adminEmail });

    if (!admin || !admin.isVerified) {
      return res.status(403).json({ message: 'OTP verification required.' });
    }

    const request = await Request.findById(id);
    if (!request || request.status !== 'pending') {
      return res.status(404).json({ message: 'Request not found or already processed.' });
    }

    if (request.currentApprover !== role) {
      return res.status(403).json({ message: 'You are not authorized to approve this request.' });
    }

    // Update approval history
    request.approvalHistory.push({ 
      role, 
      status: 'approved',
      timestamp: new Date()
    });

    // Update current approver or mark as approved
    if (role === 'department_head') {
      request.currentApprover = 'finance_officer';
      
      // Send notification to finance officer
      await sendEmail(
        'finance@ruh.ac.lk', // Example finance officer email
        `${request.formType} Request Awaiting Finance Approval`,
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">PayFlow Notification</h2>
          <p>A ${request.formType} request has been approved by the department head and requires your review.</p>
          <p><strong>Request ID:</strong> ${request._id}</p>
          <p><strong>Submitted by:</strong> ${request.userEmail}</p>
          <p><strong>Department:</strong> ${request.department}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p>Please log in to the PayFlow dashboard to review this request.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} PayFlow. All rights reserved.</p>
        </div>`
      );
    } else if (role === 'finance_officer') {
      request.status = 'approved';
      request.currentApprover = null;
      
      // Notify user of approval
      await sendEmail(
        request.userEmail,
        `Your ${request.formType} Request Has Been Approved`,
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">PayFlow Notification</h2>
          <p>Good news! Your ${request.formType} request has been fully approved.</p>
          <p><strong>Request ID:</strong> ${request._id}</p>
          <p><strong>Status:</strong> Approved</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p>You can view the details in your PayFlow dashboard.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} PayFlow. All rights reserved.</p>
        </div>`
      );
    }

    // Reset admin verification status
    admin.isVerified = false;
    await admin.save();

    // Save request changes
    request.updatedAt = new Date();
    await request.save();

    res.status(200).json({ 
      success: true,
      message: 'Request approved', 
      request 
    });
  } catch (err) {
    console.error('Error approving request:', err);
    res.status(500).json({ 
      success: false,
      message: 'Approval failed', 
      error: err.message 
    });
  }
};

// Reject request
const rejectRequest = async (req, res) => {
  const { id } = req.params;
  const { adminEmail, role, reason } = req.body;

  try {
    const admin = await User.findOne({ email: adminEmail });

    if (!admin || !admin.isVerified || admin.role !== role) {
      return res.status(403).json({ message: 'OTP verification required or role mismatch.' });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    if (request.currentApprover !== role) {
      return res.status(403).json({ message: 'You are not authorized to reject this request.' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required.' });
    }

    // Update request status
    request.status = 'rejected';
    request.currentApprover = null;

    // Add to approval history
    request.approvalHistory.push({ 
      role, 
      status: 'rejected', 
      reason,
      timestamp: new Date()
    });

    // Reset admin verification status
    admin.isVerified = false;
    await admin.save();
    
    // Save request changes
    await request.save();

    // Notify user of rejection
    await sendEmail(
      request.userEmail,
      `Your ${request.formType} Request Has Been Rejected`,
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">PayFlow Notification</h2>
        <p>We regret to inform you that your ${request.formType} request has been rejected.</p>
        <p><strong>Request ID:</strong> ${request._id}</p>
        <p><strong>Rejected by:</strong> ${role.replace('_', ' ').charAt(0).toUpperCase() + role.replace('_', ' ').slice(1)}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>You can view the details in your PayFlow dashboard.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} PayFlow. All rights reserved.</p>
      </div>`
    );

    res.status(200).json({ 
      success: true,
      message: 'Request rejected', 
      request 
    });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ 
      success: false,
      message: 'Rejection failed', 
      error: err.message 
    });
  }
};

// Get user requests
const getUserRequests = async (req, res) => {
  const { email } = req.query;
  try {
    const requests = await Request.find({ userEmail: email }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error('Error fetching user requests:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch requests', 
      error: err.message 
    });
  }
};

// Get pending requests by role
const getPendingRequests = async (req, res) => {
  const { role } = req.query;
  try {
    const requests = await Request.find({ currentApprover: role, status: 'pending' });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pending requests', 
      error: err.message 
    });
  }
};

export {
  submitRequest,
  approveRequest,
  rejectRequest,
  getUserRequests,
  getPendingRequests
};
