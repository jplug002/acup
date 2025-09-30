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

// ✅ fetch ALL events
async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      console.log("[v0] Events fetch failed with status:", response.status)
      return []
    }

    const events: Event[] = await response.json()
    console.log("[v0] Events page - Fetched events:", events.length)
    return events
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export default async function EventsPage() {
  const adminEvents = await getEvents()

  console.log("[v0] Admin events count:", adminEvents.length)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Events & Activities</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Join us in building Africa&apos;s democratic future through community engagement
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
                              <div className="text-2xl font-bold">
                                {new Date(event.event_date).getDate()}
                              </div>
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
                    {/* ... your placeholder events remain the same ... */}
                  </>
                )}
              </div>
            </div>

            {/* Event Categories */}
            {/* ... rest of your code unchanged ... */}
          </div>
        </div>
      </section>
    </main>
  )
}
