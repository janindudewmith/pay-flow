import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OTP from '../models/OTP.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Login OTP Verification',
      html: `
        <h1>OTP Verification</h1>
        <p>Your OTP for login is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
      `
    });
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

    switch (type) {
      case 'new_form_submission':
        subject = 'New Form Submission';
        html = `
          <h1>New Form Submission</h1>
          <p>A new ${form.formType} form has been submitted for your approval.</p>
          <p>Submitted by: ${form.submittedBy.fullName}</p>
          <p>Department: ${form.submittedBy.department}</p>
          <p>Please log in to review the form.</p>
        `;
        break;

      case 'form_approved_by_hod':
        subject = 'Form Approved by Department Head';
        html = `
          <h1>Form Approved by Department Head</h1>
          <p>The ${form.formType} form has been approved by the department head.</p>
          <p>Please log in to review and take necessary action.</p>
        `;
        break;

      case 'form_approved_by_finance':
        subject = 'Form Approved by Finance';
        html = `
          <h1>Form Approved</h1>
          <p>Your ${form.formType} form has been approved by the finance department.</p>
          <p>Thank you for using our system.</p>
        `;
        break;

      case 'form_rejected':
        subject = 'Form Rejected';
        html = `
          <h1>Form Rejected</h1>
          <p>Your ${form.formType} form has been rejected.</p>
          <p>Reason: ${form.rejectionDetails.reason}</p>
          <p>Stage: ${form.rejectionDetails.stage}</p>
        `;
        break;

      default:
        throw new Error('Invalid notification type');
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html
    });

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendRejectionNotification = async (email, formType, reason) => {
  const subject = `Form Rejected - ${formType}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <h1>Form Rejected</h1>
      <p>Your ${formType} form has been rejected.</p>
      <p>Reason for rejection: ${reason}</p>
      <p>Please review the feedback and submit a new form if necessary.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSimpleEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};