import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OTP from '../models/OTP.js';

dotenv.config();

// Log email configuration (without exposing sensitive data)
console.log('=== Email Service Configuration ===');
console.log('SMTP Host:', 'smtp.gmail.com');
console.log('SMTP Port:', 587);
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password Present:', !!process.env.EMAIL_PASS);

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

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('=== Email Service Configuration Error ===');
    console.error('Error details:', error);
    console.error('Please check:');
    console.error('1. EMAIL_USER and EMAIL_PASS are set in .env');
    console.error('2. If using Gmail, ensure you have:');
    console.error('   - Enabled "Less secure app access" or');
    console.error('   - Created an App Password if using 2FA');
  } else {
    console.log('=== Email Service Ready ===');
    console.log('Server is ready to send messages');
    console.log('Using email account:', process.env.EMAIL_USER);
  }
});

// Helper function to get department head email
const getHodEmail = (department) => {
  const departmentMap = {
    'eie': process.env.HOD_EIE,
    'cee': process.env.HOD_CEE,
    'mme': process.env.HOD_MME
  };
  return departmentMap[department] || null;
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

    console.log('Sending OTP email:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
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
        subject = 'New Form Submission';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a56db;">New Form Submission</h1>
            <p>A new ${form.formType.replace('_', ' ').toUpperCase()} form has been submitted for your approval.</p>
            <p><strong>Submitted by:</strong> ${form.submittedBy.fullName}</p>
            <p><strong>Department:</strong> ${form.submittedBy.department}</p>
            <p><strong>Email:</strong> ${form.submittedBy.email}</p>
            ${formatFormDetails(form.formData)}
            <p style="margin-top: 20px;">Please log in to review the form.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">This is an automated message from PayFlow. Please do not reply to this email.</p>
            </div>
          </div>
        `;
        break;

      case 'form_approved_by_hod':
        subject = 'Form Approved by Department Head';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">Form Approved by Department Head</h1>
            <p>The ${form.formType.replace('_', ' ').toUpperCase()} form has been approved by the department head.</p>
            ${formatFormDetails(form.formData)}
            <p style="margin-top: 20px;">Please log in to review and take necessary action.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">This is an automated message from PayFlow. Please do not reply to this email.</p>
            </div>
          </div>
        `;
        break;

      case 'form_approved_by_finance':
        subject = 'Form Approved by Finance';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">Form Approved</h1>
            <p>Your ${form.formType.replace('_', ' ').toUpperCase()} form has been approved by the finance department.</p>
            ${formatFormDetails(form.formData)}
            <p style="margin-top: 20px;">Thank you for using our system.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">This is an automated message from PayFlow. Please do not reply to this email.</p>
            </div>
          </div>
        `;
        break;

      case 'form_rejected':
        subject = 'Form Rejected';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Form Rejected</h1>
            <p>Your ${form.formType.replace('_', ' ').toUpperCase()} form has been rejected.</p>
            ${formatFormDetails(form.formData)}
            <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Reason for Rejection:</strong> ${form.rejectionDetails.reason}</p>
              <p><strong>Rejected at Stage:</strong> ${form.rejectionDetails.stage.toUpperCase()}</p>
            </div>
            <p>Please review the feedback and submit a new form if necessary.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">This is an automated message from PayFlow. Please do not reply to this email.</p>
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

    console.log('Sending form notification:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      type
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Form notification email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendRejectionNotification = async (email, formType, reason) => {
  try {
    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Form Rejected - ${formType}`,
      html: `
        <h1>Form Rejected</h1>
        <p>Your ${formType} form has been rejected.</p>
        <p>Reason for rejection: ${reason}</p>
        <p>Please review the feedback and submit a new form if necessary.</p>
      `
    };

    console.log('Sending rejection notification:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection notification email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending rejection notification:', error);
    throw error;
  }
};

export const sendSimpleEmail = async (to, subject, text, formData = null) => {
  try {
    console.log('=== Sending Simple Email ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('From:', process.env.EMAIL_USER);

    let html = '';
    if (formData) {
      // Format form details for admin notification
      const info = formData.basicInfo || formData;
      const submittedBy = formData.submittedBy || {};

      // Check if this is a user confirmation email
      if (subject === 'Form Submission Confirmation') {
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a56db; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; text-align: center;">Form Submission Confirmation</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Dear ${submittedBy.fullName},
              </p>
              
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Your ${formData.formType.replace('_', ' ').toUpperCase()} form was submitted successfully! We will notify you once it is reviewed.
              </p>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #374151; margin-top: 0;">Form Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Form Type:</strong></td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${formData.formType.replace('_', ' ').toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Department:</strong></td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${submittedBy.department || info.department || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date Submitted:</strong></td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${new Date().toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Thank you for using PayFlow.
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">
                  This is an automated message from PayFlow. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `;
      } else {
        // Admin notification email format (existing code)
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a56db;">New Form Submission</h1>
            <p style="font-size: 16px; line-height: 1.5;">${text}</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0;">Submitter Information</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${submittedBy.fullName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${submittedBy.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Department:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${submittedBy.department || info.department || 'N/A'}</td>
                </tr>
              </table>

              <h2 style="color: #374151; margin-top: 20px;">Form Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Form Type:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${formData.formType ? formData.formType.replace('_', ' ').toUpperCase() : 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Requestor Name:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${info.requestorName || submittedBy.fullName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Position:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${info.position || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Department:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${info.department || submittedBy.department || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date Requested:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${info.dateRequested || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">Rs. ${info.amountRs || '0'}.${info.amountCts || '00'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Expected Spending Date:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${info.expectedSpendingDate || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Reason for Request:</strong></td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${info.reasonForRequest || 'N/A'}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #e5e7eb; padding: 15px; border-radius: 6px; margin-top: 20px;">
              <p style="margin: 0; color: #374151;">
                <strong>Action Required:</strong> Please log in to the PayFlow system to review and process this submission.
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px;">
                This is an automated message from PayFlow. Please do not reply to this email.
              </p>
            </div>
          </div>
        `;
      }
    }

    const mailOptions = {
      from: `"PayFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      ...(html ? { html } : { text })
    };

    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('=== Email Sending Error ===');
    console.error('Error details:', error);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    throw error;
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

    console.log('Sending newsletter confirmation email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter confirmation email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending newsletter confirmation:', error);
    throw error;
  }
};