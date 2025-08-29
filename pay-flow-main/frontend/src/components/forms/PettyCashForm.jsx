import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { getApiWithToken } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { generateFormPdf } from '../../utils/pdfUtils';

const PettyCashForm = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    requestorName: user?.fullName || '',
    position: '',
    department: '',
    dateRequested: new Date().toISOString().split('T')[0],
    amountRs: '',
    reasonForRequest: '',
    expectedSpendingDate: '',
    declarationAmount: '',
    requestingOfficerDate: new Date().toISOString().split('T')[0],
    departmentHeadDate: '',
    costCenter: '',
    financeDate: '',
    voucherNo: ''
  });

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      'requestorName', 'position', 'department', 'amountRs',
      'reasonForRequest', 'expectedSpendingDate'
    ];

    const missingFields = requiredFields.filter(field => !basicInfo[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Getting authenticated API instance...');

      // Get token directly from Clerk
      const token = await getToken();
      console.log('Token from useAuth hook:', token ? 'Received (first 10 chars: ' + token.substring(0, 10) + '...)' : 'Not received');

      // Include user information in the request
      const userData = {
        email: user?.primaryEmailAddress?.emailAddress,
        fullName: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      };

      console.log('Submitting form with data:', {
        formType: 'petty_cash',
        formData: {
          basicInfo: basicInfo
        },
        email: userData.email,
        fullName: userData.fullName
      });

      // Create a direct axios instance with the token
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/forms/submit',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          formType: 'petty_cash',
          formData: {
            basicInfo: basicInfo
          },
          email: userData.email,
          fullName: userData.fullName
        }
      });

      console.log('Form submission response:', response.data);

      if (response.data.success) {
        setSubmitted(true);
        alert('Form submitted successfully!');
        // The buttons will appear automatically because setSubmitted(true) triggers the conditional rendering
      } else {
        alert(response.data.message || 'Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      });

      let errorMessage = 'Error submitting form. ';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += 'No response received from server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Show loading state
      alert('Generating PDF...');

      // Get token from Clerk
      const token = await getToken();

      // Use the utility function to generate PDF
      await generateFormPdf(
        {
          basicInfo: basicInfo
        },
        'petty_cash',
        {
          fullName: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || ''
        },
        token
      );
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleViewRequests = () => {
    navigate('/requests');
  };

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Petty Cash Request Form</h1>
        <p className="text-sm mt-2 text-gray-600">Request must be submitted at least 2 working days before required date</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Requestor Name</label>
            <input
              type="text"
              name="requestorName"
              value={basicInfo.requestorName}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
              disabled={submitted}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <div className="relative">
              <select
                name="position"
                value={basicInfo.position}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                required
                disabled={submitted}
              >
                <option className='text-sm' value="">Select Position</option>
                <option className='text-sm' value="Senior Lecturer">Senior Lecturer</option>
                <option className='text-sm' value="Lecturer">Lecturer</option>
                <option className='text-sm' value="Temporary Lecturer">Temporary Lecturer</option>
                <option className='text-sm' value="Probationary Lecturer">Probationary Lecturer</option>
                <option className='text-sm' value="Instructor">Instructor</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <div className="relative">
              <select
                name="department"
                value={basicInfo.department}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                required
                disabled={submitted}
              >
                <option className='text-sm' value="">Select Department</option>
                <option className='text-sm' value="Electrical">
                  Department of Electrical and Information Engineering
                </option>
                <option className='text-sm' value="Mechanical">
                  Department of Mechanical and Manufacturing Engineering
                </option>
                <option className='text-sm' value="Civil">
                  Department of Civil and Environmental Engineering
                </option>
                <option className='text-sm' value="Marine">
                  Department of Marine Engineering and Naval Architecture
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Requested</label>
            <input
              type="date"
              name="dateRequested"
              value={basicInfo.dateRequested}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
              disabled={submitted}
            />
          </div>
        </div>

        {/* Amount and Date Section - All in one row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount Required (Rs.)</label>
            <input
              type="number"
              name="amountRs"
              value={basicInfo.amountRs}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
              min="0"
              disabled={submitted}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Date of Spending</label>
            <input
              type="date"
              name="expectedSpendingDate"
              value={basicInfo.expectedSpendingDate}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
              disabled={submitted}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reason for Request (Please provide detailed explanation)</label>
          <textarea
            name="reasonForRequest"
            value={basicInfo.reasonForRequest}
            onChange={handleBasicInfoChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            rows="4"
            required
            disabled={submitted}
          />
        </div>



        {/* Buttons Section */}
        <div className="mt-6 flex justify-start gap-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded mr-2 ${(isSubmitting || submitted) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={isSubmitting || submitted}
          >
            {isSubmitting ? 'Submitting...' : submitted ? 'Submitted' : 'Submit'}
          </button>
          {submitted && (
            <>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={handleDownloadPDF}
              >
                Download Form
              </button>
              <button
                type="button"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                onClick={handleViewRequests}
              >
                View My Requests
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PettyCashForm;
