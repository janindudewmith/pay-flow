import React, { useContext, useRef, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Helper function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Prevent body scrolling when dropdown is open
  useEffect(() => {
    const handleBodyScroll = () => {
      if (showDropdown) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    handleBodyScroll();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDropdown]);

  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filteredResults = paymentForms.filter(form =>
      form.title.toLowerCase().includes(term) ||
      form.keywords.some(keyword => keyword.includes(term))
    );

    setSearchResults(filteredResults);
    setShowDropdown(true); // Always show dropdown when typing, even if no results
  }, [searchTerm]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent dropdown scroll from affecting page
  const handleDropdownScroll = (e) => {
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectOption = (link, title) => {
    // Add to search history
    const newHistoryItem = { term: title, timestamp: new Date().toISOString() };
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);

    // Scroll to top before navigation
    scrollToTop();

    // Navigate to the form
    navigate(link);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const findBestMatch = () => {
    if (searchResults.length > 0) {
      return searchResults[0]; // Return the top match
    }
    return null;
  };

  const onSearch = () => {
    if (searchTerm.trim() === '') return;

    // Add to search history
    const newHistoryItem = { term: searchTerm, timestamp: new Date().toISOString() };
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);

    // Scroll to top before navigation
    scrollToTop();

    // Find the best matching form
    const bestMatch = findBestMatch();

    if (bestMatch) {
      // If we have a match, navigate directly to it
      navigate(bestMatch.link);
    } else {
      // If no match, set search filter and show "no results" or search results page
      setSearchFilter({
        title: searchTerm,
      });
      setIsSearched(true);
      navigate('/search-results'); // Assuming you have a search results page
    }

    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  // Modified handleTileClick function to navigate to description page
  const handleTileClick = (id, index) => {
    setActiveIndex(index);

    // Scroll to top before navigation
    scrollToTop();

    setTimeout(() => {
      navigate(`/payment-description/${id}`);
    }, 300);
  };

  // Define all available payment forms with their routes and keywords
  const paymentForms = [
    {
      title: 'Petty Cash',
      link: '/request-payment/petty-cash',
      keywords: ['petty', 'cash', 'small', 'expense', 'minor'],
      description: 'Request reimbursement for small expenses',
      icon: '💰',
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-900',
    },
    {
      title: 'Exam Duty',
      link: '/request-payment/exam-duty',
      keywords: ['exam', 'invigilator', 'duty', 'supervision', 'test'],
      description: 'Claim payment for examination supervision duties',
      icon: '📝',
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900',
    },
    {
      title: 'Paper Marking',
      link: '/request-payment/paper-marking',
      keywords: ['paper', 'marking', 'grading', 'assessment', 'evaluation'],
      description: 'Request payment for grading papers and more',
      icon: '✅',
      color: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
      bgDark: 'bg-violet-900',
    },
    {
      title: 'Transportation',
      link: '/request-payment/transportation',
      keywords: ['transport', 'travel', 'commute', 'vehicle', 'journey'],
      description: 'Claim reimbursement for travel expenses',
      icon: '🚗',
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      bgDark: 'bg-amber-900',
    },
    {
      title: 'Overtime',
      link: '/request-payment/overtime',
      keywords: ['overtime', 'extra', 'hours', 'additional', 'extended'],
      description: 'Request payment for extra hours worked',
      icon: '⏰',
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50',
      bgDark: 'bg-rose-900',
    },
  ];

  // Payment options with images and links
  const paymentOptions = [
    { img: assets.petty_cash, link: '/request-payment/petty-cash', id: 'petty-cash' },
    { img: assets.invigilator, link: '/request-payment/exam-duty', id: 'exam-duty' },
    { img: assets.marking, link: '/request-payment/paper-marking', id: 'paper-marking' },
    { img: assets.transport, link: '/request-payment/transportation', id: 'transportation' },
    { img: assets.overtime, link: '/request-payment/overtime', id: 'overtime' },
  ];

  return (
    <div className="container 2xl:px-20 mx-auto my-7">
      {/* Enhanced Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20 mx-2 rounded-2xl shadow-2xl">
        {/* Animated Circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute w-64 h-64 rounded-full bg-blue-600/20 -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 bottom-0 right-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-32 h-32 rounded-full bg-blue-400/20 top-1/3 left-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute w-48 h-48 rounded-full bg-blue-700/20 bottom-1/4 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Request Payments, <span className="text-blue-200">Hassle Free</span>
          </h2>
          <p className="mb-10 max-w-2xl mx-auto text-lg font-light opacity-90">
            Say goodbye to tedious paperwork - submit, track and get approvals, all in one easy to use streamlined portal!
          </p>

          {/* Search Bar with Enhanced Design */}
          <div className="relative max-w-2xl w-full mx-auto" ref={dropdownRef}>
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg pl-5 overflow-hidden">
              <div className="flex items-center flex-grow">
                <svg className="w-5 h-5 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for payments"
                  className="p-4 bg-transparent outline-none w-full text-white placeholder-blue-200"
                  ref={titleRef}
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => searchTerm.trim() !== '' && setShowDropdown(true)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                onClick={onSearch}
                className={`px-6 py-4 text-white transition-all duration-300 ${searchTerm.trim() === '' || searchResults.length === 0
                  ? 'bg-blue-600/50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                disabled={searchTerm.trim() === '' || searchResults.length === 0}
              >
                Search
              </button>
            </div>

            {/* Search Dropdown */}
            {showDropdown && searchTerm.trim() !== '' && (
              <div className="fixed left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-w-xl">
                <div className="max-h-[70vh] overflow-y-auto" onWheel={handleDropdownScroll}>
                  {searchResults.length > 0 ? (
                    <>
                      <p className="px-4 py-2 text-xs text-gray-500 border-b sticky top-0 bg-white text-left">Suggested forms:</p>
                      <ul className="max-h-[30vh] overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <li
                            key={index}
                            className="px-4 py-3 hover:bg-blue-100 cursor-pointer text-gray-800 border-b border-gray-100 text-left"
                            onClick={() => handleSelectOption(result.link, result.title)}
                          >
                            <div className="font-medium">{result.title}</div>
                            <div className="text-xs text-gray-500">{result.description}</div>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-gray-700 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>No search results found for "{searchTerm}"</span>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div className="border-t border-gray-200">
                      <p className="px-4 py-2 text-xs text-gray-500 sticky top-0 bg-white text-left">Recent searches:</p>
                      <ul className="max-h-[20vh] overflow-y-auto">
                        {searchHistory.map((item, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-800 flex justify-between text-left"
                            onClick={() => setSearchTerm(item.term)}
                          >
                            <span>{item.term}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Combined Section with shared background */}
      <div className="mt-7 px-4">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl py-6 px-6 shadow-lg relative overflow-hidden backdrop-blur-sm">
          {/* Enhanced decorative elements - made smaller */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 -mr-16 -mt-16 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-20 -ml-16 -mb-16 animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white opacity-5 scale-90 rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>

          {/* Subtle sparkle effects */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-70 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full opacity-70 animate-ping" style={{ animationDuration: '2.5s' }}></div>

          {/* Faculty Financials Section */}
          <div className="relative z-10 mb-16">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-1/2 md:pr-8">
                <h3 className="md:text-left text-center text-2xl md:text-3xl font-bold text-gray-800 mb-2 whitespace-nowrap">
                  Take Control of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 animate-gradient">Faculty Financials</span>
                </h3>

                <p className="md:text-left text-center text-gray-700 text-sm md:text-base leading-relaxed mb-0">
                  Streamline your payment requests with our intuitive platform designed specifically for academic professionals
                </p>
              </div>

              {/* Vector graphics/illustrations - made smaller */}
              <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0 flex justify-center md:justify-end">
                <div className="relative w-full max-w-xs h-24 md:h-28">
                  {/* Abstract vector shapes */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-sm"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-full opacity-20 blur-sm"></div>

                  {/* Main vector graphic - simplified for smaller height */}
                  <svg className="w-full h-full" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Document/Paper */}
                    <rect x="120" y="20" width="160" height="110" rx="6" fill="#ffffff" stroke="#4F46E5" strokeWidth="2" />
                    <rect x="135" y="35" width="130" height="8" rx="2" fill="#EEF2FF" />
                    <rect x="135" y="50" width="130" height="8" rx="2" fill="#EEF2FF" />
                    <rect x="135" y="65" width="80" height="8" rx="2" fill="#EEF2FF" />

                    {/* Checkmark/Approval */}
                    <circle cx="250" cy="95" r="25" fill="#4F46E5" fillOpacity="0.1" />
                    <path d="M235 95L245 105L265 85" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Coins/Money */}
                    <circle cx="170" cy="95" r="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                    <text x="170" y="100" textAnchor="middle" fill="#F59E0B" fontWeight="bold" fontSize="16">$</text>

                    {/* Decorative lines */}
                    <path d="M80 75C100 60 120 90 140 75" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M320 50C300 65 280 35 260 50" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>

                  {/* Animated elements */}
                  <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-70" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-ping opacity-70" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-indigo-100 my-8 relative z-10"></div>

          {/* Payment Form Section */}
          <div className="relative z-10">
            <h3 className="text-center text-2xl md:text-3xl font-bold mb-10 text-gray-800">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reimbursement for Anything Including</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {paymentForms.map((form, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-500 transform ${activeIndex === index ? 'scale-95 opacity-80' : 'hover:scale-105 hover:shadow-2xl'}`}
                  onClick={() => handleTileClick(paymentOptions[index].id, index)}
                >
                  {/* Card Background with enhanced gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${form.color} opacity-90`}></div>

                  {/* Enhanced Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/20 -mr-8 -mt-8 animate-pulse" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/20 -ml-4 -mb-4 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 animate-ping" style={{ animationDuration: '5s', animationIterationCount: 'infinite' }}></div>

                  {/* Card Content with enhanced styling */}
                  <div className="relative p-8 h-full flex flex-col justify-between z-10 min-h-[220px]">
                    <div>
                      <span className="text-5xl mb-5 block transform transition-transform duration-300 hover:scale-110">{form.icon}</span>
                      <h3 className="text-xl font-extrabold text-white mb-3">{form.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">{form.description}</p>
                    </div>

                    <div className="mt-6 flex items-center group">
                      <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors duration-300">Learn more</span>
                      <svg className="w-5 h-5 ml-2 text-white/90 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose PayFlow Section - Enhanced with modern design */}
      <div className="mt-24 px-4 mb-20">
        <div className="bg-gradient-to-b from-white to-blue-50 rounded-3xl py-16 px-8 shadow-xl relative overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <h4 className="text-center text-3xl md:text-4xl font-extrabold mb-12 text-gray-800">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PayFlow</span>?
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {/* Feature 1 - Enhanced */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Fast Processing</h3>
                <p className="text-gray-600 text-center leading-relaxed">Get your payments processed quickly with our streamlined approval system</p>
              </div>

              {/* Feature 2 - Enhanced */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Secure & Reliable</h3>
                <p className="text-gray-600 text-center leading-relaxed">Your data is protected with enterprise-grade security measures</p>
              </div>

              {/* Feature 3 - Enhanced */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Real-time Updates</h3>
                <p className="text-gray-600 text-center leading-relaxed">Stay informed with notifications at every stage of the approval process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;