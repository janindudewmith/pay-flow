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

const App = () => {
  const { isSignedIn, user } = useUser();
  const { otpVerified, setOtpVerified } = useOtp();
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (isSignedIn && user && !otpSent) {
      fetch('http://localhost:5000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      }).then(() => setOtpSent(true));
    }
  }, [isSignedIn, user, otpSent]);

  if (isSignedIn && !otpVerified) {
    return (
      <OTPVerification
        email={user.primaryEmailAddress.emailAddress}
        onSuccess={() => setOtpVerified(true)}
      />
    );
  }

  return (
    <div>
      <Navbar />
      <UserProfile />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-payment/:id' element={<RequestPayment />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path='/requests' element={<Requests />} />
        <Route path="/department/dashboard" element={<HeadDashboard />} />
        <Route path="/department/requests/:requestId" element={<ViewRequests />} />
        <Route path="/finance/dashboard" element={<FinanceDashboard />} />
        <Route path="/finance/requests/:requestId" element={<ViewRequests />} />
        <Route path="/payment-description/:paymentType" element={<PaymentDescriptionPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
};

export default App;
