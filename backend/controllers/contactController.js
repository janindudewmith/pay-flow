import { sendSimpleEmail } from '../services/emailService.js';

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Send email to admin
    await sendSimpleEmail(
      process.env.EMAIL_USER, // Send to admin email from .env
      `New Contact Form Submission: ${subject}`,
      `New message from the contact form:\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}`
    );

    // Send confirmation email to user
    await sendSimpleEmail(
      email,
      'Thank you for contacting PayFlow',
      `Dear ${name},\n\n` +
      `Thank you for contacting us. We have received your message and will get back to you soon.\n\n` +
      `Your message details:\n` +
      `Subject: ${subject}\n` +
      `Message: ${message}\n\n` +
      `Best regards,\n` +
      `The PayFlow Team`
    );

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
}; 