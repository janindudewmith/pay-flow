import React, { useState } from 'react';

const TransportForm = () => {
  const [distance, setDistance] = useState('');
  const [ratePerKm, setRatePerKm] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Transportation Allowance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Distance Travelled (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Rate Per Kilometer</label>
          <input
            type="number"
            value={ratePerKm}
            onChange={(e) => setRatePerKm(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default TransportForm;
