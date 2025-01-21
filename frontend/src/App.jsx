import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RequestPayment from './pages/RequestPayment';
import Requests from './pages/Requests';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <Navbar /> 
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-payment/:id' element={<RequestPayment />} />
        <Route path='/requests' element={<Requests />} />
      </Routes>
    </div>
  );
};

export default App;
