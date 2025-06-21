import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const firstModalLinkRef = useRef(null);
  const isRequestsPage = location.pathname === '/requests';
  const isAdminLoginPage = location.pathname === '/admin-login';

  const paymentOptions = [
    { title: 'Petty Cash Reimbursement', link: '/request-payment/petty-cash', description: 'Request reimbursement for small expenses', icon: '💰' },
    { title: 'Exam Duty Payment', link: '/request-payment/exam-duty', description: 'Claim payment for examination supervision duties', icon: '📝' },
    { title: 'Paper Marking Payment', link: '/request-payment/paper-marking', description: 'Request payment for grading papers and more', icon: '✅' },
    { title: 'Transportation Allowances', link: '/request-payment/transportation', description: 'Claim reimbursement for travel expenses', icon: '🚗' },
    { title: 'Overtime Payment', link: '/request-payment/overtime', description: 'Request payment for extra hours worked', icon: '⏰' },
  ];

  // Navigation links
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'Contact Us', path: '/contact' },
  ];

  // Click outside & ESC key handling for modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    if (isModalOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // lock scroll
      if (isModalOpen) firstModalLinkRef.current?.focus();
    } else {
      document.body.style.overflow = ''; // unlock scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen, isMobileMenuOpen]);

  const handleAdminLogin = () => navigate('/admin-login');
  const handleRegularLogin = () => {
    if (isAdminLoginPage) navigate('/');
    openSignIn();
  };

  // Animation for modal entry
  const modalAnimation = isModalOpen
    ? "opacity-100 visible scale-100"
    : "opacity-0 invisible scale-95";

  // Check if a nav link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className={`shadow py-0 relative z-20 bg-white ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
          {/* Logo and Request Payment Button (when logged in) */}
          <div className="flex items-center gap-2">
            <Link to="/" className="cursor-pointer">
              <img src={assets.logo} alt="Logo" />
            </Link>

            {user && !isAdminLoginPage && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-900 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap group ml-4 hidden sm:flex"
              >
                <span>Request New Payment</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Links - Centered when user is logged in */}
          <div className={`hidden md:flex items-center space-x-1 ${user ? 'mx-auto' : 'ml-6'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-5 transition-all duration-200 font-medium relative group ${isActive(link.path)
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                {link.title}
                <span className={`absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
              </Link>
            ))}
          </div>

          {title && <div className="text-xl font-semibold">{title}</div>}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* User Profile or Login Buttons */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                className={`transition-colors duration-200 ${isRequestsPage
                  ? 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1'
                  : 'hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1'
                  }`}
                to={'/requests'}
              >
                My Requests
              </Link>
              <p> | </p>
              <p className="max-sm:hidden">Hi, {user.firstName + ' ' + user.lastName}</p>
              <UserButton />
            </div>
          ) : (
            <div className="hidden md:flex gap-4 max-sm:text-sm">
              <button onClick={handleAdminLogin} className="text-gray-600 hover:text-blue-600">
                Admin Login
              </button>
              <button
                onClick={handleRegularLogin}
                className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full border border-transparent transition-all duration-200 transform hover:scale-[1.05]"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg transition-colors ${isActive(link.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}

              {user && (
                <>
                  <Link
                    to="/requests"
                    className={`block px-4 py-2 rounded-lg transition-colors ${isRequestsPage
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Requests
                  </Link>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 bg-gradient-to-r from-blue-900 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <span>Request New Payment</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {!user && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleRegularLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mb-3"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleAdminLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Admin Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className={`border border-blue-200 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl p-6 shadow-2xl z-50 transition-all duration-300 ease-out ${modalAnimation}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">Reimbursement Options</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(100vh-240px)] overflow-y-auto my-2">
          {paymentOptions.map((option, index) => (
            <Link
              key={index}
              ref={index === 0 ? firstModalLinkRef : null}
              to={option.link}
              className="px-4 py-4 hover:bg-blue-100 rounded-lg text-gray-800 mb-2 flex items-start transition-colors duration-200 group"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-200">{option.icon}</span>
              <div>
                <div className="text-base font-semibold text-blue-700 group-hover:text-blue-800">{option.title}</div>
                <div className="text-sm text-gray-500 whitespace-nowrap text-ellipsis max-w-[200px]">{option.description}</div>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t">
          <Link
            to="/requests"
            className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            View My Requests
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
