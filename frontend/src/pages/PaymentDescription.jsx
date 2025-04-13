import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const PaymentDescription = () => {
  const { paymentType } = useParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Detailed descriptions for each payment type
  const paymentDetailsData = {
    'petty-cash': {
      title: 'Petty Cash Reimbursement',
      description: 'Petty cash reimbursements allow faculty members to quickly recover funds spent on small, day-to-day departmental expenses without going through lengthy procurement processes.',
      features: [
        'Quick reimbursement for expenses under Rs. 10,000',
        'Simplified approval process',
        'Typically processed within 3-5 business days',
        'Requires receipts and basic expense justification'
      ],
      eligibility: 'All faculty members and administrative staff are eligible to claim petty cash reimbursements for approved departmental expenses.',
      process: 'Submit your receipts along with a brief description of the expense purpose. Your department head will review and approve before forwarding to finance for processing.'
    },
    'exam-duty': {
      title: 'Exam Duty Payment',
      description: 'Faculty members who supervise examinations are entitled to additional compensation for their time and effort in maintaining academic integrity during testing periods.',
      features: [
        'Fixed rate payment per examination session',
        'Additional compensation for chief invigilator duties',
        'Payments processed at the end of examination periods',
        'Automatic calculation based on duty roster'
      ],
      eligibility: 'All faculty members assigned to examination supervision by the Examinations Office are eligible for exam duty payments.',
      process: 'The Examinations Office will submit the duty roster. You only need to verify your sessions and submit this form to initiate payment processing.'
    },
    'paper-marking': {
      title: 'Paper Marking Payment',
      description: 'Academic staff involved in grading examination papers or assignments beyond their regular teaching load can claim additional compensation for this work.',
      features: [
        'Payment calculated per paper or script marked',
        'Different rates for undergraduate and postgraduate assessments',
        'Batch processing for multiple marking assignments',
        'Verification by course coordinators'
      ],
      eligibility: 'Faculty members assigned to mark papers outside their regular teaching responsibilities are eligible for marking payments.',
      process: 'Submit details of the course, number of papers marked, and the marking period. Your department head and course coordinator will verify before approval.'
    },
    'transportation': {
      title: 'Transportation Allowance',
      description: 'Faculty members who incur travel expenses for university business, field work, or inter-campus activities can be reimbursed for their transportation costs.',
      features: [
        'Coverage for public transport, fuel, or mileage',
        'Options for daily or one-time claims',
        'Accommodation for various transport modes',
        'Integration with university travel policy'
      ],
      eligibility: 'All staff members who travel for approved university business are eligible for transportation allowances as per the university travel policy.',
      process: 'Document your journey details, purpose, and attach relevant receipts. Approval is required from your department head before processing by finance.'
    },
    'overtime': {
      title: 'Overtime Payment Request',
      description: 'Staff members who work beyond their contractual hours on approved tasks can claim overtime payments for their additional time contribution.',
      features: [
        'Calculated at 1.5x regular hourly rate for weekdays',
        '2x regular rate for weekends and holidays',
        'Requires pre-approval for overtime work',
        'Detailed time tracking and verification'
      ],
      eligibility: 'Administrative and support staff are eligible for overtime payments. Academic staff on specific administrative duties may also qualify with special approval.',
      process: 'Record your overtime hours, the tasks performed, and obtain verification from your supervisor. Department head approval is required before submission to finance.'
    }
  };

  // Payment options with images and links
  const paymentOptions = [
    { img: assets.petty_cash, link: '/request-payment/petty-cash', id: 'petty-cash' },
    { img: assets.invigilator, link: '/request-payment/exam-duty', id: 'exam-duty' },
    { img: assets.marking, link: '/request-payment/paper-marking', id: 'paper-marking' },
    { img: assets.transport, link: '/request-payment/transportation', id: 'transportation' },
    { img: assets.overtime, link: '/request-payment/overtime', id: 'overtime' },
  ];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);

    // Get payment details based on URL parameter
    if (paymentType && paymentDetailsData[paymentType]) {
      setTimeout(() => {
        setPaymentDetails(paymentDetailsData[paymentType]);
        setIsLoading(false);
      }, 300); // Small delay for loading animation
    } else {
      // Redirect to home if invalid payment type
      navigate('/');
    }
  }, [paymentType, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-blue-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentPaymentOption = paymentOptions.find(option => option.id === paymentType);

  return (
    <div className="container 2xl:px-20 mx-auto my-10 ">
      <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 opacity-30"></div>

        <div className="relative z-10">

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Payment type icon */}
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="border-2 border-blue-600 p-6 rounded-2xl w-full max-w-48 flex justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-transpa relative overflow-hidden">
                <img
                  className="h-24 hover:scale-110 transition-transform duration-300 transform"
                  src={currentPaymentOption?.img}
                  alt={paymentDetails.title}
                />
              </div>
              <div className="mt-6 space-y-3 w-full max-w-48">
                <Link
                  to={currentPaymentOption?.link}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center"
                >
                  <span>Proceed to Form</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
                <Link
                  to="/"
                  className="w-full border border-blue-600 text-blue-600 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors duration-300 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>

            {/* Right side - Description */}
            <div className="md:w-3/4 text-left">
              <h3 className="text-2xl font-bold text-blue-800 mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 after:rounded-full">{paymentDetails.title}</h3>
              <p className="text-base text-gray-700 mb-6 leading-relaxed">{paymentDetails.description}</p>

              <div className="bg-blue-50 p-6 rounded-xl mb-6 border-l-4 border-blue-500 backdrop-blur-sm bg-opacity-70">
                <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Key Features
                </h4>
                <ul className="list-none pl-4 text-base text-gray-700 space-y-2.5 columns-1 md:columns-2">
                  {paymentDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start break-inside-avoid mb-2">
                      <svg className="w-5 h-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-300 transform hover:scale-[1.02] hover:shadow-md">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Eligibility
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">{paymentDetails.eligibility}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-300 transform hover:scale-[1.02] hover:shadow-md">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Process
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">{paymentDetails.process}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDescription;
