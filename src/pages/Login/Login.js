import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isWorker, setIsWorker] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    isWorker ? navigate('/worker-dashboard') : navigate('/user-dashboard');
  };

  return (
    <div className="login-page">
      
      {/* LEFT SIDE – IMAGES */}
      <div className="login-visual">
        <div className="image-slider">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" />
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d" />
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" />
        </div>
      </div>

      {/* RIGHT SIDE – FORM */}
      <div className="login-form">
        <h2>Welcome Back</h2>

        {/* Toggle */}
        <div className="role-toggle">
          <span 
            className={!isWorker ? 'active' : ''} 
            onClick={() => setIsWorker(false)}
          >
            User
          </span>
          <span 
            className={isWorker ? 'active' : ''} 
            onClick={() => setIsWorker(true)}
          >
            Worker
          </span>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button className="btn-primary full-width">
            Login as {isWorker ? 'Worker' : 'User'}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
