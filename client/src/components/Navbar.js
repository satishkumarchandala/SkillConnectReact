import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthToken, getAuthUser } from '../utils/auth';
import '../App.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const role = user?.role;

  const navStyle = {
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-light)',
    padding: '1rem 0',
  };

  const linkStyle = {
    color: 'var(--text-light)',
    textDecoration: 'none',
    marginLeft: '20px',
    fontWeight: '500'
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>SkillConnect</h2>
        <div>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/services" style={linkStyle}>Services</Link>
          {role === 'provider' ? (
            <Link to="/provider" style={linkStyle}>Provider</Link>
          ) : null}
          {role === 'customer' ? (
            <Link to="/customer" style={linkStyle}>Customer</Link>
          ) : null}
          {role === 'admin' ? (
            <Link to="/admin" style={linkStyle}>Admin</Link>
          ) : null}
          {!role ? (
            <Link to="/login" style={linkStyle}>Login</Link>
          ) : (
            <button type="button" onClick={handleLogout} style={linkStyle}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;