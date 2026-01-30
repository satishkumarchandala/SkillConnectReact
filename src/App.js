<<<<<<< HEAD
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup';

>>>>>>> 14b698c284a16bf4ad76df63c02967a6a23f38fb
import './App.css';
import Services from './services';
function App() {
  return (
<<<<<<< HEAD
    <div className="App">
      <h1>Welcome to Skill Connect</h1>
      <Services />
    </div>
=======
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/worker-register" element={<Signup />} />
          
        
          
        </Routes>
      </div>
    </Router>
>>>>>>> 14b698c284a16bf4ad76df63c02967a6a23f38fb
  );
}

export default App;