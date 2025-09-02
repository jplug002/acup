import { Calendar, MapPin, Clock } from "lucide-react"

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: "ACUP Leadership Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Accra, Ghana",
      description:
        "Join African leaders from across the continent for our annual leadership summit focusing on Pan-African unity and development.",
      type: "Summit",
      featured: true,
    },
    {
      id: 2,
      title: "Youth Empowerment Workshop",
      date: "April 22, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Lagos, Nigeria",
      description: "Empowering the next generation of African leaders through The Free-Minded academy program.",
      type: "Workshop",
      featured: false,
    },
    {
      id: 3,
      title: "Continental Unity Conference",
      date: "May 10, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Johannesburg, South Africa",
      description: "Discussing strategies for African continental government and economic integration.",
      type: "Conference",
      featured: false,
    },
  ]

  const news = [
    {
      id: 1,
      title: "ACUP Expands to Five New African Countries",
      date: "February 28, 2024",
      excerpt:
        "The African Cup Political Party announces its expansion into Guinea, Gambia, and three other African nations, strengthening Pan-African unity.",
      category: "Expansion",
    },
    {
      id: 2,
      title: "The Free-Minded Academy Graduates 200 New Leaders",
      date: "February 15, 2024",
      excerpt:
        "Our leadership development program celebrates another successful cohort of African leaders ready to transform the continent.",
      category: "Education",
    },
    {
      id: 3,
      title: "ACUP Partners with African Development Bank",
      date: "January 30, 2024",
      excerpt: "Strategic partnership announced to support African-funded development projects across the continent.",
      category: "Partnership",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Events & News</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with ACUP's latest activities and developments across Africa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Column */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${event.featured ? "border-l-4 border-blue-600" : ""}`}
                >
                  <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                    {event.type}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{event.title}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm md:text-base">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm md:text-base">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm md:text-base">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors w-full sm:w-auto">
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* News Column */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Latest News</h3>
            <div className="space-y-6">
              {news.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                    {article.category}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">{article.date}</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">{article.excerpt}</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors w-full sm:w-auto">
                    Read More
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
