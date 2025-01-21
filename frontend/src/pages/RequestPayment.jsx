import React from 'react';
import { useParams } from 'react-router-dom';
import PettyCashForm from '../components/forms/PettyCashForm';
import ExamDutyForm from '../components/forms/ExamDutyForm';
import PaperMarkingForm from '../components/forms/PaperMarkingForm';
import TransportForm from '../components/forms/TransportForm';
import OvertimeForm from '../components/forms/OvertimeForm';

const RequestPayment = () => {
  const { id } = useParams();

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
        return <PettyCashForm />;
      case 'exam-duty':
        return <ExamDutyForm />;
      case 'paper-marking':
        return <PaperMarkingForm />;
      case 'transportation':
        return <TransportForm />;
      case 'overtime':
        return <OvertimeForm />;
      default:
        return <div>Invalid Payment Type</div>;
    }
  };

  return (
    <div>
      <div className="container px-4 2xl:px-20 mx-auto p-4">
        {/* Title and Form Wrapper */}
        <div className="mx-auto w-full">
          {/* Title */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-4 text-center mx-2 rounded-xl mb-6">
            <h1 className="text-2xl font-semibold">{getTitle()}</h1>
          </div>

          {/* Form */}
          <div className="w-full">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPayment;
