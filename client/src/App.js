import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin/Admin';
import ProviderDashboard from './pages/Provider/ProviderDashboard';
import CustomerDashboard from './pages/Customer/CustomerDashboard';

import './App.css';
import Services from './services';
function App() {
  return (
    <>
    <Router>
      <div className="App">
        <Navbar />
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/worker-register" element={<Signup />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          
        
          
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;