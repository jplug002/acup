import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>African Cup</h3>
        <p>Building a stronger, more prosperous Africa through community action and sustainable development.</p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          margin: '1.5rem 0',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={16} />
            <span>info@africancup.org</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} />
            <span>+1 (555) 123-4567</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} />
            <span>Pan-African Headquarters</span>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #8B4513', 
          paddingTop: '1rem', 
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>Made with</span>
          <Heart size={16} color="#DC143C" fill="#DC143C" />
          <span>for Africa © 2024 African Cup</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
