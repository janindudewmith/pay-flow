import React, { useState } from 'react';

const PettyCashForm = () => {
  const [basicInfo, setBasicInfo] = useState({
    requestorName: '',
    position: '',
    department: '',
    dateRequested: '',
    amountRs: '',
    amountCts: '',
    reasonForRequest: '',
    expectedSpendingDate: '',
    declarationAmount: '',
    requestingOfficerDate: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
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
            />
          </div>
        </div>

        {/* Amount and Date Section - All in one row */}
        <div className="grid grid-cols-3 gap-4">
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">(Cts.)</label>
            <input
              type="number"
              name="amountCts"
              value={basicInfo.amountCts}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
              min="0"
              max="99"
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
          />
        </div>

        {/* Certification Section */}
        <div className="mt-6">
          <p className="text-sm mb-4">
            I hereby declare that the amount of Rs.
            <input
              type="text"
              name="declarationAmount"
              value={basicInfo.declarationAmount}
              onChange={handleBasicInfoChange}
              className="p-1 mx-2 w-20 inline-block border border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            requested as petty cash advance will be used solely for the purpose stated above. I understand that all expenses must be supported
            by valid receipts and any unused funds must be returned within 7 working days of the expenditure.
            I accept responsibility for the proper use and timely settlement of this advance.
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
            <p className="text-sm font-medium">Department Head</p>
            <div className="mt-4">
              <label className="block text-xs">Date:</label>
              <input
                type="date"
                name="departmentHeadDate"
                value={basicInfo.departmentHeadDate}
                onChange={handleBasicInfoChange}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <label className="block text-xs mt-2">Cost Center:</label>
              <input
                type="text"
                name="costCenter"
                value={basicInfo.costCenter}
                onChange={handleBasicInfoChange}
                className="w-full p-1 border text-xs mt-1 border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Finance Department</p>
            <div className="mt-4">
              <label className="block text-xs">Date:</label>
              <input
                type="date"
                name="financeDate"
                value={basicInfo.financeDate}
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
            type="button"
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center gap-2"
            onClick={() => alert('Downloading PDF...')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download as PDF
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default PettyCashForm;
