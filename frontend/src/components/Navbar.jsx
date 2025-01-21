import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    { title: 'Petty Cash Reimbursement', link: '/request-payment/petty-cash' },
    { title: 'Exam Duty Payment', link: '/request-payment/exam-duty' },
    { title: 'Paper Marking Payment', link: '/request-payment/paper-marking' },
    { title: 'Transportation Allowances', link: '/request-payment/transportation' },
    { title: 'Overtime Payment', link: '/request-payment/overtime' }
  ];

  return (
    <div className='shadow py-0'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link to="/" className='cursor-pointer'>
            <img src={assets.logo} alt="Logo" />
          </Link>
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1 rounded-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              Request New Payment
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                {paymentOptions.map((option, index) => (
                  <Link
                    key={index}
                    to={option.link}
                    className="block px-4 py-2 text-gray-700 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 whitespace-nowrap"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {option.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display the dynamic title */}
        {title && <div className="text-xl font-semibold">{title}</div>}

        {user ? (
          <div className='flex items-center gap-3'>
            <Link className='hover:text-blue-600' to={'/requests'}>My Requests</Link>
            <p> | </p>
            <p className='max-sm:hidden'>Hi, {user.firstName + " " + user.lastName}</p>
            <UserButton />
          </div>
        ) : (
          <div className='flex gap-4 max-sm:text-sm'>
            <button className='text-gray-600 hover:text-blue-600'>Admin Login</button>
            <button onClick={e => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full border border-transparent transition-all duration-200 transform hover:scale-105">
                Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
