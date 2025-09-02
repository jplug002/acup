import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content flex justify-between items-center">
        <div className="hero-text">
          <h1 className="welcome-title">WELCOME</h1>
          <div className="welcome-content">
            <p className="hero-subtitle">
              The first Pan-African political party transcending boundaries. This is time for Africans 
              to unite and build, or disunite and perish.
            </p>
            <p className="hero-description">
              Welcome to the Africans' party, at home and abroad, this is the pathway to your origins and majesty.
            </p>
          </div>
          <button className="cta-button">
            Join Our Movement
          </button>
        </div>
        <div className="hero-logo">
          <img src={process.env.PUBLIC_URL + '/ACUP LOGO.jpg'} alt="ACUP Logo" className="hero-logo-img" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
