import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const OTPVerification = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      if (timer <= 1) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/otp/verify`, {
        email,
        otp: otp.join(''),
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
      await axios.post(`${API_URL}/api/otp/send`, { email });
      setTimer(300);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>We've sent a 6-digit OTP to {email}</p>
      <div>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => (inputRefs.current[idx] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={e => handleChange(idx, e.target.value)}
          />
        ))}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="button" onClick={handleResendOTP} disabled={loading}>Resend OTP</button>
      <button type="submit" disabled={loading || otp.some(d => !d)}>Verify OTP</button>
    </form>
  );
};

export default OTPVerification; 