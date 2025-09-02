import React from 'react';

const VisionSection = () => {
  return (
    <section className="section mission-section">
      <h2 className="section-title">Our Vision</h2>
      <div className="about-text">
        <div style={{ 
          background: 'var(--cream-white)', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '2px solid var(--light-brown)'
        }}>
          <h3 style={{ 
            color: 'var(--primary-brown)', 
            marginBottom: '1rem',
            fontSize: '1.3rem',
            fontWeight: 'bold'
          }}>
            Vision Statement
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            lineHeight: '1.8'
          }}>
            "To establish an African global power-base, through a continental government built on a new 
            leadership inspired by our common interest." A leadership built on the idea of Pan-Africanism, 
            trained for, and by Africans, and subsidized by Africans.
          </p>
        </div>
        
        <div className="about-text">
          <p>
            This Pan-African vision of continental governance system is inspired by historical events that 
            have shaped the face of our continent. In fact, the current African geography and its internal 
            institutions were created by Europeans who had no other vision except, to conquer and exploit 
            African resources. Consequently, the African vision should not be built on the foundation of 
            the European vision, it should be aiming to establish a new foundation on which the future will 
            be based, and that is our aim.
          </p>
          <p>
            Especially, after a half century of the so-called African independence we have tried to protect 
            and defend the foundation established by the oppressors for our destruction, and the result is, 
            we have turned ourselves into tools of self-destruction. However, it is never too late to do 
            things right, it is never too late to lay a new foundation of unity, Ubuntu and prosperity. 
            Finally, it is never too late to be in charge again.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
