import React, { useState } from 'react';

const ExamDutyForm = () => {
  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    officerName: '',
    position: '',
    department: '',
    bankAccount: '',
    bankName: '',
    branch: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Examination Duty Payment Request Form</h1>
        <p className="text-sm mt-2 text-gray-600">Must be processed within 14 days from the date of duty</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name of Examination</label>
            <input
              type="text"
              name="officerName"
              value={basicInfo.officerName}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Venue</label>
            <input
              type="text"
              name="position"
              value={basicInfo.position}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Module Code</label>
            <input
              type="text"
              name="branch"
              value={basicInfo.branch}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of candidates</label>
            <input
              type="text"
              name="bankAccount"
              value={basicInfo.bankAccount}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
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
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="date"
                        value={detail.date}
                        onChange={(e) => handleExamDetailChange(index, 'date', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.venue}
                        onChange={(e) => handleExamDetailChange(index, 'venue', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.startTime}
                        onChange={(e) => handleExamDetailChange(index, 'startTime', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.endTime}
                        onChange={(e) => handleExamDetailChange(index, 'endTime', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.hoursWorked}
                        readOnly
                        className="w-full p-1 border rounded bg-gray-50"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.payPerHour}
                        onChange={(e) => handleExamDetailChange(index, 'payPerHour', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.totalAmount}
                        readOnly
                        className="w-full p-1 border rounded bg-gray-50"
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
                className="w-full p-2 border rounded"
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
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Exam Coordinator</p>
            <div className="mt-4">
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Head of Department</p>
            <div className="mt-4">
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
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

export default ExamDutyForm;
