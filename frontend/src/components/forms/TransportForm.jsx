import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateFormPdf } from '../../utils/pdfUtils';

const TransportForm = ({ handleSendOtp, otpSent, isLoading, otpVerified }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });

  const [requestingOfficerDate, setRequestingOfficerDate] = useState('');
  const [headOfDepartmentDate, setHeadOfDepartmentDate] = useState('');
  const [financeOfficerDate, setFinanceOfficerDate] = useState('');
  const [financeVoucherNo, setFinanceVoucherNo] = useState('');

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    requestorName: user?.fullName || '',
    position: '',
    department: '',
    bankAccount: '',
    bankName: '',
    branch: '',
    requestingOfficerDate: new Date().toISOString().split('T')[0],
    headOfDepartmentDate: '',
    financeOfficerDate: '',
    voucherNo: ''
  });

  // Travel Details Table State
  const [travelDetails, setTravelDetails] = useState([{
    date: '',
    departureTime: '',
    arrivalTime: '',
    departureLocation: '',
    arrivalLocation: '',
    vehicleNumber: '',
    distanceTraveled: '',
    vehicleRental: '',
    transportAllowance: '',
    compositeAllowance: '',
    assistantCost: ''
  }]);

  // Expense Totals State
  const [totals, setTotals] = useState({
    transportationAllowance: '',
    combinedAllowance: '',
    assistantCost: '',
    totalRequested: '',
    advancesReceived: '',
    balanceDue: ''
  });

  // Form Control Functions
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTravelDetailChange = (index, field, value) => {
    const newTravelDetails = [...travelDetails];
    newTravelDetails[index][field] = value;
    setTravelDetails(newTravelDetails);
    calculateTotals(newTravelDetails);
  };

  const addTravelRow = () => {
    setTravelDetails([...travelDetails, {
      date: '',
      departureTime: '',
      arrivalTime: '',
      departureLocation: '',
      arrivalLocation: '',
      vehicleNumber: '',
      distanceTraveled: '',
      vehicleRental: '',
      transportAllowance: '',
      compositeAllowance: '',
      assistantCost: ''
    }]);
  };

  const calculateTotals = (details) => {
    const transportTotal = details.reduce((sum, detail) =>
      sum + (parseFloat(detail.transportAllowance) || 0), 0);
    const compositeTotal = details.reduce((sum, detail) =>
      sum + (parseFloat(detail.compositeAllowance) || 0), 0);
    const assistantTotal = details.reduce((sum, detail) =>
      sum + (parseFloat(detail.assistantCost) || 0), 0);

    const total = transportTotal + compositeTotal + assistantTotal;

    setTotals(prev => ({
      ...prev,
      transportationAllowance: transportTotal,
      combinedAllowance: compositeTotal,
      assistantCost: assistantTotal,
      totalRequested: total,
      balanceDue: total - (parseFloat(prev.advancesReceived) || 0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ message: '', type: '' });

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
          formType: 'transport',
          formData: { basicInfo, travelDetails, totals },
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
        alert('Form submitted successfully!');
        navigate('/my-requests');
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
        status: error.response?.status
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
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Show loading indicator
      alert('Generating PDF...');
      
      // Get token from Clerk
      const token = await getToken();
      
      // Prepare form data for PDF
      const formData = {
        basicInfo,
        travelDetails
      };
      
      // Use the utility function to generate PDF
      await generateFormPdf(
        formData,
        'transport',
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

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Travel Expense Request Form</h1>
        <p className="text-sm mt-2 text-gray-600">Must be paid within 30 days from the date of issue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expense Description</label>
            <input
              type="text"
              name="expenseDescription"
              value={basicInfo.expenseDescription}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Annual Consolidated Salary (Rs.)</label>
            <input
              type="number"
              name="annualSalary"
              value={basicInfo.annualSalary}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name of Officer</label>
            <input
              type="text"
              name="officerName"
              value={basicInfo.officerName}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
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

        {/* Travel Details Table */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Travel Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 border">Date</th>
                  <th className="px-2 py-2 border">Departure Time</th>
                  <th className="px-2 py-2 border">Arrival Time</th>
                  <th className="px-2 py-2 border">Location</th>
                  <th className="px-2 py-2 border">Vehicle No.</th>
                  <th className="px-2 py-2 border">Distance (km)</th>
                  <th className="px-2 py-2 border">Transport Allowance</th>
                  <th className="px-2 py-2 border">Composite Allowance</th>
                  <th className="px-2 py-2 border">Assistant Cost</th>
                </tr>
              </thead>
              <tbody>
                {travelDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="date"
                        value={detail.date}
                        onChange={(e) => handleTravelDetailChange(index, 'date', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.departureTime}
                        onChange={(e) => handleTravelDetailChange(index, 'departureTime', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.arrivalTime}
                        onChange={(e) => handleTravelDetailChange(index, 'arrivalTime', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.departureLocation}
                        onChange={(e) => handleTravelDetailChange(index, 'departureLocation', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.vehicleNumber}
                        onChange={(e) => handleTravelDetailChange(index, 'vehicleNumber', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.distanceTraveled}
                        onChange={(e) => handleTravelDetailChange(index, 'distanceTraveled', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.transportAllowance}
                        onChange={(e) => handleTravelDetailChange(index, 'transportAllowance', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.compositeAllowance}
                        onChange={(e) => handleTravelDetailChange(index, 'compositeAllowance', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.assistantCost}
                        onChange={(e) => handleTravelDetailChange(index, 'assistantCost', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addTravelRow}
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
              <label className="block text-sm font-medium mb-1">Transportation Allowance (Rs.)</label>
              <input
                type="number"
                value={totals.transportationAllowance}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Combined Allowance (Rs.)</label>
              <input
                type="number"
                value={totals.combinedAllowance}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Assistant Cost (Rs.)</label>
              <input
                type="number"
                value={totals.assistantCost}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Amount Requested (Rs.)</label>
              <input
                type="number"
                value={totals.totalRequested}
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
                  balanceDue: prev.totalRequested - (parseFloat(e.target.value) || 0)
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
            I certify that the above travel expenses that Rs. {totals.totalRequested} and claim form contains
            an accurate record of travel expenses incurred while in the service of my Government, that the travel
            expenses are necessary and actually incurred, that the rates charged are fair and reasonable, that all
            applicable laws and regulations are complied with, and that my duties have been performed in a manner
            that minimizes the cost to the Democratic Socialist Republic of Sri Lanka by choosing the shortest possible
            route.
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
                onChange={(e) => setBasicInfo(prev => ({
                  ...prev,
                  requestingOfficerDate: e.target.value
                }))}
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
                onChange={(e) => setBasicInfo(prev => ({
                  ...prev,
                  headOfDepartmentDate: e.target.value
                }))}
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
                onChange={(e) => setBasicInfo(prev => ({
                  ...prev,
                  financeOfficerDate: e.target.value
                }))}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <label className="block text-xs mt-2">Voucher No:</label>
              <input
                type="text"
                name="voucherNo"
                value={basicInfo.voucherNo}
                onChange={(e) => setBasicInfo(prev => ({
                  ...prev,
                  voucherNo: e.target.value
                }))}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-start gap-4">
          {otpVerified && (
            <button
              type="button"
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center gap-2"
              onClick={handleDownloadPDF}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download PDF
            </button>
          )}

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            {isLoading ? 'Sending...' : otpSent ? 'OTP Sent' : 'Send OTP'}
          </button>

        </div>

      </form>
    </div>
  );
};

export default TransportForm;