import React, { createContext, useState, useContext, useEffect } from 'react';

const OtpContext = createContext();

export const useOtp = () => useContext(OtpContext);

export const OtpProvider = ({ children }) => {
  // Initialize state from localStorage and sessionStorage
  const [otpVerified, setOtpVerified] = useState(() => {
    // Check both localStorage (for persistence across browser sessions)
    // and sessionStorage (for current session verification)
    const savedVerificationStatus = localStorage.getItem('otpVerified');
    const sessionVerificationStatus = sessionStorage.getItem('otpVerified');

    // Return true if verified in either storage
    return savedVerificationStatus === 'true' || sessionVerificationStatus === 'true';
  });

  // Update localStorage when otpVerified changes
  useEffect(() => {
    if (otpVerified) {
      localStorage.setItem('otpVerified', 'true');
      sessionStorage.setItem('otpVerified', 'true');
    } else {
      localStorage.removeItem('otpVerified');
      // Don't remove from sessionStorage here to avoid conflicts
    }
  }, [otpVerified]);

  return (
    <OtpContext.Provider value={{ otpVerified, setOtpVerified }}>
      {children}
    </OtpContext.Provider>
  );
}; 