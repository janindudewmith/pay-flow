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

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-payment/:id' element={<RequestPayment />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path='/requests' element={<Requests />} />
        <Route path='/finance-dashboard' element={<FinanceDashboard />} />
        <Route path='/head-dashboard' element={<HeadDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
