import Form from '../models/Form.js';
import Department from '../models/Department.js';
import { sendFormNotification, sendRejectionNotification, sendOTP, sendSimpleEmail, sendFinanceOfficerNotification } from '../services/emailService.js';
import { websocketService } from '../services/websocketService.js';
import OTP from '../models/OTP.js';
import mongoose from 'mongoose';
import pdfService from '../services/pdfService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to determine department from email
export const getDepartmentFromEmail = (email) => {
  if (!email) {
    return null;
  }

  // Convert to lowercase
  const lowerEmail = email.toLowerCase();

  // Check for department indicators in email
  if (lowerEmail.includes('eie') || lowerEmail.includes('electronic') || lowerEmail.includes('electrical')) {
    return 'eie';
  } else if (lowerEmail.includes('cee') || lowerEmail.includes('civil') || lowerEmail.includes('environmental')) {
    return 'cee';
  } else if (lowerEmail.includes('mme') || lowerEmail.includes('mechanical') || lowerEmail.includes('manufacturing')) {
    return 'mme';
  }

  // Check email domain patterns
  const emailParts = lowerEmail.split('@');
  if (emailParts.length < 2) {
    return null;
  }

  const domain = emailParts[1];
  const username = emailParts[0];

  // Check domain patterns
  if (domain.includes('eie')) {
    return 'eie';
  } else if (domain.includes('cee')) {
    return 'cee';
  } else if (domain.includes('mme')) {
    return 'mme';
  }

  // Check username patterns
  if (username.includes('eie')) {
    return 'eie';
  } else if (username.includes('cee')) {
    return 'cee';
  } else if (username.includes('mme')) {
    return 'mme';
  }

  return null;
};

// Helper function to get HOD email
export const getHodEmail = (department) => {
  if (!department) {
    return null;
  }

  // Normalize department code
  const deptCode = department.toLowerCase().trim();

  // Map department codes to HOD emails
  const departmentMap = {
    'eie': process.env.HOD_EIE || 'head.eie.ruh@gmail.com',
    'cee': process.env.HOD_CEE || 'head.cee.ruh@gmail.com',
    'mme': process.env.HOD_MME || 'head.mme.ruh@gmail.com'
  };

  // Check if we have a mapping for this department
  if (departmentMap[deptCode]) {
    return departmentMap[deptCode];
  }

  // Handle department name variations
  const deptNameMap = {
    'electronic': 'eie',
    'electrical': 'eie',
    'electronics': 'eie',
    'electronic and information': 'eie',
    'civil': 'cee',
    'civil and environmental': 'cee',
    'mechanical': 'mme',
    'mechanical and manufacturing': 'mme',
    'manufacturing': 'mme'
  };

  // Check for department name variations
  for (const [key, value] of Object.entries(deptNameMap)) {
    if (deptCode.includes(key)) {
      return departmentMap[value];
    }
  }

  return null;
};

// Submit form
export const submitForm = async (req, res) => {
  try {
    const { formType, formData } = req.body;

    // Get user ID from auth middleware 
    const userId = req.user.id;

    // Validate required fields
    if (!formType || !formData) {
      return res.status(400).json({
        success: false,
        message: 'Form type and form data are required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get user email
    const userEmail = req.body?.email || req.user.email;
    const userFullName = req.body?.fullName || req.user.fullName;

    // Determine department from user's email if not specified in form
    let department = formData?.basicInfo?.department?.toLowerCase() || null;

    if (!department) {
      department = getDepartmentFromEmail(userEmail);
    }

    if (!department) {
      department = 'unknown';
    }

    // Get department head's email
    const hodEmail = getHodEmail(department);

    // Create the form document
    const formDocument = {
      formType: formType,
      formData: formData,
      submittedBy: {
        userId: userId,
        email: userEmail,
        fullName: userFullName,
        department: department
      },
      status: 'pending_hod_approval',
      currentApproverEmail: hodEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the form document
    const result = await mongoose.connection.collection('forms').insertOne(formDocument);

    // Create a copy of the form document with the inserted ID
    const formWithId = {
      ...formDocument,
      _id: result.insertedId
    };

    // Send emails in parallel and don't wait for them
    try {
      // 1. Send confirmation to the user
      sendSimpleEmail(
        userEmail,
        'Form Submission Confirmation',
        `Dear ${userFullName},\n\nYour ${formType.replace('_', ' ').toUpperCase()} form was submitted successfully! The form has been sent to your department head for review.\n\nThank you for using PayFlow.`,
        {
          formType,
          formId: result.insertedId,
          submittedBy: {
            fullName: userFullName,
            email: userEmail,
            department: department
          },
          basicInfo: formData?.basicInfo || formData
        }
      );

      // 2. Send notification to the department head if available
      if (hodEmail) {
        sendFormNotification(
          hodEmail,
          'new_form_submission',
          formWithId
        );
      }
    } catch (emailError) {
      // Continue even if email sending fails
    }

    // 3. Notify through websocket if available
    if (websocketService) {
      try {
        websocketService.notifyNewForm({
          formId: result.insertedId,
          formType,
          department,
          hodEmail
        });
      } catch (error) {
        // Continue even if websocket notification fails
      }
    }

    // Send success response immediately after saving to database
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully and sent to department head',
      formId: result.insertedId
    });

  } catch (error) {
    // If we get here, it means the database save failed
    return res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Verify OTP and complete submission
export const verifyAndSubmitForm = async (req, res) => {
  try {
    const { formType, formData, email, otp, fullName } = req.body;

    // 1. Find OTP in DB, check expiry and match
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'form_submission',
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // valid for 5 min
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // 2. Save form
    const formDocument = {
      formType,
      formData,
      submittedBy: { email, fullName },
      status: 'pending_hod_approval',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    // Save to DB (use your existing logic)
    // ...

    // 3. Delete OTP after use
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting form', error: error.message });
  }
};

// Handle form approval/rejection
export const handleFormAction = async (req, res) => {
  try {
    const { action, comments, userRole } = req.body;
    const formId = req.body.formId || req.params.formId;
    const user = req.user;

    console.log('==== FORM ACTION REQUEST ====');
    console.log('Request params:', req.params);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Form ID:', formId);
    console.log('Action:', action);
    console.log('User role from request:', userRole);
    console.log('User from middleware:', JSON.stringify(user, null, 2));

    // Use the provided userRole if available, otherwise fall back to user.role
    const role = userRole || user.role;
    console.log('Using role for action:', role);

    // Validate form ID
    if (!formId || !mongoose.Types.ObjectId.isValid(formId)) {
      console.error('Invalid form ID:', formId);
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }

    // Find the form
    console.log('Looking for form with ID:', formId);
    try {
      const form = await Form.findById(formId);

      if (!form) {
        console.log(`Form with ID ${formId} not found`);
        return res.status(404).json({
          success: false,
          message: 'Form not found'
        });
      }

      console.log('Found form:', {
        id: form._id,
        type: form.formType,
        status: form.status,
        submittedBy: form.submittedBy
      });

      if (action === 'approve') {
        console.log(`Processing APPROVAL with role: ${role}`);

        if (role === 'department_head') {
          console.log('Processing as DEPARTMENT HEAD approval');
          // HOD approval
          form.status = 'pending_finance_approval';
          form.approvalDetails = form.approvalDetails || {};
          form.approvalDetails.hodApproval = {
            approvedBy: user.email,
            approvedAt: new Date(),
            comments
          };

          // Get finance officer email from environment variable or use default
          const financeOfficerEmail = process.env.FINANCE_OFFICER || 'finance.officer@ruh.ac.lk';
          form.currentApproverEmail = financeOfficerEmail;

          form.otpVerification = form.otpVerification || {};
          form.otpVerification.hodVerified = true;

          // Notify finance officer
          try {
            await sendFinanceOfficerNotification(form);
            console.log(`Finance officer notification sent for form: ${form._id}`);
          } catch (notifyError) {
            console.error('Error sending finance officer notification:', notifyError);
            // Continue even if notification fails
          }

          // Also notify the form submitter about HOD approval
          try {
            await sendFormNotification(
              form.submittedBy.email,
              'form_approved_by_hod',
              form
            );
            console.log(`HOD approval notification sent to submitter: ${form.submittedBy.email}`);
          } catch (notifyError) {
            console.error('Error sending HOD approval notification to submitter:', notifyError);
            // Continue even if notification fails
          }
        } else if (role === 'finance_officer') {
          console.log('Processing as FINANCE OFFICER approval');
          // Finance approval
          form.status = 'approved';
          form.approvalDetails = form.approvalDetails || {};
          form.approvalDetails.financeApproval = {
            approvedBy: user.email,
            approvedAt: new Date(),
            comments
          };
          form.otpVerification = form.otpVerification || {};
          form.otpVerification.financeVerified = true;

          console.log('Updated form status to approved');

          // Notify user
          try {
            await sendFormNotification(
              form.submittedBy.email,
              'form_approved_by_finance',
              form
            );
            console.log(`Notification sent to submitter: ${form.submittedBy.email}`);
          } catch (notifyError) {
            console.error('Error sending notification:', notifyError);
          }
        } else {
          console.log(`Unknown role for approval: ${role}`);
          return res.status(400).json({
            success: false,
            message: `Invalid role for approval: ${role}`
          });
        }
      } else if (action === 'reject') {
        console.log(`Processing REJECTION with role: ${role}`);
        // Rejection
        form.status = 'rejected';
        form.rejectionDetails = {
          rejectedBy: user.email,
          rejectedAt: new Date(),
          reason: comments,
          stage: role === 'department_head' ? 'hod' : 'finance'
        };

        console.log('Updated form status to rejected');
        console.log('Rejection details:', form.rejectionDetails);

        // Notify user
        try {
          await sendFormNotification(
            form.submittedBy.email,
            'form_rejected',
            form
          );
          console.log(`Rejection notification sent to submitter: ${form.submittedBy.email}`);
        } catch (notifyError) {
          console.error('Error sending rejection notification:', notifyError);
        }
      } else {
        console.log(`Invalid action: ${action}`);
        return res.status(400).json({
          success: false,
          message: `Invalid action: ${action}`
        });
      }

      console.log('Saving form with updated status:', form.status);

      try {
        // Force update the updatedAt field
        form.updatedAt = new Date();

        // Save the form
        const updatedForm = await form.save();

        // Double-check that the form was saved correctly
        const verifyForm = await Form.findById(formId);
        console.log('Form saved successfully. Verification check:', {
          id: verifyForm._id,
          status: verifyForm.status,
          updatedAt: verifyForm.updatedAt
        });

        if (verifyForm.status !== form.status) {
          console.warn('WARNING: Form status not updated correctly in database!');
        }

        console.log('==== FORM ACTION COMPLETED ====');

        return res.status(200).json({
          success: true,
          message: `Form ${action}d successfully`,
          updatedStatus: form.status,
          formId: form._id
        });
      } catch (saveError) {
        console.error('Error saving form:', saveError);
        throw saveError;
      }
    } catch (formFindError) {
      console.error('Error finding form:', formFindError);
      return res.status(500).json({
        success: false,
        message: 'Error finding form',
        error: formFindError.message
      });
    }
  } catch (error) {
    console.error('Error processing form action:', error);
    return res.status(500).json({
      success: false,
      message: `Error ${req.body.action || 'processing'}ing form`,
      error: error.message
    });
  }
};

// Get user's forms
export const getUserForms = async (req, res) => {
  try {
    // Get user ID from the request
    const userId = req.user.id;
    console.log(`getUserForms: Fetching forms for user ${userId}`);

    // Check if user ID is available
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'No user ID provided'
      });
    }

    try {
      // Find all forms for this user - using exact match with the same user ID format
      const forms = await mongoose.connection.collection('forms').find({
        'submittedBy.userId': userId
      }).sort({ createdAt: -1 }).toArray();

      console.log(`getUserForms: Found ${forms.length} forms for user ${userId}`);

      // Send successful response with forms
      return res.status(200).json({
        success: true,
        data: forms
      });
    } catch (dbError) {
      console.error('Database error in getUserForms:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error fetching forms',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Error in getUserForms:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// Get forms for HOD
export const getHodForms = async (req, res) => {
  try {
    // Get department from email
    const hodEmail = req.user.email;
    const department = getDepartmentFromEmail(hodEmail);

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Could not determine department from email'
      });
    }

    // Use direct MongoDB access for more flexibility
    const forms = await mongoose.connection.collection('forms').find({
      'submittedBy.department': department,
      'status': 'pending_hod_approval' // Only show forms pending HOD approval
    }).sort({ createdAt: -1 }).toArray();

    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// Get forms for finance officer
export const getFinanceForms = async (req, res) => {
  try {
    // Fetch ALL forms relevant to finance:
    // 1. Forms pending finance approval
    // 2. Forms approved by finance
    // 3. Forms rejected by finance
    const forms = await mongoose.connection.collection('forms').find({
      $or: [
        { 'status': 'pending_finance_approval' },
        { 'status': 'approved', 'approvalDetails.financeApproval': { $exists: true } },
        { 'status': 'rejected', 'rejectionDetails.stage': 'finance' }
      ]
    }).sort({ createdAt: -1 }).toArray();

    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

export const getForms = async (req, res) => {
  try {
    const { userId } = req.user;

    const forms = await Form.find({
      'submittedBy.userId': userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: forms
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms'
    });
  }
};

// Get a specific form by ID
export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`getFormById called for ID: ${id}`);

    // Use direct MongoDB access to look up the form
    const form = await mongoose.connection.collection('forms').findOne({
      _id: new mongoose.Types.ObjectId(id)
    });

    if (!form) {
      console.log(`Form with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    console.log(`Form found, returning to client: ${form._id}`);
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error fetching form by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: error.message
    });
  }
};

// Generate PDF for a form
export const generateFormPdf = async (req, res) => {
  try {
    const { formId } = req.params;

    // Find the form
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Check if user has permission to access this form
    const user = req.user;

    // In development mode, skip authorization checks
    // In production, you'd check that the user is the form submitter or an approver

    try {
      // Patch: Ensure formData is always in the correct nested structure
      let patchedFormData = form.formData;
      if (form.formType === 'petty_cash' && (!patchedFormData.basicInfo)) {
        patchedFormData = { basicInfo: patchedFormData };
      }
      // Add similar patches for other form types if needed

      // Generate PDF
      const pdfPath = await pdfService.generatePdf(
        patchedFormData,
        form.formType,
        form.submittedBy,
        (form.status || 'pending_hod_approval'),
        form.approvalDetails || null
      );

      // Check if the file exists
      if (!fs.existsSync(pdfPath)) {
        return res.status(500).json({
          success: false,
          message: 'PDF file could not be generated'
        });
      }

      // Serve the file for download
      const filename = path.basename(pdfPath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      const filestream = fs.createReadStream(pdfPath);
      filestream.pipe(res);

      // Delete the file after sending (optional - for cleanup)
      filestream.on('close', () => {
        // Uncomment to delete files after sending
        // fs.unlinkSync(pdfPath);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return res.status(500).json({
        success: false,
        message: 'Error generating PDF',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error in generateFormPdf:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
};

// Generate PDF from form data without saving
export const generatePdfFromData = async (req, res) => {
  try {
    const { formData, formType } = req.body;
    const user = req.user;

    if (!formData || !formType) {
      return res.status(400).json({
        success: false,
        message: 'Form data and type are required'
      });
    }

    try {
      // Generate PDF
      const pdfPath = await pdfService.generatePdf(
        formData,
        formType,
        {
          fullName: user?.fullName || req.body.fullName || 'User',
          email: user?.email || req.body.email || 'user@example.com'
        },
        'pending_hod_approval'
      );

      // Check if the file exists
      if (!fs.existsSync(pdfPath)) {
        return res.status(500).json({
          success: false,
          message: 'PDF file could not be generated'
        });
      }

      // Serve the file for download
      const filename = path.basename(pdfPath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      const filestream = fs.createReadStream(pdfPath);
      filestream.pipe(res);

      // Delete the file after sending (optional - for cleanup)
      filestream.on('close', () => {
        // Uncomment to delete files after sending
        // fs.unlinkSync(pdfPath);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return res.status(500).json({
        success: false,
        message: 'Error generating PDF',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error in generatePdfFromData:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
};

// Get all forms without filtering
export const getAllForms = async (req, res) => {
  try {
    console.log('getAllForms: Fetching all forms from database');

    // Use direct MongoDB access for more flexibility
    const forms = await mongoose.connection.collection('forms').find({}).sort({ createdAt: -1 }).toArray();

    console.log(`getAllForms: Found ${forms.length} forms in total`);

    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error) {
    console.error('Error in getAllForms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
}; 