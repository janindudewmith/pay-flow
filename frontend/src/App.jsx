import React from 'react';
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
import PaymentDescriptionPage from './pages/PaymentDescription';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <div>
      <Navbar />
      <UserProfile />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-payment/:id' element={<RequestPayment />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path='/requests' element={<Requests />} />
        <Route path="/department-head-dashboard" element={<HeadDashboard />} />
        <Route path="/finance-officer-dashboard" element={<FinanceDashboard />} />
        <Route path="/payment-description/:paymentType" element={<PaymentDescriptionPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
