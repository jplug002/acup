import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="thank-you-page">
      <h2>Thank You for Registering!</h2>
      <p>Your application has been successfully submitted. We'll be in touch soon to welcome you to the ACUP community.</p>
      <Link to="/" className="cta-button">Return to Home</Link>
    </div>
  );
};

export default ThankYou;
