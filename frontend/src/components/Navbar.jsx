import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Check if current path is the requests page
  const isRequestsPage = location.pathname === '/requests';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const paymentOptions = [
    {
      title: 'Petty Cash Reimbursement',
      link: '/request-payment/petty-cash',
      description: 'Request reimbursement for small expenses',
    },
    {
      title: 'Exam Duty Payment',
      link: '/request-payment/exam-duty',
      description: 'Claim payment for examination supervision duties',
    },
    {
      title: 'Paper Marking Payment',
      link: '/request-payment/paper-marking',
      description: 'Request payment for grading papers and more',
    },
    {
      title: 'Transportation Allowances',
      link: '/request-payment/transportation',
      description: 'Claim reimbursement for travel expenses',
    },
    {
      title: 'Overtime Payment',
      link: '/request-payment/overtime',
      description: 'Request payment for extra hours worked',
    },
  ];

  return (
    <div className="shadow py-0">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="cursor-pointer">
            <img src={assets.logo} alt="Logo" />
          </Link>
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1 rounded-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              Request New Payment
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                <p className="px-4 py-2 text-xs text-gray-500 border-b">Payment request options:</p>
                {paymentOptions.map((option, index) => (
                  <Link
                    key={index}
                    to={option.link}
                    className="block px-4 py-3 hover:bg-blue-100 cursor-pointer text-gray-800 transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {/* Title */}
                    <div className="text-sm font-medium truncate">{option.title}</div>
                    {/* Description */}
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display the dynamic title */}
        {title && <div className="text-xl font-semibold">{title}</div>}

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              className={isRequestsPage ? "text-blue-600 font-medium" : "hover:text-blue-600"}
              to={'/requests'}
            >
              My Requests
            </Link>
            <p> | </p>
            <p className="max-sm:hidden">Hi, {user.firstName + " " + user.lastName}</p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-sm">
            <button className="text-gray-600 hover:text-blue-600">Admin Login</button>
            <button
              onClick={(e) => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full border border-transparent transition-all duration-200 transform hover:scale-[1.05]"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
