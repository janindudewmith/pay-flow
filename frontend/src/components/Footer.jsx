import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-5 md:gap-32 py-5 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" />
          <p className="text-center md:text-left text-sm text-white/80">
            PayFlow simplifies your payment requests with seamless access, tracking and approvals—helping you to focus on what matters most.
          </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mt-5 mb-3'>Our platform</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privay policy</a></li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mt-5 mb-3">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/80">
            Stay updated with the latest news, articles and insights delivered straight to your inbox.
          </p>
          <div className='flex items-center gap-2 pt-4'>
            <input type="email" placeholder='Enter your email' className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm' />
            <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/30 py-4">
        <p className="text-center text-xs md:text-sm text-white/60">Copyright 2025 &#169; PayFlow. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
