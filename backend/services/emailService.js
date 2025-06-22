import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OTP from '../models/OTP.js';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail service
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Helper function to get department head email
const getHodEmail = (department) => {
  // Define department head email mapping
  const departmentMap = {
    'eie': 'head.eie.ruh@gmail.com',
    'cee': 'head.cee.ruh@gmail.com',
    'mme': 'head.mme.ruh@gmail.com'
  };

  // Use environment variables if available, otherwise use hardcoded defaults
  const hodEmail = process.env[`HOD_${department?.toUpperCase()}`] || departmentMap[department];

  return hodEmail || null;
};

// Send OTP
export const sendOTP = async (email, otp, purpose) => {
  try {
    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'PayFlow OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f4f6fb; border-radius: 10px; border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); padding: 24px 0; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">PayFlow OTP Verification</h1>
          </div>
          <div style="padding: 32px 24px 24px 24px; background: #fff; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
              Hello,<br>
              Please use the following One-Time Password (OTP) to complete your login to <strong>PayFlow</strong>:
            </p>
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; font-size: 2rem; letter-spacing: 8px; color: #1a56db; font-weight: bold; background: #f1f5f9; padding: 12px 32px; border-radius: 8px; border: 1px solid #e5e7eb;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
              <strong>This OTP will expire in 5 minutes.</strong>
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              If you did not request this code, please ignore this email or contact our support team.
            </p>
            <div style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
              <span style="font-size: 13px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

// Send form notification
export const sendFormNotification = async (email, type, form) => {
  try {
    let subject, html;

    // Helper function to format form details
    const formatFormDetails = (formData) => {
      if (!formData) return '';

      let details = '';
      if (formData.basicInfo) {
        const info = formData.basicInfo;
        details = `
          <h2>Form Details:</h2>
          <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Requestor Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${info.requestorName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Position:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${info.position || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Department:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${info.department || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date Requested:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${info.dateRequested || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${info.amountRs || '0'}.${info.amountCts || '00'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Expected Spending Date:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${info.expectedSpendingDate || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Reason for Request:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${info.reasonForRequest || 'N/A'}</td>
            </tr>
          </table>
        `;
      }
      return details;
    };

    switch (type) {
      case 'new_form_submission':
        subject = 'New Form Submission Requires Your Approval';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">New Form Submission</h1>
              <p style="color: #e0e7ff; margin-top: 8px; font-size: 1.1rem;">Action Required: Your Approval is Needed</p>
            </div>
            
            <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Form Details</h2>
                <p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${form.formType.replace('_', ' ').toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Submitted By:</strong> ${form.submittedBy.fullName}</p>
                <p style="margin-bottom: 8px;"><strong>Department:</strong> ${form.submittedBy.department.toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Email:</strong> ${form.submittedBy.email}</p>
                <p style="margin-bottom: 8px;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin-bottom: 0;"><strong>Form ID:</strong> ${form._id}</p>
              </div>
              
              ${formatFormDetails(form.formData)}
              
              <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #059669;">
                <p style="color: #065f46; margin: 0; font-weight: 500;">This form requires your approval as the Department Head.</p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/department/dashboard" 
                  style="display: inline-block; background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; text-align: center;">
                  Review & Approve Form
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                If the button above doesn't work, please log in to the PayFlow system and navigate to your Department Head Dashboard.
              </p>
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px;">
                This is an automated message from PayFlow. Please do not reply to this email.<br>
                &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;

      case 'form_approved_by_hod':
        subject = 'Form Approved by Department Head';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Form Approved</h1>
              <p style="color: #e0e7ff; margin-top: 8px; font-size: 1.1rem;">Your form has been approved by the Department Head</p>
            </div>
            
            <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Form Details</h2>
                <p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${form.formType.replace('_', ' ').toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Submitted By:</strong> ${form.submittedBy.fullName}</p>
                <p style="margin-bottom: 8px;"><strong>Department:</strong> ${form.submittedBy.department.toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Status:</strong> Approved by Department Head</p>
                <p style="margin-bottom: 8px;"><strong>Approval Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin-bottom: 0;"><strong>Form ID:</strong> ${form._id}</p>
              </div>
              
              ${formatFormDetails(form.formData)}
              
              <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #059669;">
                <p style="color: #065f46; margin: 0; font-weight: 500;">Your form has been approved by the Department Head and forwarded to the Finance Department for final approval.</p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-requests" 
                  style="display: inline-block; background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; text-align: center;">
                  View Form Status
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                If the button above doesn't work, please log in to the PayFlow system and navigate to "My Requests".
              </p>
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px;">
                This is an automated message from PayFlow. Please do not reply to this email.<br>
                &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;

      case 'form_approved_by_finance':
        subject = 'Form Approved by Finance';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(90deg, #059669 0%, #10b981 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Form Fully Approved</h1>
              <p style="color: #ecfdf5; margin-top: 8px; font-size: 1.1rem;">Your payment request has been approved</p>
            </div>
            
            <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Form Details</h2>
                <p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${form.formType.replace('_', ' ').toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Submitted By:</strong> ${form.submittedBy.fullName}</p>
                <p style="margin-bottom: 8px;"><strong>Department:</strong> ${form.submittedBy.department.toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Status:</strong> Fully Approved</p>
                <p style="margin-bottom: 8px;"><strong>Final Approval Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin-bottom: 0;"><strong>Form ID:</strong> ${form._id}</p>
              </div>
              
              ${formatFormDetails(form.formData)}
              
              <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #059669;">
                <p style="color: #065f46; margin: 0; font-weight: 500;">Congratulations! Your payment request has been fully approved. The Finance Department will process your payment according to the details provided.</p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-requests" 
                  style="display: inline-block; background: linear-gradient(90deg, #059669 0%, #10b981 100%); color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; text-align: center;">
                  View Form Details
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                If the button above doesn't work, please log in to the PayFlow system and navigate to "My Requests".
              </p>
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px;">
                This is an automated message from PayFlow. Please do not reply to this email.<br>
                &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;

      case 'form_rejected':
        subject = 'Form Rejected';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Form Rejected</h1>
              <p style="color: #fee2e2; margin-top: 8px; font-size: 1.1rem;">Your payment request requires attention</p>
            </div>
            
            <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Form Details</h2>
                <p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${form.formType.replace('_', ' ').toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Submitted By:</strong> ${form.submittedBy.fullName}</p>
                <p style="margin-bottom: 8px;"><strong>Department:</strong> ${form.submittedBy.department.toUpperCase()}</p>
                <p style="margin-bottom: 8px;"><strong>Status:</strong> Rejected</p>
                <p style="margin-bottom: 8px;"><strong>Rejection Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin-bottom: 0;"><strong>Form ID:</strong> ${form._id}</p>
              </div>
              
              ${formatFormDetails(form.formData)}
              
              <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #991b1b; margin-top: 0; margin-bottom: 8px; font-size: 1.1rem;">Reason for Rejection</h3>
                <p style="color: #7f1d1d; margin: 0;">${form.rejectionDetails?.reason || 'No specific reason provided.'}</p>
                ${form.rejectionDetails?.stage ? `<p style="color: #7f1d1d; margin-top: 8px; margin-bottom: 0;"><strong>Rejected at Stage:</strong> ${form.rejectionDetails.stage.replace('_', ' ').toUpperCase()}</p>` : ''}
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Please review the feedback above and submit a new form with the necessary corrections if required.
              </p>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-requests" 
                  style="display: inline-block; background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; text-align: center;">
                  View Form Details
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                If the button above doesn't work, please log in to the PayFlow system and navigate to "My Requests".
              </p>
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px;">
                This is an automated message from PayFlow. Please do not reply to this email.<br>
                &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
              </p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error('Invalid notification type');
    }

    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

export const sendRejectionNotification = async (email, formType, reason) => {
  try {
    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Form Rejected - ${formType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Form Rejected</h1>
            <p style="color: #fee2e2; margin-top: 8px; font-size: 1.1rem;">Your payment request requires attention</p>
          </div>
          
          <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Form Details</h2>
              <p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${formType.replace('_', ' ').toUpperCase()}</p>
              <p style="margin-bottom: 8px;"><strong>Status:</strong> Rejected</p>
              <p style="margin-bottom: 0;"><strong>Rejection Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #991b1b; margin-top: 0; margin-bottom: 8px; font-size: 1.1rem;">Reason for Rejection</h3>
              <p style="color: #7f1d1d; margin: 0;">${reason || 'No specific reason provided.'}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Please review the feedback above and submit a new form with the necessary corrections if required.
            </p>
            
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-requests" 
                style="display: inline-block; background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; text-align: center;">
                View My Requests
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
              If the button above doesn't work, please log in to the PayFlow system and navigate to "My Requests".
            </p>
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated message from PayFlow. Please do not reply to this email.<br>
              &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

// Simple email sending function
export const sendSimpleEmail = async (to, subject, text, data = {}) => {
  try {
    // Check if this is a form submission confirmation
    const isFormConfirmation = subject.includes('Form Submission Confirmation');

    let html;

    if (isFormConfirmation) {
      // Use a format similar to the department head notification
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Form Submission Confirmation</h1>
            <p style="color: #e0e7ff; margin-top: 8px; font-size: 1.1rem;">Your form has been submitted successfully</p>
          </div>
          
          <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Dear ${data.submittedBy?.fullName || 'User'},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Your ${data.formType?.replace('_', ' ').toUpperCase() || 'form'} has been submitted successfully! The form has been sent to your department head for review.
            </p>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Form Details</h2>
              <p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${data.formType?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
              <p style="margin-bottom: 8px;"><strong>Submitted By:</strong> ${data.submittedBy?.fullName || 'N/A'}</p>
              <p style="margin-bottom: 8px;"><strong>Department:</strong> ${data.submittedBy?.department?.toUpperCase() || 'N/A'}</p>
              <p style="margin-bottom: 8px;"><strong>Email:</strong> ${data.submittedBy?.email || 'N/A'}</p>
              <p style="margin-bottom: 8px;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              ${data.formId ? `<p style="margin-bottom: 0;"><strong>Form ID:</strong> ${data.formId}</p>` : ''}
            </div>
            
            ${data.basicInfo ? `
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <h2 style="color: #1f2937; font-size: 1.2rem; margin-top: 0;">Payment Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  ${data.basicInfo.requestorName ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Requestor Name:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.basicInfo.requestorName}</td>
                    </tr>
                  ` : ''}
                  ${data.basicInfo.position ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Position:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.basicInfo.position}</td>
                    </tr>
                  ` : ''}
                  ${data.basicInfo.department ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Department:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.basicInfo.department}</td>
                    </tr>
                  ` : ''}
                  ${data.basicInfo.dateRequested ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date Requested:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.basicInfo.dateRequested}</td>
                    </tr>
                  ` : ''}
                  ${(data.basicInfo.amountRs !== undefined || data.basicInfo.amountCts !== undefined) ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">Rs. ${data.basicInfo.amountRs || '0'}.${data.basicInfo.amountCts || '00'}</td>
                    </tr>
                  ` : ''}
                  ${data.basicInfo.expectedSpendingDate ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Expected Spending Date:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.basicInfo.expectedSpendingDate}</td>
                    </tr>
                  ` : ''}
                  ${data.basicInfo.reasonForRequest ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Reason for Request:</strong></td>
                      <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.basicInfo.reasonForRequest}</td>
                    </tr>
                  ` : ''}
                </table>
              </div>
            ` : ''}
            
            <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #059669;">
              <p style="color: #065f46; margin: 0; font-weight: 500;">Your form has been sent to your department head for review. You will be notified when there are updates.</p>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-requests" 
                style="display: inline-block; background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; text-align: center;">
                View My Requests
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
              If the button above doesn't work, please log in to the PayFlow system and navigate to "My Requests".
            </p>
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated message from PayFlow. Please do not reply to this email.<br>
              &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
            </p>
          </div>
        </div>
      `;
    } else {
      // Use a consistent style for other emails too
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(90deg, #1a56db 0%, #2563eb 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">${subject}</h1>
          </div>
          
          <div style="background-color: #fff; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">${text}</p>
            
            ${data.formType ? `<p style="margin-bottom: 8px;"><strong>Form Type:</strong> ${data.formType.replace('_', ' ').toUpperCase()}</p>` : ''}
            ${data.submittedBy ? `
              <p style="margin-bottom: 8px;"><strong>Submitted By:</strong> ${data.submittedBy.fullName}</p>
              <p style="margin-bottom: 8px;"><strong>Email:</strong> ${data.submittedBy.email}</p>
              <p style="margin-bottom: 8px;"><strong>Department:</strong> ${data.submittedBy.department.toUpperCase()}</p>
            ` : ''}
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated message from PayFlow. Please do not reply to this email.<br>
              &copy; ${new Date().getFullYear()} PayFlow. All rights reserved.
            </p>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

export const sendNewsletterConfirmation = async (email, name) => {
  try {
    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to PayFlow Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a56db; padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center; font-size: 24px;">Welcome to PayFlow Newsletter!</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              Dear ${name || 'Valued Subscriber'},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              Thank you for subscribing to the PayFlow newsletter! We're excited to have you join our community of payment management professionals.
            </p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0; font-size: 18px;">What to Expect:</h2>
              <ul style="color: #374151; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Latest updates on payment management trends</li>
                <li style="margin-bottom: 10px;">Tips and best practices for efficient payment processing</li>
                <li style="margin-bottom: 10px;">New features and improvements to PayFlow</li>
                <li style="margin-bottom: 10px;">Exclusive insights and industry news</li>
              </ul>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              We're committed to providing you with valuable content that helps you make the most of your payment management experience.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                Visit PayFlow
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              If you have any questions or suggestions, feel free to reply to this email. We'd love to hear from you!
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              Best regards,<br>
              <strong>The PayFlow Team</strong>
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                You're receiving this email because you subscribed to the PayFlow newsletter. 
                To unsubscribe, click <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${email}" 
                style="color: #1a56db; text-decoration: underline;">here</a>.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

