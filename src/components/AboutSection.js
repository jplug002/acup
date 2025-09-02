import React from 'react';
import africaCountriesImage from '../assets/africa countries.jpg';

const AboutSection = () => {
  return (
    <section className="section about-section">
      <h2 className="section-title">About Us</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            The ACUP is a unique African Political Party that many Africans identify themselves with, 
            and in which Africans worldwide find the hope to meet our common aspirations of freedom, 
            prosperity and dignity. What makes the ACUP unique is the fact that we do not fit into the 
            standard of traditional political parties funded and controlled by the system. Our party is 
            funded and controlled by Africans who identify themselves with it. In reality, this is the 
            Africans' party.
          </p>
          <p>
            This party is inspired by the same philosophy of Marcus Garvey, Kwame Nkrumah, Patrice Lumumba, 
            Thomas Sankara and many others whose dedication to the cause of our liberation continues to light 
            our minds today. The choice of ACUP is not a choice for a particular leader, but it is a choice 
            of the common ideology, ambition and the vision upon which we are building the new world for us 
            and our children.
          </p>
          <p>
            In other words, with ACUP there is no leader and follower, everyone who joins the party receives 
            the skills to become a potential leader. Essentially, everything Africa needs for its development 
            is already here, and the people that Africa needs for its new direction is just you.
          </p>
        </div>
        <div className="about-image">
          <img 
            src={africaCountriesImage} 
            alt="African countries and communities" 
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(139, 69, 19, 0.2)'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
