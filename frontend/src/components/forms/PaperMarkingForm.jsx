import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateFormPdf } from '../../utils/pdfUtils';

const PaperMarkingForm = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [examination, setExamination] = useState('');
  const [subject, setSubject] = useState('');
  const [examinerName, setExaminerName] = useState('');
  const [upfNo, setUpfNo] = useState('');
  const [address, setAddress] = useState('');
  const [paperDetails, setPaperDetails] = useState([{ duration: '', noOfPapers: '', ratePerPaper: '', amount: '' }]);
  const [markingDetails, setMarkingDetails] = useState({ noOfPapers: '', amount: '' });
  const [practicalDetails, setPracticalDetails] = useState({ noOfCandidates: '', amount: '' });
  const [voucherNo, setVoucherNo] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const [programmeCode, setProgrammeCode] = useState('');
  const [objectCode, setObjectCode] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [date, setDate] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [voteLedger, setVoteLedger] = useState('');
  const [feesLedger, setFeesLedger] = useState('');
  const [requestingOfficerDate, setRequestingOfficerDate] = useState('');
  const [headOfDepartmentDate, setHeadOfDepartmentDate] = useState('');
  const [subjectClerkDate, setSubjectClerkDate] = useState('');
  const [financeOfficerDate, setFinanceOfficerDate] = useState('');
  const [financeVoucherNo, setFinanceVoucherNo] = useState('');

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    examinerName: user?.fullName || '',
    position: '',
    department: '',
    examination: '',
    subject: '',
    upfNo: '',
    address: '',
    requestingOfficerDate: new Date().toISOString().split('T')[0],
    headOfDepartmentDate: '',
    financeOfficerDate: '',
    voucherNo: ''
  });

  const handlePaperDetailChange = (index, field, value) => {
    const newPaperDetails = [...paperDetails];
    newPaperDetails[index][field] = value;

    // Calculate amount when noOfPapers or ratePerPaper changes
    if (field === 'noOfPapers' || field === 'ratePerPaper') {
      const noOfPapers = parseFloat(newPaperDetails[index].noOfPapers) || 0;
      const ratePerPaper = parseFloat(newPaperDetails[index].ratePerPaper) || 0;
      newPaperDetails[index].amount = (noOfPapers * ratePerPaper).toFixed(2);
    }

    setPaperDetails(newPaperDetails);
  };

  const handleAddRow = () => {
    setPaperDetails([...paperDetails, { duration: '', noOfPapers: '', amount: '' }]);
  };

  const calculateTotal = () => {
    const totalPaperAmount = paperDetails.reduce((acc, item) =>
      acc + (parseFloat(item.noOfPapers || 0) * parseFloat(item.ratePerPaper || 0)), 0);
    const totalMarkingAmount = parseFloat(markingDetails.amount) || 0;
    const totalPracticalAmount = parseFloat(practicalDetails.amount) || 0;
    return (totalPaperAmount + totalMarkingAmount + totalPracticalAmount).toFixed(2);
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

      // Prepare form data
      const formData = {
        basicInfo: {
          ...basicInfo,
          examinerName: examinerName || user?.fullName || '',
          examination,
          subject,
          upfNo,
          address
        },
        paperDetails,
        markingDetails,
        practicalDetails,
        totalAmount: calculateTotal()
      };

      // Create a direct axios instance with the token
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios({
        method: 'post',
        url: `${API_URL}/api/forms/submit`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          formType: 'paper_marking',
          formData: {
            basicInfo: {
              ...basicInfo,
              examinerName: examinerName || user?.fullName || '',
              examination,
              subject,
              upfNo,
              address
            },
            paperDetails,
            markingDetails,
            practicalDetails,
            totalAmount: calculateTotal()
          },
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

      // Prepare form data for PDF
      const formData = {
        basicInfo: {
          ...basicInfo,
          examinerName: examinerName || user?.fullName || '',
          examination,
          subject,
          upfNo,
          address
        },
        paperDetails,
        markingDetails,
        practicalDetails,
        totalAmount: calculateTotal()
      };

      // Use the utility function to generate PDF
      await generateFormPdf(
        formData,
        'paper_marking',
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
    <div className="max-w-4xl border border-gray-300 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">UNIVERSITY OF RUHUNA</h1>
        <p className="text-sm mt-2 font-semibold">Payment for setting/moderating question papers and marking/assessing scripts/practical/clinical/oral</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Administrative Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Voucher No:</label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Financial Year:</label>
              <input
                type="text"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium">Programme:</label>
                <input
                  type="text"
                  value={programmeCode}
                  onChange={(e) => setProgrammeCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Object code:</label>
                <input
                  type="text"
                  value={objectCode}
                  onChange={(e) => setObjectCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Project:</label>
                <input
                  type="text"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Cheque No:</label>
              <input
                type="text"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Vote Ledger folio:</label>
                <input
                  type="text"
                  value={voteLedger}
                  onChange={(e) => setVoteLedger(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fees Ledger folio:</label>
                <input
                  type="text"
                  value={feesLedger}
                  onChange={(e) => setFeesLedger(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Examination</label>
            <div className="relative">
              <select
                value={examination}
                onChange={(e) => setExamination(e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name of Examiner</label>
            <input
              type="text"
              value={examinerName}
              onChange={(e) => setExaminerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UPF No</label>
            <input
              type="text"
              value={upfNo}
              onChange={(e) => setUpfNo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            required
          />
        </div>

        {/* Paper Details Table */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Paper Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 border">Title of Paper</th>
                  <th className="px-2 py-2 border">Duration (hrs)</th>
                  <th className="px-2 py-2 border">No. of Papers</th>
                  <th className="px-2 py-2 border">Rate/Paper (Rs.)</th>
                  <th className="px-2 py-2 border">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {paperDetails.map((row, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={row.duration}
                        onChange={(e) => handlePaperDetailChange(index, 'duration', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={row.noOfPapers}
                        onChange={(e) => handlePaperDetailChange(index, 'noOfPapers', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={row.ratePerPaper}
                        onChange={(e) => handlePaperDetailChange(index, 'ratePerPaper', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={
                          (parseFloat(row.noOfPapers || 0) * parseFloat(row.ratePerPaper || 0)) === 0
                            ? ""
                            : (parseFloat(row.noOfPapers || 0) * parseFloat(row.ratePerPaper || 0)).toFixed(2)
                        }
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
            onClick={handleAddRow}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Row
          </button>
        </div>

        {/* Marking Details */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Fee for Marking Scripts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">No. of Scripts</label>
              <input
                type="number"
                value={markingDetails.noOfPapers}
                onChange={(e) => setMarkingDetails({ ...markingDetails, noOfPapers: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
              <input
                type="number"
                value={markingDetails.amount}
                onChange={(e) => setMarkingDetails({ ...markingDetails, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Practical Details */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Fee for Assessing Practical/Clinical/Oral</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">No. of Candidates</label>
              <input
                type="number"
                value={practicalDetails.noOfCandidates}
                onChange={(e) => setPracticalDetails({ ...practicalDetails, noOfCandidates: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
              <input
                type="number"
                value={practicalDetails.amount}
                onChange={(e) => setPracticalDetails({ ...practicalDetails, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Total Amount Section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Total Amount</h3>
          <p className="text-sm font-semibold">Total Paper Marking Fees: Rs. {calculateTotal()}</p>
        </div>

        {/* Approval Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
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

export default PaperMarkingForm;