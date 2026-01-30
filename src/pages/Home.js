import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  
  // Inline styles for specific sections
  const heroStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 0',
  };

  const sectionTitleStyle = {
    color: 'var(--primary-blue)',
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '2.5rem'
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'var(--white)',
    textAlign: 'center',
    paddingBottom: '20px'
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={heroStyle}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '300px', paddingRight: '20px' }}>
            <h1 style={{ fontSize: '3.5rem', color: 'var(--primary-blue)', marginBottom: '20px' }}>
              Expert Help, <br /> Just a Click Away.
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#555' }}>
              Find trusted carpenters, plumbers, and painters in your area. 
              Book instantly and pay only after the job is done.
            </p>
            <Link to="/login">
              <button className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.2rem' }}>
                Book a Service Now
              </button>
            </Link>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            {/* External Image for Hero */}
            <img 
              src="https://static.vecteezy.com/system/resources/previews/022/448/503/non_2x/workers-on-the-job-for-1-may-labour-day-ai-generative-images-free-photo.jpg" 
              alt="Worker repairing" 
              style={{ width: '100%', borderRadius: '10px' }} 
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container" style={{ padding: '60px 20px' }}>
        <h2 style={sectionTitleStyle}>Our Services</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 1: Carpenter */}
          <div style={cardStyle}>
            <img 
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Carpenter" 
              style={imageStyle} 
            />
            <h3>Carpentry</h3>
            <p style={{ padding: '0 15px' }}>Furniture repair, polishing, and new installations.</p>
          </div>

          {/* Card 2: Plumber */}
          <div style={cardStyle}>
            <img 
              src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Plumber" 
              style={imageStyle} 
            />
            <h3>Plumbing</h3>
            <p style={{ padding: '0 15px' }}>Leak repairs, pipe fitting, and bathroom fixtures.</p>
          </div>

          {/* Card 3: Painter */}
          <div style={cardStyle}>
            <img 
              src="https://img.freepik.com/premium-photo/worker-painter-painting-wall-surface-with-roller-man-work-decorating-room_63762-2847.jpg" 
              alt="Painter" 
              style={imageStyle} 
            />
            <h3>Painting</h3>
            <p style={{ padding: '0 15px' }}>Interior and exterior house painting services.</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary-blue)', color: 'white', padding: '20px 0', textAlign: 'center' }}>
        <p>&copy; 2024 SkillConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;