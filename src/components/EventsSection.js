import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: "ACUP Leadership Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Accra, Ghana",
      description: "Join African leaders from across the continent for our annual leadership summit focusing on Pan-African unity and development.",
      type: "Summit",
      featured: true
    },
    {
      id: 2,
      title: "Youth Empowerment Workshop",
      date: "April 22, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Lagos, Nigeria",
      description: "Empowering the next generation of African leaders through The Free-Minded academy program.",
      type: "Workshop",
      featured: false
    },
    {
      id: 3,
      title: "Continental Unity Conference",
      date: "May 10, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Johannesburg, South Africa",
      description: "Discussing strategies for African continental government and economic integration.",
      type: "Conference",
      featured: false
    }
  ];

  const news = [
    {
      id: 1,
      title: "ACUP Expands to Five New African Countries",
      date: "February 28, 2024",
      excerpt: "The African Cup Political Party announces its expansion into Guinea, Gambia, and three other African nations, strengthening Pan-African unity.",
      category: "Expansion"
    },
    {
      id: 2,
      title: "The Free-Minded Academy Graduates 200 New Leaders",
      date: "February 15, 2024",
      excerpt: "Our leadership development program celebrates another successful cohort of African leaders ready to transform the continent.",
      category: "Education"
    },
    {
      id: 3,
      title: "ACUP Partners with African Development Bank",
      date: "January 30, 2024",
      excerpt: "Strategic partnership announced to support African-funded development projects across the continent.",
      category: "Partnership"
    }
  ];

  return (
    <section className="events-section">
      <div className="events-container">
        <div className="events-header">
          <h2 className="section-title">Events & News</h2>
          <p className="events-subtitle">Stay updated with ACUP's latest activities and developments across Africa</p>
        </div>

        <div className="events-content">
          {/* Events Column */}
          <div className="events-column">
            <h3 className="column-title">Upcoming Events</h3>
            <div className="events-list">
              {events.map((event) => (
                <div key={event.id} className={`event-card ${event.featured ? 'featured' : ''}`}>
                  <div className="event-type">{event.type}</div>
                  <h4 className="event-title">{event.title}</h4>
                  <div className="event-details">
                    <div className="event-detail">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="event-detail">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="event-detail">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <button className="event-btn">Learn More</button>
                </div>
              ))}
            </div>
          </div>

          {/* News Column */}
          <div className="news-column">
            <h3 className="column-title">Latest News</h3>
            <div className="news-list">
              {news.map((article) => (
                <div key={article.id} className="news-card">
                  <div className="news-category">{article.category}</div>
                  <h4 className="news-title">{article.title}</h4>
                  <p className="news-date">{article.date}</p>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <button className="news-btn">Read More</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
