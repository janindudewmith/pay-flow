import axios from 'axios';

/**
 * Submit a form to the backend
 * @param {string} formType - The type of form (petty_cash, exam_duty, transport, paper_marking, overtime)
 * @param {object} formData - The form data to submit
 * @param {object} user - The user object from Clerk
 * @returns {Promise} - The axios response promise
 */
export const submitForm = async (formType, formData, user) => {
  try {
    // Extract user information
    const email = user?.primaryEmailAddress?.emailAddress || '';
    const fullName = user?.fullName || '';

    console.log('Submitting form with user data:', { email, fullName });

    // Get the API URL from environment variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Create a direct axios instance for the request
    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/forms/submit`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        formType,
        formData,
        email,
        fullName
      }
    });

    return response;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

