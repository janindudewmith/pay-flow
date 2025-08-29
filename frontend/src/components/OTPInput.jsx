import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);
  
  useEffect(() => {
    // Focus on the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (!/^[0-9]*$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Check if all digits are filled
    const filledOtp = newOtp.join('');
    if (filledOtp.length === length) {
      onComplete(filledOtp);
    }
    
    // Move to next input if current field is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is numeric and has correct length
    if (!/^[0-9]+$/.test(pastedData)) return;
    
    const pastedOtp = pastedData.substring(0, length).split('');
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedOtp.length; i++) {
      newOtp[i] = pastedOtp[i];
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = pastedOtp[i];
      }
    }
    
    setOtp(newOtp);
    
    // If all digits are filled, trigger completion
    if (pastedOtp.length === length) {
      onComplete(pastedOtp.join(''));
    }
    
    // Focus on the next empty input or the last one
    const focusIndex = Math.min(pastedOtp.length, length - 1);
    inputRefs.current[focusIndex].focus();
  };
  
  return (
    <div className="flex gap-2 justify-center my-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      ))}
    </div>
  );
};

export default OTPInput;
