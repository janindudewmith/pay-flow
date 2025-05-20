import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';

const OTPVerification = ({ email, purpose, formId, onVerified }) => {
  const { client } = useClerk();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request verification code
  const requestVerification = async () => {
    try {
      setIsVerifying(true);
      setError('');
      setSuccess('Sending verification code...');

      // Prepare email verification
      const verification = await client.verifications.prepareEmailAddressVerification({
        emailAddress: email,
        strategy: 'email_code'
      });

      setVerificationId(verification.verificationId);
      setSuccess('Verification code sent! Please check your email.');
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Verify the code
  const verifyCode = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      // Attempt verification with the code
      await client.verifications.attemptEmailAddressVerification({
        verificationId,
        code: verificationCode
      });

      setSuccess('Email verified successfully!');
      onVerified();
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Invalid or expired verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');

      await axios.post('/api/otp/send', {
        email,
        purpose,
        formId
      });

      setShowOtpInput(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');

      await axios.post('/api/otp/verify', {
        email,
        otp: verificationCode,
        purpose,
        formId
      });

      onVerified();
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const eventSource = new EventSource('/api/forms/updates');

  eventSource.onmessage = (event) => {
    const update = JSON.parse(event.data);
    // Update your UI with the new form status
  };

  return (
    <div className="otp-verification">
      {!showOtpInput ? (
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <div className="otp-input-section">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter OTP"
            className="form-control"
            maxLength={6}
          />
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default OTPVerification;
