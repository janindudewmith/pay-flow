import React from 'react';
import { assets } from '../assets/assets';
import { useClerk } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const onGetStarted = () => {
    if (isSignedIn) {
      window.dispatchEvent(new Event('open-request-modal'));
    } else {
      openSignIn();
    }
  };

  return (
    <div className="py-8 px-6 md:px-10">
      <div className="flex flex-col items-center gap-4 px-4 md:px-0 relative z-10 max-w-4xl mx-auto">
        <h1 className="text-xl md:text-3xl lg:text-4xl text-gray-800 font-bold text-center leading-tight">
          Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">anytime</span> from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">anywhere</span>
        </h1>

        <p className="text-gray-700 text-sm md:text-base text-center max-w-2xl leading-relaxed">
          Our platform ensures seamless access to your financial requests, enabling you to submit, track, and manage payments from any device, wherever you are.
        </p>

        <div className="flex flex-col sm:flex-row items-center font-medium gap-4 mt-2">
          <button
            onClick={onGetStarted}
            className="px-8 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Get started
          </button>

          <button onClick={() => navigate('/learn-more')} className="flex items-center gap-2 hover:text-blue-700 group transition-all duration-300 ease-in-out px-3 py-1">
            <span>Learn more</span>
            <div className="bg-blue-100 rounded-full p-1 group-hover:bg-blue-200 transition-colors duration-300">
              <img
                src={assets.arrow_icon}
                alt="arrow_icon"
                className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
