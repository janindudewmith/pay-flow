import React, { useState } from 'react';

const PaperMarkingForm = () => {
  const [examination, setExamination] = useState('');
  const [subject, setSubject] = useState('');
  const [examinerName, setExaminerName] = useState('');
  const [upfNo, setUpfNo] = useState('');
  const [address, setAddress] = useState('');

  const [paperDetails, setPaperDetails] = useState([
    { duration: '', noOfPapers: '', amount: '' }
  ]);
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

  const handlePaperDetailChange = (index, field, value) => {
    const newPaperDetails = [...paperDetails];
    newPaperDetails[index][field] = value;
    setPaperDetails(newPaperDetails);
  };

  const handleAddRow = () => {
    setPaperDetails([...paperDetails, { duration: '', noOfPapers: '', amount: '' }]);
  };

  const calculateTotal = () => {
    const totalPaperAmount = paperDetails.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
    const totalMarkingAmount = parseFloat(markingDetails.amount) || 0;
    const totalPracticalAmount = parseFloat(practicalDetails.amount) || 0;
    return totalPaperAmount + totalMarkingAmount + totalPracticalAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
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
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Financial Year:</label>
              <input
                type="text"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium">Programme:</label>
                <input
                  type="text"
                  value={programmeCode}
                  onChange={(e) => setProgrammeCode(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Object code:</label>
                <input
                  type="text"
                  value={objectCode}
                  onChange={(e) => setObjectCode(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Project:</label>
                <input
                  type="text"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
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
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Cheque No:</label>
              <input
                type="text"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Vote Ledger folio:</label>
                <input
                  type="text"
                  value={voteLedger}
                  onChange={(e) => setVoteLedger(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fees Ledger folio:</label>
                <input
                  type="text"
                  value={feesLedger}
                  onChange={(e) => setFeesLedger(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Examination</label>
          <input
            type="text"
            value={examination}
            onChange={(e) => setExamination(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name of Examiner</label>
          <input
            type="text"
            value={examinerName}
            onChange={(e) => setExaminerName(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">UPF No</label>
          <input
            type="text"
            value={upfNo}
            onChange={(e) => setUpfNo(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Paper Details Table */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Paper Details</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Title of Paper</th>
                <th className="border-b px-4 py-2">Duration</th>
                <th className="border-b px-4 py-2">No. of Papers</th>
                <th className="border-b px-4 py-2">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {paperDetails.map((row, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={row.duration}
                      onChange={(e) => handlePaperDetailChange(index, 'duration', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="number"
                      value={row.noOfPapers}
                      onChange={(e) => handlePaperDetailChange(index, 'noOfPapers', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="number"
                      value={row.amount}
                      onChange={(e) => handlePaperDetailChange(index, 'amount', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={handleAddRow}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Add Row
          </button>
        </div>

        {/* Marking Details */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Fee for Marking Scripts</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">No. of Scripts</label>
            <input
              type="number"
              value={markingDetails.noOfPapers}
              onChange={(e) => setMarkingDetails({ ...markingDetails, noOfPapers: e.target.value })}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
            <input
              type="number"
              value={markingDetails.amount}
              onChange={(e) => setMarkingDetails({ ...markingDetails, amount: e.target.value })}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Practical Details */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Fee for Assessing Practical/Clinical/Oral</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">No. of Candidates</label>
            <input
              type="number"
              value={practicalDetails.noOfCandidates}
              onChange={(e) => setPracticalDetails({ ...practicalDetails, noOfCandidates: e.target.value })}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
            <input
              type="number"
              value={practicalDetails.amount}
              onChange={(e) => setPracticalDetails({ ...practicalDetails, amount: e.target.value })}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
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
            <p className="text-sm font-medium mb-2">Head of Department</p>
            <p className="text-xs mb-4">Recommended for payment</p>
            <div className="border-t pt-2">
              <p className="text-xs">Date: ________________</p>
              <p className="text-xs">Signature: ________________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium mb-2">Subject Clerk</p>
            <p className="text-xs mb-4">Checked by: ________________</p>
            <div className="border-t pt-2">
              <p className="text-xs">Date: ________________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium mb-2">Payment Approval</p>
            <p className="text-xs mb-2">Registrar/Senior Asst. Registrar</p>
            <div className="border-t pt-2">
              <p className="text-xs">Date: ________________</p>
              <p className="text-xs">Signature: ________________</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default PaperMarkingForm;