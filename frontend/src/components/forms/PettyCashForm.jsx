import React, { useState } from 'react';

const PettyCashForm = () => {
  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    requestorName: '',
    position: '',
    department: '',
    dateRequested: '',
    amount: '',
    reasonForRequest: '',
    expectedSpendingDate: '',
  });

  // Form Control Functions
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={basicInfo.position}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={basicInfo.department}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Requested</label>
            <input
              type="date"
              name="dateRequested"
              value={basicInfo.dateRequested}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Amount and Reason Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount Required (Rs.)</label>
            <input
              type="number"
              name="amount"
              value={basicInfo.amount}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Date of Spending</label>
            <input
              type="date"
              name="expectedSpendingDate"
              value={basicInfo.expectedSpendingDate}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        {/* Certification Section */}
        <div className="mt-6">
          <p className="text-sm mb-4">
            I hereby declare that the amount of Rs. {basicInfo.amount || '___'} requested as petty cash advance 
            will be used solely for the purpose stated above. I understand that all expenses must be supported 
            by valid receipts and any unused funds must be returned within 7 working days of the expenditure. 
            I accept responsibility for the proper use and timely settlement of this advance.
          </p>
        </div>

        {/* Approval Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Requesting Officer</p>
            <div className="mt-4">
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Department Head</p>
            <div className="mt-4">
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
              <p className="text-xs mt-2">Cost Center: _____________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Finance Department</p>
            <div className="mt-4">
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
              <p className="text-xs mt-2">Voucher No: _____________</p>
            </div>
          </div>
        </div>


    

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default PettyCashForm;
