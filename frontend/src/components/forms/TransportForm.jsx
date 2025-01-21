
import React, { useState } from 'react';

const TravelExpenseForm = () => {
  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    expenseDescription: '',
    officerName: '',
    position: '',
    department: '',
    annualSalary: '',
    otherAllowances: '',
    combinedAllowances: '',
    destination: '',
    purpose: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Annual Consolidated Salary (Rs.)</label>
            <input
              type="number"
              name="annualSalary"
              value={basicInfo.annualSalary}
              onChange={handleBasicInfoChange}
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
            />
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
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.departureTime}
                        onChange={(e) => handleTravelDetailChange(index, 'departureTime', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="time"
                        value={detail.arrivalTime}
                        onChange={(e) => handleTravelDetailChange(index, 'arrivalTime', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.departureLocation}
                        onChange={(e) => handleTravelDetailChange(index, 'departureLocation', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={detail.vehicleNumber}
                        onChange={(e) => handleTravelDetailChange(index, 'vehicleNumber', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.distanceTraveled}
                        onChange={(e) => handleTravelDetailChange(index, 'distanceTraveled', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.transportAllowance}
                        onChange={(e) => handleTravelDetailChange(index, 'transportAllowance', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.compositeAllowance}
                        onChange={(e) => handleTravelDetailChange(index, 'compositeAllowance', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={detail.assistantCost}
                        onChange={(e) => handleTravelDetailChange(index, 'assistantCost', e.target.value)}
                        className="w-full p-1 border rounded"
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
              <p className="text-xs">Date: _____________</p>
              <p className="text-xs">Signature: _____________</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm font-medium">Verifying Officer</p>
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

export default TravelExpenseForm;
