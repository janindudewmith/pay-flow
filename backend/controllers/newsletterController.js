import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import { sendSimpleEmail, sendNewsletterConfirmation } from '../services/emailService.js';
import mongoose from 'mongoose';

export const subscribeToNewsletter = async (req, res) => {
  try {
    console.log('=== Newsletter Subscription Request ===');
    console.log('Request body:', req.body);
    const { email, name } = req.body;
    console.log('Processing subscription for email:', email);

    if (!email) {
      console.log('Error: Email is missing');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    console.log('Checking for existing subscription...');
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    
    if (existingSubscriber) {
      console.log('Found existing subscriber:', existingSubscriber);
      
      // Update existing subscription
      console.log('Updating subscription...');
      existingSubscriber.isActive = true;
      existingSubscriber.updatedAt = new Date();
      if (name) {
        existingSubscriber.name = name;
      }
      await existingSubscriber.save();

      // Send welcome email
      await sendNewsletterConfirmation(email, name);

      return res.status(200).json({
        success: true,
        message: 'Thank you for subscribing to our newsletter!'
      });
    }

    // Create new subscription
    console.log('Creating new subscription...');
    const newSubscriber = await NewsletterSubscriber.create({
      email,
      name,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('New subscriber created:', newSubscriber);

    // Send welcome email
    await sendNewsletterConfirmation(email, name);

    console.log('Subscription process completed successfully');
    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
      subscriber: newSubscriber
    });

  } catch (error) {
    console.error('=== Newsletter Subscription Error ===');
    console.error('Error details:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing newsletter subscription',
      error: error.message
    });
  }
};

export const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Newsletter unsubscribe request received for:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found for this email'
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    console.log('Sending unsubscribe confirmation email to:', email);
    // Send unsubscribe confirmation email
    await sendSimpleEmail(
      email,
      'Unsubscribed from PayFlow Newsletter',
      `You have been successfully unsubscribed from our newsletter.\n\nWe're sorry to see you go. If you change your mind, you can always resubscribe through our website.\n\nBest regards,\nThe PayFlow Team`
    );

    return res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing newsletter unsubscribe request',
      error: error.message
    });
  }
}; 