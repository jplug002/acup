import React from 'react';

const ImpactSection = () => {
  const stats = [
    { number: "2.5M+", label: "Lives Impacted" },
    { number: "15", label: "Countries" },
    { number: "500+", label: "Projects Completed" },
    { number: "1,200", label: "Local Partners" }
  ];

  return (
    <section className="section impact-section">
      <h2 className="section-title">Our Impact</h2>
      <p style={{ 
        textAlign: 'center', 
        fontSize: '1.2rem', 
        maxWidth: '800px', 
        margin: '0 auto 3rem',
        opacity: 0.9 
      }}>
        Through dedicated partnerships and community-driven initiatives, we have achieved 
        remarkable milestones in transforming lives across Africa.
      </p>
      <div className="impact-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactSection;
