import React, { useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
    });
    setIsSearched(true);
  };

  const paymentOptions = [
    { img: assets.petty_cash, link: '/request-payment/petty-cash' },
    { img: assets.invigilator, link: '/request-payment/exam-duty' },
    { img: assets.marking, link: '/request-payment/paper-marking' },
    { img: assets.transport, link: '/request-payment/transportation' },
    { img: assets.overtime, link: '/request-payment/overtime' },
  ];

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-medium mb-4">Request Payments, Hassle Free</h2>
        <p className="mb-8 max-w-l mx-auto text-medium font-light px-5">
          Say goodbye to tedious paperwork - submit, track and get approvals, all in one easy-to-use streamlined portal!
        </p>
        <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
            <input
              type="text"
              placeholder="Search for payments"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef}
            />
          </div>
          <button onClick={onSearch} className="bg-gray-800 px-6 py-2 rounded text-white m-1">
            Search
          </button>
        </div>
      </div>
      <div className="border border-blue-200 hover:border-blue-300 shadow-lg mx-2 mt-8 p-8 rounded-lg bg-white transition-colors duration-200">
        <p className="text-center text-lg font-medium mb-6">Take control of your faculty financials in everything including</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center items-center max-w-7xl mx-auto">
          {paymentOptions.map((option, index) => (
            <Link to={option.link} key={index} className="flex flex-col items-center transition-transform hover:scale-105 w-48">
              <div className="border-2 border-gray-200 p-4 rounded-lg hover:border-blue-600 w-full flex justify-center">
                <img className="h-16 md:h-20" src={option.img} alt="Payment Type" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
