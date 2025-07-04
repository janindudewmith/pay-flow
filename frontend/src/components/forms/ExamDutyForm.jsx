import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateFormPdf } from '../../utils/pdfUtils';

const ExamDutyForm = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    officerName: user?.fullName || '',
    position: '',
    department: '',
    bankAccount: '',
    bankName: '',
    branch: '',
    venue: '',
    numberOfCandidates: '',
    requestingOfficerDate: new Date().toISOString().split('T')[0],
    examCoordinatorDate: '',
    headOfDepartmentDate: '',
    financeOfficerDate: '',
    voucherNo: ''
  });

  // Exam Details Table State
  const [examDetails, setExamDetails] = useState([{
    examName: '',
    date: '',
    venue: '',
    startTime: '',
    endTime: '',
    hoursWorked: '',
    payPerHour: '',
    totalAmount: ''
  }]);

  // Totals State
  const [totals, setTotals] = useState({
    totalHours: 0,
    totalAmount: 0,
    advancesReceived: 0,
    balanceDue: 0
  });

  // Form Control Functions
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateHoursWorked = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000/01/01 ${startTime}`);
    const end = new Date(`2000/01/01 ${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  };

  const handleExamDetailChange = (index, field, value) => {
    const newExamDetails = [...examDetails];
    newExamDetails[index][field] = value;

    // Calculate hours worked if times are changed
    if (field === 'startTime' || field === 'endTime') {
      const hoursWorked = calculateHoursWorked(
        newExamDetails[index].startTime,
        newExamDetails[index].endTime
      );
      newExamDetails[index].hoursWorked = hoursWorked.toFixed(2);

      // Update total amount for this row
      if (newExamDetails[index].payPerHour) {
        newExamDetails[index].totalAmount = (hoursWorked * parseFloat(newExamDetails[index].payPerHour)).toFixed(2);
      }
    }

    // Calculate total amount if pay per hour is changed
    if (field === 'payPerHour') {
      const hours = parseFloat(newExamDetails[index].hoursWorked) || 0;
      newExamDetails[index].totalAmount = (hours * parseFloat(value)).toFixed(2);
    }

    setExamDetails(newExamDetails);
    calculateTotals(newExamDetails);
  };

  const addExamRow = () => {
    setExamDetails([...examDetails, {
      examName: '',
      date: '',
      venue: '',
      startTime: '',
      endTime: '',
      hoursWorked: '',
      payPerHour: '',
      totalAmount: ''
    }]);
  };

  const calculateTotals = (details) => {
    const totalHours = details.reduce((sum, detail) =>
      sum + (parseFloat(detail.hoursWorked) || 0), 0);
    const totalAmount = details.reduce((sum, detail) =>
      sum + (parseFloat(detail.totalAmount) || 0), 0);

    setTotals(prev => ({
      ...prev,
      totalHours,
      totalAmount,
      balanceDue: totalAmount - (parseFloat(prev.advancesReceived) || 0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', type: '' });
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

      // Create a direct axios instance with the token
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/forms/submit',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          formType: 'exam_duty',
          formData: { basicInfo, examDetails, totals },
          email: userData.email,
          fullName: userData.fullName
        }
      });

      console.log('Form submission response:', response.data);

      if (response.data.success) {
        setSubmitStatus({
          message: 'Request submitted successfully!',
          type: 'success'
        });
        setSubmitted(true);
        alert('Form submitted successfully!');
        // navigate('/my-requests');
      } else {
        setSubmitStatus({
          message: response.data.message || 'Submission failed',
          type: 'error'
        });
        alert(response.data.message || 'Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });

      setSubmitStatus({
        message: error.response?.data?.message || 'Submission failed',
        type: 'error'
      });
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error submitting form. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      alert('Generating PDF...');
      const token = await getToken();
      const formData = { basicInfo, examDetails, totals };
      await generateFormPdf(
        formData,
        'exam_duty',
        {
          fullName: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || ''
        },
        token
      );
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleViewRequests = () => {
    navigate('/requests');
  };

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Examination Duty Payment Request Form</h1>
        <p className="text-sm mt-2 text-gray-600">Must be processed within 14 days from the date of duty</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name of Examination</label>
            <div className="relative">
              <select
                name="officerName"
                value={basicInfo.officerName}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                required
              >
                <option className='text-sm' value="">Select Examination</option>
                <option className='text-sm' value="Semester 1">End Semester 1 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 2">End Semester 2 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 3">End Semester 3 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 4">End Semester 4 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 5">End Semester 5 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 6">End Semester 6 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 7">End Semester 7 - Examination in Engineering</option>
                <option className='text-sm' value="Semester 8">End Semester 8 - Examination in Engineering</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Venue</label>
            <div className="relative">
              <select
                name="venue"
                value={basicInfo.venue}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                required
              >
                <option className='text-sm' value="">Select Venue</option>
                <option className='text-sm' value="Drawing Office 1">Drawing Office 1</option>
                <option className='text-sm' value="Drawing Office 2">Drawing Office 2</option>
                <option className='text-sm' value="Gymnasium">Gymnasium</option>
                <option className='text-sm' value="New Computer Center">New Computer Center</option>
                <option className='text-sm' value="Old Computer Center">Old Computer Center</option>
                <option className='text-sm' value="Lecture Theatre 1">Lecture Theatre 1</option>
                <option className='text-sm' value="Lecture Theatre 2">Lecture Theatre 2</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Module Name</label>
            <input
              type="text"
              name="bankName"
              value={basicInfo.bankName}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Module Code</label>
            <input
              type="text"
              name="branch"
              value={basicInfo.branch}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Candidates</label>
            <input
              type="number"
              name="numberOfCandidates"
              value={basicInfo.numberOfCandidates}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              min="0"
            />
          </div>
        </div>

        {/* Exam Details Table */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Examination Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 border">Exam Name</th>
                  <th className="px-2 py-2 border">Date</th>
                  <th className="px-2 py-2 border">Venue</th>
                  <th className="px-2 py-2 border">Start Time</th>
                  <th className="px-2 py-2 border">End Time</th>
                  <th className="px-2 py-2 border">Hours Worked</th>
                  <th className="px-2 py-2 border">Pay per Hour (Rs.)</th>
                  <th className="px-2 py-2 border">Total (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {examDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.examName}
                        onChange={(e) => handleExamDetailChange(index, 'examName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="date"
                        value={detail.date}
                        onChange={(e) => handleExamDetailChange(index, 'date', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <div className="relative">
                        <select
                          name="venue"
                          value={basicInfo.venue}
                          onChange={handleBasicInfoChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                          required
                        >
                          <option className='text-sm' value=""></option>
                          <option className='text-sm' value="Drawing Office 1">Drawing Office 1</option>
                          <option className='text-sm' value="Drawing Office 2">Drawing Office 2</option>
                          <option className='text-sm' value="Gymnasium">Gymnasium</option>
                          <option className='text-sm' value="New Computer Center">New Computer Center</option>
                          <option className='text-sm' value="Old Computer Center">Old Computer Center</option>
                          <option className='text-sm' value="Lecture Theatre 1">Lecture Theatre 1</option>
                          <option className='text-sm' value="Lecture Theatre 2">Lecture Theatre 2</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.startTime}
                        onChange={(e) => handleExamDetailChange(index, 'startTime', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.endTime}
                        onChange={(e) => handleExamDetailChange(index, 'endTime', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.hoursWorked}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.payPerHour}
                        onChange={(e) => handleExamDetailChange(index, 'payPerHour', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.totalAmount}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addExamRow}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Row
          </button>
        </div>

        {/* Totals Section */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Total Amounts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Hours Worked</label>
              <input
                type="number"
                value={totals.totalHours}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Amount (Rs.)</label>
              <input
                type="number"
                value={totals.totalAmount}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Advances Received (Rs.)</label>
              <input
                type="number"
                value={totals.advancesReceived}
                onChange={(e) => setTotals(prev => ({
                  ...prev,
                  advancesReceived: e.target.value,
                  balanceDue: prev.totalAmount - (parseFloat(e.target.value) || 0)
                }))}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Balance Due (Rs.)</label>
              <input
                type="number"
                value={totals.balanceDue}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Certification Section */}
        <div className="mt-6">
          <p className="text-sm mb-4">
            I certify that the above examination duties totaling Rs. {totals.totalAmount} were performed by me
            as specified above. I confirm that all the information provided is accurate and complete, and the duties
            were carried out according to the examination regulations and guidelines set forth by the institution.
          </p>
        </div>

        {/* Approval Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Requesting Officer</p>
            <div className="mt-4">
              <label className="block text-xs">Date:</label>
              <input
                type="date"
                name="requestingOfficerDate"
                value={basicInfo.requestingOfficerDate}
                onChange={handleBasicInfoChange}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Head of Department</p>
            <div className="mt-4">
              <label className="block text-xs">Date:</label>
              <input
                type="date"
                name="headOfDepartmentDate"
                value={basicInfo.headOfDepartmentDate}
                onChange={handleBasicInfoChange}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Finance Officer</p>
            <div className="mt-4">
              <label className="block text-xs">Date:</label>
              <input
                type="date"
                name="financeOfficerDate"
                value={basicInfo.financeOfficerDate}
                onChange={handleBasicInfoChange}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <label className="block text-xs mt-2">Voucher No:</label>
              <input
                type="text"
                name="voucherNo"
                value={basicInfo.voucherNo}
                onChange={handleBasicInfoChange}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
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

export default ExamDutyForm;
