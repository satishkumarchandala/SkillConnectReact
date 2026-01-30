import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { register } from '../services/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [isWorker, setIsWorker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: isWorker ? 'provider' : 'customer'
      });
      navigate('/login');
    } catch (error) {
      setErrorMessage(error?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    backgroundColor: 'var(--bg-soft)',
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
    border: '1px solid var(--border-muted)',
    borderRadius: '5px',
    boxSizing: 'border-box'
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>Create Account</h2>
        
        {/* Simple checkbox to switch to Worker Registration */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-muted)' }}>
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
            value={formData.name}
            required
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            style={inputStyle} 
            onChange={handleChange} 
            value={formData.email}
            required
          />
          <input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number" 
            style={inputStyle} 
            onChange={handleChange} 
            value={formData.phone}
            required
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Create Password" 
            style={inputStyle} 
            onChange={handleChange} 
            value={formData.password}
            required
          />

          {/* Show this dropdown ONLY if 'isWorker' is true */}
          {isWorker && (
            <select 
              name="profession" 
              style={inputStyle} 
              onChange={handleChange} 
              value={formData.profession}
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

          {errorMessage && (
            <div style={{ color: '#b91c1c', marginBottom: '10px' }}>{errorMessage}</div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : `Register as ${isWorker ? 'Worker' : 'User'}`}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;