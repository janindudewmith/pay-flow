import React, { useState } from 'react';
import axios from 'axios';

const OtpModal = ({ email, onVerified, onClose }) => {
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('send'); // 'send' or 'verify'
  const [message, setMessage] = useState('');

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setStep('verify');
      setMessage('OTP sent to your email!');
    } catch (err) {
      setMessage('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setMessage('OTP verified successfully!');
      onVerified(); // Notify parent component
    } catch (err) {
      setMessage('Invalid or expired OTP');
    }
  };

  return (
    <div className="p-4 border bg-white rounded shadow-md max-w-sm mx-auto mt-4">
      <h3 className="text-lg font-semibold mb-2">Email Verification</h3>
      <p className="text-sm text-gray-600">{message}</p>

      {step === 'send' && (
        <button
          onClick={sendOtp}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
        >
          Send OTP
        </button>
      )}

      {step === 'verify' && (
        <div className="mt-3">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Verify
          </button>
        </div>
      )}

      <button
        onClick={onClose}
        className="text-sm text-gray-500 mt-4 block"
      >
        Cancel
      </button>
    </div>
  );
};

export default OtpModal;
