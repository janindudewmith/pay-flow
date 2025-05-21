import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PettyCashForm from '../components/forms/PettyCashForm';
import ExamDutyForm from '../components/forms/ExamDutyForm';
import PaperMarkingForm from '../components/forms/PaperMarkingForm';
import TransportForm from '../components/forms/TransportForm';
import OvertimeForm from '../components/forms/OvertimeForm';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { generateFormPdf } from '../utils/pdfUtils';

const RequestPayment = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

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
    switch (id) {
      case 'petty-cash':
        return <PettyCashForm setFormData={setFormData} />;
      case 'exam-duty':
        return <ExamDutyForm setFormData={setFormData} />;
      case 'paper-marking':
        return <PaperMarkingForm setFormData={setFormData} />;
      case 'transportation':
        return <TransportForm setFormData={setFormData} />;
      case 'overtime':
        return <OvertimeForm setFormData={setFormData} />;
      default:
        return <div>Invalid Payment Type</div>;
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const response = await axios.post('http://localhost:5000/api/forms/submit', {
        formType: id,
        formData,
        email,
        fullName,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        navigate('/');
      } else {
        alert(response.data.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit form. Please try again.');
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
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPayment;
