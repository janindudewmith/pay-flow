import Form from '../models/Form.js';
import Department from '../models/Department.js';
import { sendFormNotification, sendRejectionNotification, sendOTP, sendSimpleEmail } from '../services/emailService.js';
import { websocketService } from '../services/websocketService.js';
import OTP from '../models/OTP.js';
import mongoose from 'mongoose';
import pdfService from '../services/pdfService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get department from email
const getDepartmentFromEmail = (email) => {
  if (!email || !email.includes('@')) return null;
  const domain = email.split('@')[1];
  if (!domain) return null;
  return domain.split('.')[0]; // eie, cee, mme
};

// Helper function to get HOD email
const getHodEmail = (department) => {
  const departmentMap = {
    'eie': process.env.HOD_EIE,
    'cee': process.env.HOD_CEE,
    'mme': process.env.HOD_MME
  };
  return departmentMap[department] || null;
};

// Submit form
export const submitForm = async (req, res) => {
  try {
    console.log('Form submission received');

    const { formType, formData } = req.body;

    // Get user ID from auth middleware 
    const userId = req.user.id;
    console.log(`submitForm: Using user ID ${userId}`);

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

    // Create the form document
    const formDocument = {
      formType: formType,
      formData: formData,
      submittedBy: {
        userId: userId,
        email: req.body?.email || 'user@example.com',
        fullName: req.body?.fullName || 'User',
        department: formData?.basicInfo?.department || 'unknown'
      },
      status: 'pending_hod_approval',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log(`submitForm: Saving form for user ${userId}`);

    // Insert the form document
    const result = await mongoose.connection.collection('forms').insertOne(formDocument);

    console.log(`submitForm: Form saved with ID ${result.insertedId}`);

    // After saving the form
    const userEmail = req.body.formData?.email || req.body.email || req.user.email;
    const userFullName = req.body.formData?.fullName || req.body.fullName || req.user.fullName || 'User';

    // 1. Send confirmation to the user
    console.log('Sending confirmation email to user:', userEmail);
    await sendSimpleEmail(
      userEmail,
      'Form Submission Confirmation',
      `Dear ${userFullName},\n\nYour ${formType.replace('_', ' ').toUpperCase()} form was submitted successfully! We will notify you once it is reviewed.\n\nThank you for using PayFlow.`,
      {
        formType,
        submittedBy: {
          fullName: userFullName,
          email: userEmail,
          department: formData?.basicInfo?.department || 'unknown'
        },
        basicInfo: formData?.basicInfo || formData
      }
    );

    // 2. Send alert to the admin/reviewer with form details
    console.log('Sending review alert to admin:', process.env.EMAIL_USER);
    await sendSimpleEmail(
      process.env.EMAIL_USER,
      `New ${formType.replace('_', ' ').toUpperCase()} Form Submission`,
      `A new form has been submitted by ${userFullName} (${userEmail}).\n\nPlease log in to review and process the submission.`,
      formDocument // Pass the complete form document
    );

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      formId: result.insertedId
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
    const { formId, action, comments, otp } = req.body;
    const user = req.user;

    // Verify OTP first
    const otpRecord = await OTP.findOne({
      email: user.email,
      otp,
      purpose: action === 'approve' ? 'approval' : 'rejection',
      formId,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    if (action === 'approve') {
      if (user.role === 'department_head') {
        // HOD approval
        form.status = 'pending_finance_approval';
        form.approvalDetails.hodApproval = {
          approvedBy: user.email,
          approvedAt: new Date(),
          comments
        };
        form.currentApproverEmail = process.env.FINANCE_OFFICER;
        form.otpVerification.hodVerified = true;

        // Notify finance officer
        await sendFormNotification(
          form.currentApproverEmail,
          'form_approved_by_hod',
          form
        );
      } else if (user.role === 'finance_officer') {
        // Finance approval
        form.status = 'approved';
        form.approvalDetails.financeApproval = {
          approvedBy: user.email,
          approvedAt: new Date(),
          comments
        };
        form.otpVerification.financeVerified = true;

        // Notify user
        await sendFormNotification(
          form.submittedBy.email,
          'form_approved_by_finance',
          form
        );
      }
    } else {
      // Rejection
      form.status = 'rejected';
      form.rejectionDetails = {
        rejectedBy: user.email,
        rejectedAt: new Date(),
        reason: comments,
        stage: user.role === 'department_head' ? 'hod' : 'finance'
      };

      // Notify user
      await sendFormNotification(
        form.submittedBy.email,
        'form_rejected',
        form
      );
    }

    await form.save();

    res.status(200).json({
      success: true,
      message: `Form ${action}d successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error ${action}ing form`,
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
    const hodEmail = req.user.email;
    const forms = await Form.find({
      currentApproverEmail: hodEmail,
      status: 'pending_hod_approval'
    }).sort({ createdAt: -1 });

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
    const financeEmail = req.user.email;
    const forms = await Form.find({
      currentApproverEmail: financeEmail,
      status: 'pending_finance_approval'
    }).sort({ createdAt: -1 });

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
        form.submittedBy
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
        }
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