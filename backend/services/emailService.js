import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTP = async (email, otp, purpose) => {
  const subject = purpose === 'form_submission'
    ? 'OTP for Form Submission'
    : purpose === 'approval'
      ? 'OTP for Form Approval'
      : 'OTP for Form Rejection';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <h1>Your OTP for ${subject}</h1>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendFormNotification = async (email, formType, status, formId) => {
  const subject = `Form ${status} - ${formType}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <h1>Form ${status}</h1>
      <p>A ${formType} form has been ${status} and requires your attention.</p>
      <p>Please log in to your dashboard to review the form.</p>
      <p>Form ID: ${formId}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
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