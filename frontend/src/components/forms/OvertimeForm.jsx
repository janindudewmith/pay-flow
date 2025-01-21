import React, { useState } from 'react';

const OvertimeForm = () => {
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

  const handleOvertimeDetailChange = (index, field, value) => {
    const newDetails = [...overtimeDetails];
    newDetails[index][field] = value;
    setOvertimeDetails(newDetails);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
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
              <label className="block text-sm font-medium">Name of the applicant:</label>
              <input
                type="text"
                value={payment.nameOfApplicant}
                onChange={(e) => setPayment({ ...payment, nameOfApplicant: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Voucher No:</label>
              <input
                type="text"
                value={payment.voucherNo}
                onChange={(e) => setPayment({ ...payment, voucherNo: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Department:</label>
              <input
                type="text"
                value={payment.department}
                onChange={(e) => setPayment({ ...payment, department: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Designation:</label>
              <input
                type="text"
                value={payment.designation}
                onChange={(e) => setPayment({ ...payment, designation: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Salary Per Month:</label>
              <input
                type="text"
                value={authorization.salaryPerMonth}
                onChange={(e) => setAuthorization({ ...authorization, salaryPerMonth: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Overtime Rate:</label>
              <input
                type="text"
                value={authorization.overtimeRate}
                onChange={(e) => setAuthorization({ ...authorization, overtimeRate: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* Overtime Details Table */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Overtime Details</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Date</th>
                <th className="border-b px-4 py-2">Time From</th>
                <th className="border-b px-4 py-2">Time To</th>
                <th className="border-b px-4 py-2">No. of Hours</th>
                <th className="border-b px-4 py-2">Description</th>
                <th className="border-b px-4 py-2">Units Completed</th>
                <th className="border-b px-4 py-2">Approver Signature</th>
              </tr>
            </thead>
            <tbody>
              {overtimeDetails.map((detail, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">
                    <input
                      type="date"
                      value={detail.date}
                      onChange={(e) => handleOvertimeDetailChange(index, 'date', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={detail.timeFrom}
                      onChange={(e) => handleOvertimeDetailChange(index, 'timeFrom', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={detail.timeTo}
                      onChange={(e) => handleOvertimeDetailChange(index, 'timeTo', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={detail.numberOfHours}
                      onChange={(e) => handleOvertimeDetailChange(index, 'numberOfHours', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={detail.description}
                      onChange={(e) => handleOvertimeDetailChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={detail.unitsCompleted}
                      onChange={(e) => handleOvertimeDetailChange(index, 'unitsCompleted', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={detail.approverSignature}
                      onChange={(e) => handleOvertimeDetailChange(index, 'approverSignature', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={handleAddOvertimeRow}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Add Row
          </button>
        </div>

        {/* Expenditure Details */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Expenditure Details</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Nature of Service</th>
                <th className="border-b px-4 py-2">Fund</th>
                <th className="border-b px-4 py-2">Head of Expenditure</th>
                <th className="border-b px-4 py-2">Sub-Head</th>
                <th className="border-b px-4 py-2">Primary Unit</th>
                <th className="border-b px-4 py-2">Secondary Unit</th>
                <th className="border-b px-4 py-2">Amount (Rs)</th>
                <th className="border-b px-4 py-2">Amount (Cts)</th>
              </tr>
            </thead>
            <tbody>
              {expenditure.map((exp, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.natureOfService}
                      onChange={(e) => handleExpenditureChange(index, 'natureOfService', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.fund}
                      onChange={(e) => handleExpenditureChange(index, 'fund', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.headOfExpenditure}
                      onChange={(e) => handleExpenditureChange(index, 'headOfExpenditure', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.subHead}
                      onChange={(e) => handleExpenditureChange(index, 'subHead', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.primaryUnit}
                      onChange={(e) => handleExpenditureChange(index, 'primaryUnit', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.secondaryUnit}
                      onChange={(e) => handleExpenditureChange(index, 'secondaryUnit', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.amountRs}
                      onChange={(e) => handleExpenditureChange(index, 'amountRs', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="border-b px-4 py-2">
                    <input
                      type="text"
                      value={exp.amountCts}
                      onChange={(e) => handleExpenditureChange(index, 'amountCts', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={handleAddExpenditureRow}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Add Row
          </button>
        </div>

        {/* Total Amount and Signatures */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Total Amount</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount in Words:</label>
              <input
                type="text"
                value={totalAmount.amountInWords}
                onChange={(e) => setTotalAmount({ ...totalAmount, amountInWords: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount in Figures:</label>
              <input
                type="text"
                value={totalAmount.amountInFigures}
                onChange={(e) => setTotalAmount({ ...totalAmount, amountInFigures: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Deductions:</label>
              <input
                type="text"
                value={totalAmount.deductions}
                onChange={(e) => setTotalAmount({ ...totalAmount, deductions: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Net Amount Payable:</label>
              <input
                type="text"
                value={totalAmount.netAmountPayable}
                onChange={(e) => setTotalAmount({ ...totalAmount, netAmountPayable: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Signatures</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Checking Officer Date:</label>
              <input
                type="date"
                value={signatures.checkingOfficerDate}
                onChange={(e) => setSignatures({ ...signatures, checkingOfficerDate: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Checking Officer Signature:</label>
              <input
                type="text"
                value={signatures.checkingOfficerSignature}
                onChange={(e) => setSignatures({ ...signatures, checkingOfficerSignature: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Certifying Officer Date:</label>
              <input
                type="date"
                value={signatures.certifyingOfficerDate}
                onChange={(e) => setSignatures({ ...signatures, certifyingOfficerDate: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Certifying Officer Signature:</label>
              <input
                type="text"
                value={signatures.certifyingOfficerSignature}
                onChange={(e) => setSignatures({ ...signatures, certifyingOfficerSignature: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Payee Signature:</label>
              <input
                type="text"
                value={signatures.payeeSignature}
                onChange={(e) => setSignatures({ ...signatures, payeeSignature: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Cheque No:</label>
              <input
                type="text"
                value={signatures.chequeNo}
                onChange={(e) => setSignatures({ ...signatures, chequeNo: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              />
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

export default OvertimeForm;
