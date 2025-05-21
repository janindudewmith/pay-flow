import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PettyCashForm from '../components/forms/PettyCashForm';
import ExamDutyForm from '../components/forms/ExamDutyForm';
import PaperMarkingForm from '../components/forms/PaperMarkingForm';
import TransportForm from '../components/forms/TransportForm';
import OvertimeForm from '../components/forms/OvertimeForm';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';

const RequestPayment = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({});
  const [otpMessage, setOtpMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get user email and full name from Clerk
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const fullName = user?.fullName || '';

  const getTitle = () => {
    switch (id) {
      case 'petty-cash':
        return 'Petty Cash Reimbursement';
      case 'exam-duty':
        return 'Exam Duty Payment';
      case 'paper-marking':
        return 'Paper Marking Payment';
      case 'transportation':
        return 'Transportation Allowances';
      case 'overtime':
        return 'Overtime Payment';
      default:
        return 'Request Payment';
    }
  };

  const renderForm = () => {
    const formProps = { setFormData, handleSendOtp, otpSent, isLoading, otpVerified };
    switch (id) {
      case 'petty-cash':
        return <PettyCashForm {...formProps} />;
      case 'exam-duty':
        return <ExamDutyForm {...formProps} />;
      case 'paper-marking':
        return <PaperMarkingForm {...formProps} />;
      case 'transportation':
        return <TransportForm {...formProps} />;
      case 'overtime':
        return <OvertimeForm {...formProps} />;
      default:
        return <div>Invalid Payment Type</div>;
    }
  };

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      console.log('Sending OTP for email:', email);
      const token = await getToken();
      const res = await axios.post('http://localhost:5000/api/otp/send', 
        { email },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.data.success) {
        setOtpSent(true);
        setOtpMessage(res.data.message);
        alert('OTP sent successfully! Please check your email.');
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      const res = await axios.post('http://localhost:5000/api/otp/verify', 
        { 
          email, 
          otp, 
          purpose: 'form_submission'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.success) {
        setOtpVerified(true);
        alert('OTP verified successfully!');
      } else {
        alert(res.data.message || 'Invalid or expired OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!otpVerified) {
      alert('Please verify OTP first');
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      // Submit the form
      const response = await axios.post('http://localhost:5000/api/forms/submit', 
        {
          formType: id,
          formData,
          email,
          fullName,
          otp // Include OTP in the submission
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Form submitted successfully!');
        // Reset form state
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
        setFormData({});
      } else {
        alert(response.data.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container px-4 2xl:px-20 mx-auto p-4">
        <div className="mx-auto w-full">
          <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-4 text-center mx-2 rounded-xl mb-6">
            <h1 className="text-2xl font-semibold">{getTitle()}</h1>
          </div>
          <div className="w-full">
            {renderForm()}
            <div className="my-4">
              {otpSent && !otpVerified && (
                <div className="space-y-2">
                  <input
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="border px-2 py-1 rounded mr-2"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}
              {otpVerified && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:bg-blue-400"
                >
                  {isLoading ? 'Submitting...' : 'Submit Form'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPayment;
