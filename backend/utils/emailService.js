import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `PayFlow <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: message
  };
  
  return await transporter.sendMail(mailOptions);
};

export default sendEmail;