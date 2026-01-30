import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Navbar = () => {
  const navStyle = {
    backgroundColor: 'var(--primary-blue)',
    color: 'var(--white)',
    padding: '1rem 0',
  };

  const linkStyle = {
    color: 'var(--white)',
    textDecoration: 'none',
    marginLeft: '20px',
    fontWeight: '500'
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>SkillConnect</h2>
        <div>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/services" style={linkStyle}>Services</Link>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/worker-register" style={{...linkStyle, backgroundColor: 'white', color: '#00008b', padding: '8px 15px', borderRadius: '4px'}}>Join as Worker</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;