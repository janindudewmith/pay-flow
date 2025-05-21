import React, { createContext, useState, useContext } from 'react';

const OtpContext = createContext();

export const useOtp = () => useContext(OtpContext);

export const OtpProvider = ({ children }) => {
  const [otpVerified, setOtpVerified] = useState(false);
  return (
    <OtpContext.Provider value={{ otpVerified, setOtpVerified }}>
      {children}
    </OtpContext.Provider>
  );
}; 