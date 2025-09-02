import React from 'react';

const CountryCarousel = () => {
  const countries = [
    { name: 'Ghana', image: '/ghana.jpg' },
    { name: 'South Africa', image: '/south africa.jpg' },
    { name: 'Guinea', image: '/guinea.jpg' },
    { name: 'Côte d\'Ivoire', image: '/cote devior.jpg' }
  ];

  return (
    <section className="country-flags">
      <div className="flags-container">
        <h2 className="flags-title">ACUP Across Africa</h2>
        <div className="flags-grid">
          {countries.map((country, index) => (
            <div key={index} className="flag-item">
              <img
                src={country.image}
                alt={`ACUP in ${country.name}`}
                className="flag-image"
              />
              <h3 className="flag-name">{country.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountryCarousel;
