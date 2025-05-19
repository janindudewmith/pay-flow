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

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Define all available payment forms with their routes and keywords
  const paymentForms = [
    {
      title: 'Petty Cash',
      link: '/request-payment/petty-cash',
      keywords: ['petty', 'cash', 'small', 'expense', 'minor'],
      description: 'Request reimbursement for small expenses'
    },
    {
      title: 'Exam Duty',
      link: '/request-payment/exam-duty',
      keywords: ['exam', 'invigilator', 'duty', 'supervision', 'test'],
      description: 'Claim payment for examination supervision duties'
    },
    {
      title: 'Paper Marking',
      link: '/request-payment/paper-marking',
      keywords: ['paper', 'marking', 'grading', 'assessment', 'evaluation'],
      description: 'Request payment for grading papers and more'
    },
    {
      title: 'Transportation',
      link: '/request-payment/transportation',
      keywords: ['transport', 'travel', 'commute', 'vehicle', 'journey'],
      description: 'Claim reimbursement for travel expenses'
    },
    {
      title: 'Overtime',
      link: '/request-payment/overtime',
      keywords: ['overtime', 'extra', 'hours', 'additional', 'extended'],
      description: 'Request payment for extra hours worked'
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

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectOption = (link, title) => {
    // Add to search history
    const newHistoryItem = { term: title, timestamp: new Date().toISOString() };
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);

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
  const handleTileClick = (id) => {
    navigate(`/payment-description/${id}`);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-7">
      <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-medium mb-4">Request Payments, Hassle Free</h2>
        <p className="mb-8 max-w-l mx-auto text-medium font-light px-5">
          Say goodbye to tedious paperwork - submit, track and get approvals, all in one easy-to-use streamlined portal!
        </p>
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
            <div className="flex items-center flex-grow">
              <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
              <input
                type="text"
                placeholder="Search for payments"
                className="max-sm:text-xs p-2 rounded outline-none w-full"
                ref={titleRef}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => searchTerm.trim() !== '' && setShowDropdown(true)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={onSearch}
              className={`px-6 py-2 rounded text-white m-1 transition-colors ${searchTerm.trim() === '' || searchResults.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-900'
                }`}
              disabled={searchTerm.trim() === '' || searchResults.length === 0}
            >
              Search
            </button>
          </div>

          {/* Search Dropdown */}
          {showDropdown && searchTerm.trim() !== '' && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-w-xl mx-auto left-0 right-0 text-left">
              {searchResults.length > 0 ? (
                <>
                  <p className="px-4 py-2 text-xs text-gray-500 border-b">Suggested forms:</p>
                  <ul>
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="px-4 py-3 hover:bg-blue-100 cursor-pointer text-gray-800 border-b border-gray-100"
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
                  <p className="px-4 py-2 text-xs text-gray-500">Recent searches:</p>
                  <ul>
                    {searchHistory.map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-800 flex justify-between"
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
          )}
        </div>
      </div>
      <div className="border-2 border-blue-200 hover:border-blue-300 shadow-lg mx-2 mt-7 p-8 rounded-lg bg-white transition-colors duration-200">
        <p className="text-center text-lg font-medium mb-6 -mt-3 py-0 px-4 rounded-lg font-inter">
          Take control of your faculty financials in everything including
        </p>
        {/* Grid view showing all tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center items-center max-w-7xl mx-auto">
          {paymentOptions.map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full max-w-48 cursor-pointer group perspective-500"
              onClick={() => handleTileClick(option.id)}
            >
              <div className="border border-blue-200 p-6 rounded-2xl w-full flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-400 relative overflow-hidden h-36 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  className="h-16 md:h-20 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                  src={option.img}
                  alt={`${option.id} payment type`}
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
