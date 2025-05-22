import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const OTPVerification = ({ email, onSuccess }) => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      if (timer <= 1) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/otp/verify', {
        email,
        otp,
      });
      if (response.data.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(response.data.message || 'Error verifying OTP');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/otp/send', { email });
      setTimer(300);
      setOtp('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest font-medium"
            />
            {error && (
              <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoHome}
              className="w-full py-2.5 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              ← Go Home
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timer > 0 || loading}
                className="flex-1 py-2.5 px-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors font-medium"
              >
                {timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : 'Resend OTP'}
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
