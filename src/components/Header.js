import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/ACUP LOGO.jpg" alt="ACUP Logo" style={{ height: '40px', width: 'auto' }} />
        </div>
        <nav>
          <ul className="nav">
            <li><Link to="/">Welcome</Link></li>
            <li><Link to="/ideology">Ideology</Link></li>
            <li><Link to="/membership">Membership</Link></li>
            <li><Link to="/branches">Branches</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/membership-card">Membership Card</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
