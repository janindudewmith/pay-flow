import express from 'express';
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '../controllers/newsletterController.js';
import { sendSimpleEmail } from '../services/emailService.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Test email configuration
router.get('/test-email', async (req, res) => {
  try {
    console.log('\n=== Testing Email Configuration ===');
    
    // 1. Check environment variables
    console.log('1. Checking environment variables...');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS is not set in .env file');
    }
    console.log('✓ Environment variables are set');
    
    // 2. Create test transporter
    console.log('\n2. Creating test transporter...');
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true
    });
    
    // 3. Verify connection
    console.log('\n3. Verifying SMTP connection...');
    await testTransporter.verify();
    console.log('✓ SMTP connection verified');
    
    // 4. Send test email
    console.log('\n4. Sending test email...');
    const testEmail = process.env.EMAIL_USER; // Send to self
    const info = await testTransporter.sendMail({
      from: `"PayFlow Test" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: 'Test Email from PayFlow',
      text: 'This is a test email to verify the email configuration.'
    });
    
    console.log('\n=== Test Results ===');
    console.log('✓ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    res.json({
      success: true,
      message: 'Email configuration test completed successfully',
      details: {
        emailUser: process.env.EMAIL_USER,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      }
    });
    
  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Email configuration test failed',
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        response: error.response
      }
    });
  }
});

router.post('/subscribe', subscribeToNewsletter);
router.post('/unsubscribe', unsubscribeFromNewsletter);

export default router; 