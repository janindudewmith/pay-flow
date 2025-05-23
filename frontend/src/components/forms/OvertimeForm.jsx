import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateFormPdf } from '../../utils/pdfUtils';

const OvertimeForm = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [submitted, setSubmitted] = useState(false);

  const [requestingOfficerDate, setRequestingOfficerDate] = useState('');
  const [headOfDepartmentDate, setHeadOfDepartmentDate] = useState('');
  const [financeOfficerDate, setFinanceOfficerDate] = useState('');
  const [financeVoucherNo, setFinanceVoucherNo] = useState('');

  const [authorization, setAuthorization] = useState({
    nameOfApplicant: '',
    designation: '',
    payUnit: '',
    salaryPerMonth: '',
    overtimeRate: ''
  });

  const [overtimeDetails, setOvertimeDetails] = useState([{
    date: '',
    timeFrom: '',
    timeTo: '',
    numberOfHours: '',
    description: '',
    unitsCompleted: '',
    approverSignature: ''
  }]);

  const [payment, setPayment] = useState({
    department: '',
    voucherNo: ''
  });

  const [expenditure, setExpenditure] = useState([{
    natureOfService: '',
    fund: '',
    headOfExpenditure: '',
    subHead: '',
    primaryUnit: '',
    secondaryUnit: '',
    amountRs: '',
    amountCts: ''
  }]);

  const [totalAmount, setTotalAmount] = useState({
    amountInWords: '',
    amountInFigures: '',
    deductions: '',
    netAmountPayable: ''
  });

  const [signatures, setSignatures] = useState({
    checkingOfficerDate: '',
    checkingOfficerSignature: '',
    certifyingOfficerDate: '',
    certifyingOfficerSignature: '',
    payeeSignature: '',
    chequeNo: '',
    receivedAmount: '',
    receivedDate: '',
    witness1: '',
    witness2: ''
  });

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    employeeName: user?.fullName || '',
    position: '',
    department: '',
    requestingOfficerDate: new Date().toISOString().split('T')[0],
    headOfDepartmentDate: '',
    financeOfficerDate: '',
    voucherNo: ''
  });

  const calculateHoursWorked = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000/01/01 ${startTime}`);
    const end = new Date(`2000/01/01 ${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  };

  const handleOvertimeDetailChange = (index, field, value) => {
    const newDetails = [...overtimeDetails];
    newDetails[index][field] = value;

    // Calculate hours worked if times are changed
    if (field === 'timeFrom' || field === 'timeTo') {
      const hoursWorked = calculateHoursWorked(
        newDetails[index].timeFrom,
        newDetails[index].timeTo
      );
      newDetails[index].numberOfHours = hoursWorked.toFixed(2);
    }

    setOvertimeDetails(newDetails);
    calculateTotalAmount(newDetails);
  };

  const calculateTotalAmount = (details) => {
    const total = details.reduce((sum, detail) => {
      return sum + (parseFloat(detail.numberOfHours) * parseFloat(authorization.overtimeRate) || 0);
    }, 0);

    setTotalAmount(prev => ({
      ...prev,
      amountInFigures: total.toFixed(2),
      netAmountPayable: (total - (parseFloat(prev.deductions) || 0)).toFixed(2)
    }));
  };

  const handleExpenditureChange = (index, field, value) => {
    const newExpenditure = [...expenditure];
    newExpenditure[index][field] = value;
    setExpenditure(newExpenditure);
  };

  const handleAddOvertimeRow = () => {
    setOvertimeDetails([...overtimeDetails, {
      date: '',
      timeFrom: '',
      timeTo: '',
      numberOfHours: '',
      description: '',
      unitsCompleted: '',
      approverSignature: ''
    }]);
  };

  const handleAddExpenditureRow = () => {
    setExpenditure([...expenditure, {
      natureOfService: '',
      fund: '',
      headOfExpenditure: '',
      subHead: '',
      primaryUnit: '',
      secondaryUnit: '',
      amountRs: '',
      amountCts: ''
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Prepare form data
      const formData = {
        basicInfo: {
          ...basicInfo,
          employeeName: payment.nameOfApplicant || user?.fullName || '',
          position: payment.designation || '',
          department: payment.department || ''
        },
        authorization,
        overtimeDetails,
        payment,
        expenditure,
        totalAmount,
        signatures
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
          formType: 'overtime',
          formData,
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
    }
  };

  const handleDownloadPDF = async () => {
    try {
      alert('Generating PDF...');
      const token = await getToken();
      await generateFormPdf(
        formData,
        'overtime',
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
    <div className="max-w-4xl border border-gray-300 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">UNIVERSITY OF RUHUNA</h1>
        <p className="text-sm mt-2 font-semibold">Overtime Voucher</p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Administrative Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Name of the Applicant:</label>
              <input
                type="text"
                value={payment.nameOfApplicant}
                onChange={(e) => setPayment({ ...payment, nameOfApplicant: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Voucher No:</label>
              <input
                type="text"
                value={payment.voucherNo}
                onChange={(e) => setPayment({ ...payment, voucherNo: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Department:</label>
              <div className="relative">
                <select
                  value={payment.department}
                  onChange={(e) => setPayment({ ...payment, department: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                  required
                >
                  <option className='text-sm' value="">Select Department</option>
                  <option className='text-sm' value="Electrical">Department of Electrical and Information Engineering</option>
                  <option className='text-sm' value="Mechanical">Department of Mechanical and Manufacturing Engineering</option>
                  <option className='text-sm' value="Civil">Department of Civil and Environmental Engineering</option>
                  <option className='text-sm' value="Marine">Department of Marine Engineering and Naval Architecture</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Designation:</label>
              <div className="relative">
                <select
                  value={payment.designation}
                  onChange={(e) => setPayment({ ...payment, designation: e.target.value })}
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
            <div className="mb-3">
              <label className="block text-sm font-medium">Salary per Month (Rs):</label>
              <input
                type="number"
                value={authorization.salaryPerMonth}
                onChange={(e) => setAuthorization({ ...authorization, salaryPerMonth: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Overtime Rate (Rs/hr):</label>
              <input
                type="number"
                value={authorization.overtimeRate}
                onChange={(e) => setAuthorization({ ...authorization, overtimeRate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Overtime Details Table */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Overtime Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 border">Description</th>
                  <th className="px-2 py-2 border">Date</th>
                  <th className="px-2 py-2 border">Time From</th>
                  <th className="px-2 py-2 border">Time To</th>
                  <th className="px-2 py-2 border">No. of Hours</th>
                  <th className="px-2 py-2 border">Units Completed</th>
                  <th className="px-2 py-2 border">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {overtimeDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.description}
                        onChange={(e) => handleOvertimeDetailChange(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="date"
                        value={detail.date}
                        onChange={(e) => handleOvertimeDetailChange(index, 'date', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.timeFrom}
                        onChange={(e) => handleOvertimeDetailChange(index, 'timeFrom', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.timeTo}
                        onChange={(e) => handleOvertimeDetailChange(index, 'timeTo', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.numberOfHours}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.unitsCompleted}
                        onChange={(e) => handleOvertimeDetailChange(index, 'unitsCompleted', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={(parseFloat(detail.numberOfHours) * parseFloat(authorization.overtimeRate)).toFixed(2)}
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
            onClick={handleAddOvertimeRow}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Row
          </button>
        </div>

        {/* Total Amount */}
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-medium mb-2">Total Amount</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount in Words:</label>
              <input
                type="text"
                value={totalAmount.amountInWords}
                onChange={(e) => setTotalAmount({ ...totalAmount, amountInWords: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount in Figures:</label>
              <input
                type="text"
                value={totalAmount.amountInFigures}
                onChange={(e) => setTotalAmount({ ...totalAmount, amountInFigures: e.target.value })}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Deductions:</label>
              <input
                type="number"
                value={totalAmount.deductions}
                onChange={(e) => setTotalAmount({ ...totalAmount, deductions: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Net Amount Payable:</label>
              <input
                type="text"
                value={totalAmount.netAmountPayable}
                onChange={(e) => setTotalAmount({ ...totalAmount, netAmountPayable: e.target.value })}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>
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
                value={requestingOfficerDate}
                onChange={(e) => setRequestingOfficerDate(e.target.value)}
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
                value={headOfDepartmentDate}
                onChange={(e) => setHeadOfDepartmentDate(e.target.value)}
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
                value={financeOfficerDate}
                onChange={(e) => setFinanceOfficerDate(e.target.value)}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <label className="block text-xs mt-2">Voucher No:</label>
              <input
                type="text"
                name="voucherNo"
                value={financeVoucherNo}
                onChange={(e) => setFinanceVoucherNo(e.target.value)}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-start gap-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded mr-2 ${(submitted || submitted) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={submitted || submitted}
          >
            {submitted ? 'Submitted' : 'Submit'}
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

export default OvertimeForm;
