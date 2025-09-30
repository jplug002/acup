import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Event {
  id: number
  title: string
  description: string
  event_date: string   // ✅ use event_date (matches DB + API)
  location: string
  registration_required?: boolean
  created_at: string
  updated_at: string
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`/api/events`, { cache: "no-store" })

    if (!response.ok) return null

    const events: Event[] = await response.json()
    return events.find((event) => event.id.toString() === id) || null
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}


export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/events"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800">Event</Badge>
            {event.registration_required && <Badge className="bg-red-100 text-red-800">Registration Required</Badge>}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Event Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What to Expect</h4>
                      <p className="text-gray-600">
                        Join us for an engaging event that brings together ACUP members and supporters. This is an
                        opportunity to connect with like-minded individuals and contribute to our mission.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Who Should Attend</h4>
                      <p className="text-gray-600">
                        This event is open to all ACUP members, supporters, and anyone interested in learning more about
                        our initiatives.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-3 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Date & Time</div>
                      <div className="text-gray-600">{formatDateTime(event.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 text-red-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-gray-600">{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users size={20} className="mr-3 text-green-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Registration</div>
                      <div className="text-gray-600">{event.registration_required ? "Required" : "Not Required"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {event.registration_required && (
                      <Button className="w-full bg-red-600 hover:bg-red-700">Register for Event</Button>
                    )}
                    <Button variant="outline" className="w-full bg-transparent">
                      Add to Calendar
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Share Event
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Have questions about this event? Contact your local ACUP branch for more information.
                  </p>
                  <Link href="/branches">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Find Local Branch
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
