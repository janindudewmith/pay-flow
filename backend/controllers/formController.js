import Form from '../models/Form.js';
import Department from '../models/Department.js';
import { sendFormNotification, sendRejectionNotification } from '../services/emailService.js';
import { websocketService } from '../services/websocketService.js';

// Submit a new form
export const submitForm = async (req, res) => {
  try {
    const { formType, formData, submittedBy } = req.body;

    // Extract department from email domain
    const emailDomain = submittedBy.split('@')[1];
    const department = await Department.findOne({ emailDomain });

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department email domain',
      });
    }

    // Create new form
    const form = await Form.create({
      formType,
      formData,
      submittedBy,
      department: department.name,
      currentApprover: department.departmentHead.email,
    });

    // Send notification to department head
    await sendFormNotification(
      department.departmentHead.email,
      formType,
      'submitted',
      form._id
    );

    // Send real-time update to department head
    websocketService.sendUpdate(department.departmentHead.email, {
      type: 'new_form',
      form,
    });

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message,
    });
  }
};

// Get forms for approval
export const getFormsForApproval = async (req, res) => {
  try {
    const { email } = req.user;

    const forms = await Form.find({
      currentApprover: email,
      status: { $in: ['pending', 'approved_by_dept'] },
    });

    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message,
    });
  }
};

// Approve form
export const approveForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { email, role } = req.user;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    if (form.currentApprover !== email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this form',
      });
    }

    const department = await Department.findOne({ name: form.department });

    if (role === 'department_head') {
      form.status = 'approved_by_dept';
      form.departmentHeadApproval = {
        approvedBy: email,
        approvedAt: new Date(),
      };
      form.currentApprover = department.financeOfficer.email;

      // Notify finance officer
      await sendFormNotification(
        department.financeOfficer.email,
        form.formType,
        'approved by department',
        form._id
      );

      // Send real-time update to finance officer
      websocketService.sendUpdate(department.financeOfficer.email, {
        type: 'form_approved',
        form,
      });
    } else if (role === 'finance_officer') {
      form.status = 'approved_by_finance';
      form.financeApproval = {
        approvedBy: email,
        approvedAt: new Date(),
      };

      // Send real-time update to user
      websocketService.sendUpdate(form.submittedBy, {
        type: 'form_approved',
        form,
      });
    }

    await form.save();

    res.status(200).json({
      success: true,
      message: 'Form approved successfully',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving form',
      error: error.message,
    });
  }
};

// Reject form
export const rejectForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { email, role } = req.user;
    const { reason } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    if (form.currentApprover !== email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this form',
      });
    }

    if (role === 'department_head') {
      form.status = 'rejected_by_dept';
    } else if (role === 'finance_officer') {
      form.status = 'rejected_by_finance';
    }

    form.rejectionReason = reason;
    await form.save();

    // Notify user about rejection
    await sendRejectionNotification(
      form.submittedBy,
      form.formType,
      reason
    );

    // Send real-time update to user
    websocketService.sendUpdate(form.submittedBy, {
      type: 'form_rejected',
      form,
    });

    res.status(200).json({
      success: true,
      message: 'Form rejected successfully',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting form',
      error: error.message,
    });
  }
};

// Get user's forms
export const getUserForms = async (req, res) => {
  try {
    const { email } = req.user;

    const forms = await Form.find({ submittedBy: email });

    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user forms',
      error: error.message,
    });
  }
}; 