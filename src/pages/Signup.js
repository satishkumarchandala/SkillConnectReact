import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Signup = () => {
  const navigate = useNavigate();
  const [isWorker, setIsWorker] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    profession: '' // Only for workers
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Registering:', formData);
    // After signup, redirect to login
    navigate('/login');
  };

  // Reuse styles from Login for consistency
  const containerStyle = {
    minHeight: '90vh', // Slightly taller for signup
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0'
  };

  const boxStyle = {
    backgroundColor: 'var(--white)',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box'
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>Create Account</h2>
        
        {/* Simple checkbox to switch to Worker Registration */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ cursor: 'pointer', fontWeight: 'bold', color: '#555' }}>
            <input 
              type="checkbox" 
              checked={isWorker} 
              onChange={() => setIsWorker(!isWorker)}
              style={{ marginRight: '10px' }}
            />
            I want to join as a Worker
          </label>
        </div>

        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            style={inputStyle} 
            onChange={handleChange} 
            required
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            style={inputStyle} 
            onChange={handleChange} 
            required
          />
          <input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number" 
            style={inputStyle} 
            onChange={handleChange} 
            required
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Create Password" 
            style={inputStyle} 
            onChange={handleChange} 
            required
          />

          {/* Show this dropdown ONLY if 'isWorker' is true */}
          {isWorker && (
            <select 
              name="profession" 
              style={inputStyle} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Your Profession</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Plumber">Plumber</option>
              <option value="Painter">Painter</option>
              <option value="Electrician">Electrician</option>
              <option value="Cleaner">Cleaner</option>
            </select>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Register as {isWorker ? 'Worker' : 'User'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;