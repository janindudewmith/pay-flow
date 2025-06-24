import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RequestPayment from './pages/RequestPayment';
import Requests from './pages/Requests';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import FinanceDashboard from './pages/FinanceDashboard';
import HeadDashboard from './pages/HeadDashboard';
import ViewRequests from './pages/ViewRequests';
import PaymentDescriptionPage from './pages/PaymentDescription';
import UserProfile from './components/UserProfile';
import { useUser } from '@clerk/clerk-react';
import { useOtp } from './context/OtpContext';
import OTPVerification from './components/OTPVerification.jsx';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import UserOnlyRoute from './components/UserOnlyRoute';

const App = () => {
  const { isSignedIn, user } = useUser();
  const { otpVerified, setOtpVerified } = useOtp();
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Check if verification is needed or already completed
  useEffect(() => {
    if (isSignedIn) {
      // Check if already verified in this session
      const otpVerifiedInSession = sessionStorage.getItem('otpVerified') === 'true';

      if (otpVerifiedInSession && !otpVerified) {
        // If verified in session but not in context, update context
        setOtpVerified(true);
      }

      // Set verifying to false after checking
      setIsVerifying(false);
    } else {
      // Not signed in, no verification needed
      setIsVerifying(false);
    }
  }, [isSignedIn, otpVerified, setOtpVerified]);

  // Handle OTP sending
  useEffect(() => {
    // We'll use sessionStorage to track if OTP was already sent in this browser session
    const otpSentThisSession = sessionStorage.getItem('otpSentThisSession') === 'true';

    if (isSignedIn && user && !otpVerified && !otpSentThisSession && !isVerifying) {
      fetch('http://localhost:5000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      })
        .then(() => {
          setOtpSent(true);
          // Mark that OTP was sent in this session
          sessionStorage.setItem('otpSentThisSession', 'true');
        })
        .catch(error => {
          console.error('Error sending OTP:', error);
        });
    }
  }, [isSignedIn, user, otpVerified, isVerifying]);

  // Clear session marker when user logs out
  useEffect(() => {
    if (!isSignedIn) {
      sessionStorage.removeItem('otpSentThisSession');
      sessionStorage.removeItem('otpVerified');
      setOtpVerified(false);
    }
  }, [isSignedIn, setOtpVerified]);

  // Show loading spinner while verifying
  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show OTP verification if needed
  if (isSignedIn && !otpVerified) {
    return (
      <OTPVerification
        email={user.primaryEmailAddress.emailAddress}
        onSuccess={() => {
          setOtpVerified(true);
          // Mark verification as complete for this session
          sessionStorage.setItem('otpVerified', 'true');
        }}
      />
    );
  }

  return (
    <div>
      <Navbar />
      <UserProfile />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/request-payment/:id'
          element={
            <UserOnlyRoute>
              <RequestPayment />
            </UserOnlyRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path='/requests'
          element={
            <UserOnlyRoute>
              <Requests />
            </UserOnlyRoute>
          }
        />
        <Route
          path="/department/dashboard"
          element={
            <AdminProtectedRoute requiredRole="department_head">
              <HeadDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/department/requests/:requestId"
          element={
            <AdminProtectedRoute requiredRole="department_head">
              <ViewRequests />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/finance/dashboard"
          element={
            <AdminProtectedRoute requiredRole="finance_officer">
              <FinanceDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/finance/requests/:requestId"
          element={
            <AdminProtectedRoute requiredRole="finance_officer">
              <ViewRequests />
            </AdminProtectedRoute>
          }
        />
        <Route path="/payment-description/:paymentType" element={<PaymentDescriptionPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
