import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  status: string
  created_at: string
}

    async function getEvent(id: string): Promise<Event | null> { try { const response = await fetch(${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events, { cache: "no-store", })

    if (!response.ok) {
      console.log("[v0] Events fetch failed with status:", response.status)
      return []
    }

    const events = await response.json()
    console.log("[v0] Events page - Fetched events:", events.length)
    console.log("[v0] Events page - Events data:", events)
    return events
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export default async function EventsPage() {
  const adminEvents = await getEvents()

  console.log("[v0] Admin events count:", adminEvents.length)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Events & Activities</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Join us in building Africa's democratic future through community engagement
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Upcoming Events */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upcoming Events</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {adminEvents.length > 0 ? (
                  adminEvents.map((event, index) => {
                    const colors = ["bg-blue-600", "bg-red-500", "bg-blue-500"]
                    const colorClass = colors[index % colors.length]

                    return (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                          <div className={`${colorClass} text-white p-4`}>
                            <div className="text-center">
                              <div className="text-2xl font-bold">{new Date(event.event_date).getDate()}</div>
                              <div className="text-sm">
                                {new Date(event.event_date).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
                            <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <span className="mr-2 text-blue-600">📍</span>
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2 text-blue-600">🕐</span>
                              <span>{formatTime(event.event_date)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <>
                    {/* Sample events shown only when no admin events exist */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-blue-600 text-white p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">15</div>
                          <div className="text-sm">March 2024</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Pan-African Unity Summit</h3>
                        <p className="text-gray-700 mb-4">
                          Annual summit bringing together leaders from across Africa to discuss unity and cooperation.
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="mr-2 text-blue-600">📍</span>
                          <span>Accra, Ghana</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2 text-blue-600">🕐</span>
                          <span>9:00 AM - 5:00 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-red-500 text-white p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">22</div>
                          <div className="text-sm">March 2024</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Youth Leadership Workshop</h3>
                        <p className="text-gray-700 mb-4">
                          Empowering young Africans with leadership skills and democratic values.
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="mr-2 text-blue-600">📍</span>
                          <span>Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2 text-blue-600">🕐</span>
                          <span>10:00 AM - 4:00 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-blue-500 text-white p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">05</div>
                          <div className="text-sm">April 2024</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Economic Development Forum</h3>
                        <p className="text-gray-700 mb-4">
                          Discussing sustainable economic policies for African development.
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="mr-2 text-blue-600">📍</span>
                          <span>Nairobi, Kenya</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2 text-blue-600">🕐</span>
                          <span>8:00 AM - 6:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Event Categories */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Event Categories</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎤</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Conferences</h3>
                  <p className="text-gray-600 text-sm">Large-scale gatherings for policy discussions</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Workshops</h3>
                  <p className="text-gray-600 text-sm">Skill-building and educational sessions</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Community</h3>
                  <p className="text-gray-600 text-sm">Local engagement and outreach programs</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Cultural</h3>
                  <p className="text-gray-600 text-sm">Celebrating African heritage and diversity</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-red-500 rounded-lg p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
              <p className="text-xl mb-6">Don't miss out on upcoming events and opportunities to make a difference</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  <span className="mr-2">👥</span>
                  Subscribe to Updates
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors bg-transparent"
                >
                  <span className="mr-2">📅</span>
                  View All Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
