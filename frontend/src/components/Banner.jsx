import React from 'react';
import { assets } from '../assets/assets';
import { useClerk, useUser } from '@clerk/clerk-react';

const Banner = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  if (isSignedIn) return null;

  return (
    <div className='flex flex-col items-center gap-4 pt-10 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Access anytime from anywhere</h1>
      <p className='text-gray-700 text-medium sm:text-sm'>
        Our platform ensures seamless access to your financial requests, enabling you to submit, track, and manage payments from any device, wherever you are.
      </p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button 
          onClick={() => openSignIn()}
          className='px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700'
        >
          Get started
        </button>
        <button className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 ease-in-out">
          Learn more
          <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
