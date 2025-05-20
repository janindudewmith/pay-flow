import axios from 'axios';

/**
 * Download a PDF for a submitted form
 * 
 * @param {string} formId - The ID of the submitted form
 * @param {string} token - Authentication token
 * @param {string} formType - Type of form (for naming the downloaded file)
 * @returns {Promise<void>}
 */
export const downloadSubmittedFormPdf = async (formId, token, formType) => {
  try {
    // Show loading state
    console.log('Downloading PDF for form:', formId);

    // Make GET request to download PDF
    const response = await axios({
      method: 'get',
      url: `http://localhost:5000/api/forms/${formId}/pdf`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob' // Important for file downloads
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${formType || 'form'}_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Error generating PDF. Please try again.');
  }
};

/**
 * Generate a PDF from form data without submitting
 * 
 * @param {Object} formData - The form data
 * @param {string} formType - Type of form (e.g., petty_cash, exam_duty)
 * @param {Object} user - User information
 * @param {string} token - Authentication token
 * @returns {Promise<void>}
 */
export const generateFormPdf = async (formData, formType, user, token) => {
  try {
    // Create form data for PDF generation
    const pdfData = {
      formType,
      formData,
      fullName: user?.fullName || '',
      email: user?.email || ''
    };

    // Make POST request to download PDF
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/forms/generate-pdf',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: pdfData,
      responseType: 'blob' // Important for file downloads
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${formType}_form_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Error generating PDF. Please try again.');
  }
}; 