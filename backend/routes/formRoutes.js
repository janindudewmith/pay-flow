import express from 'express';
import {
  submitForm,
  verifyAndSubmitForm,
  handleFormAction,
  getUserForms,
  getHodForms,
  getFinanceForms,
  getForms,
  getFormById,
  generateFormPdf,
  generatePdfFromData
} from '../controllers/formController.js';
import { authMiddleware } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Form submission routes
router.post('/submit', authMiddleware, submitForm);
router.post('/verify-and-submit', authMiddleware, verifyAndSubmitForm);

// Form action routes (approve/reject)
router.post('/:formId/action', authMiddleware, handleFormAction);

// Form retrieval routes
router.get('/my-forms', authMiddleware, getUserForms);
router.get('/hod-forms', authMiddleware, getHodForms);
router.get('/finance-forms', authMiddleware, getFinanceForms);

// Get all forms for the user
router.get('/', authMiddleware, getForms);

// Get a specific form by ID
router.get('/:id', authMiddleware, getFormById);

// PDF generation routes
router.get('/:formId/pdf', authMiddleware, generateFormPdf);
router.post('/generate-pdf', authMiddleware, generatePdfFromData);

// Add a direct route to see all forms (for debugging)
router.get('/debug/all-forms', async (req, res) => {
  try {
    // For security, require a user ID parameter
    const userId = req.query.userId;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: 'User ID required for security'
      });
    }

    // Only get forms for the specified user
    const forms = await mongoose.connection.collection('forms').find({
      'submittedBy.userId': userId
    }).toArray();

    console.log(`Debug route: Found ${forms.length} forms for user ${userId}`);
    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
});

// Add a direct route to see all forms with user info (for debugging)
router.get('/debug/all-forms-with-users', async (req, res) => {
  try {
    const forms = await mongoose.connection.collection('forms').find({}).toArray();
    console.log(`Debug route: Found ${forms.length} forms`);

    // Group forms by user ID
    const userFormMap = {};
    forms.forEach(form => {
      const userId = form.submittedBy?.userId || 'unknown';
      if (!userFormMap[userId]) {
        userFormMap[userId] = [];
      }
      userFormMap[userId].push({
        id: form._id,
        type: form.formType,
        status: form.status,
        createdAt: form.createdAt
      });
    });

    // Return the grouped forms and individual forms
    res.status(200).json({
      success: true,
      data: {
        userFormMap,
        allForms: forms.map(form => ({
          id: form._id,
          type: form.formType,
          userId: form.submittedBy?.userId,
          userInfo: form.submittedBy,
          status: form.status,
          createdAt: form.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
});

// Emergency endpoint to create a test form (no auth required)
router.post('/emergency-create', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const testForm = {
      formType: 'petty_cash',
      formData: {
        basicInfo: {
          requestorName: 'Emergency Test',
          position: 'Student',
          department: 'Electrical',
          dateRequested: new Date().toISOString().split('T')[0],
          amountRs: '15000',
          amountCts: '00',
          reasonForRequest: 'Emergency test form - created via emergency endpoint',
          expectedSpendingDate: new Date().toISOString().split('T')[0]
        }
      },
      submittedBy: {
        userId: userId,
        email: 'emergency@example.com',
        fullName: 'Emergency User',
        department: 'Electrical'
      },
      status: 'pending_hod_approval',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongoose.connection.collection('forms').insertOne(testForm);

    console.log(`Created emergency test form with ID: ${result.insertedId} for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Emergency test form created successfully',
      formId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating emergency form:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating emergency form',
      error: error.message
    });
  }
});

export default router; 