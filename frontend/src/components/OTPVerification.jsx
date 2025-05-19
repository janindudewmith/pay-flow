import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';

const OTPVerification = ({ userEmail, onVerificationSuccess }) => {
  const { client } = useClerk();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Request verification code
  const requestVerification = async () => {
    try {
      setIsVerifying(true);
      setError('');
      setSuccess('Sending verification code...');

      // Prepare email verification
      const verification = await client.verifications.prepareEmailAddressVerification({
        emailAddress: userEmail,
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
      onVerificationSuccess();
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Invalid or expired verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      await axios.post('/api/otp/generate', {
        email: userEmail,
        purpose: 'verification',
        formId: verificationId,
      });
      setShowOtpInput(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post('/api/otp/verify', {
        email: userEmail,
        otp: verificationCode,
        purpose: 'verification',
        formId: verificationId,
      });
      onVerificationSuccess();
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const eventSource = new EventSource('/api/forms/updates');

  eventSource.onmessage = (event) => {
    const update = JSON.parse(event.data);
    // Update your UI with the new form status
  };

  return (
    <div className="mt-3">
      <label className="block text-xs">OTP Verification:</label>
      {!verificationId ? (
        <button
          type="button"
          onClick={requestVerification}
          disabled={isVerifying}
          className="w-full mt-1 p-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isVerifying ? 'Sending...' : 'Send OTP to Email'}
        </button>
      ) : (
        <div className="mt-1 space-y-2">
          {!showOtpInput ? (
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isVerifying}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Send OTP
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-1 border text-xs border-gray-300 rounded appearance-none bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isVerifying || !verificationCode || verificationCode.length < 6}
                className={`p-1 text-xs text-white rounded ${success.includes('verified')
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
              >
                {isVerifying
                  ? 'Verifying...'
                  : success.includes('verified')
                    ? 'Verified ✓'
                    : 'Verify'
                }
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={requestVerification}
            disabled={isVerifying}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Resend OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
