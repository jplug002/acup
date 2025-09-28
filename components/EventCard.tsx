import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  end_date?: string
  location?: string
  event_type: "conference" | "rally" | "meeting" | "workshop" | "general"
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  max_attendees?: number
  registration_required: boolean
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "conference":
        return "bg-blue-100 text-blue-800"
      case "rally":
        return "bg-red-100 text-red-800"
      case "meeting":
        return "bg-gray-100 text-gray-800"
      case "workshop":
        return "bg-green-100 text-green-800"
      case "general":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-gray-200 rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight">{event.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className={getTypeColor(event.event_type)}>{event.event_type}</Badge>
            {event.registration_required && <Badge className="bg-red-100 text-red-800">Registration Required</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-gray-700 text-base leading-relaxed line-clamp-3">
          {event.description}
        </CardDescription>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-3 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Date</div>
              <div className="text-sm">{formatDate(event.event_date)}</div>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock size={18} className="mr-3 text-red-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Time</div>
              <div className="text-sm">{formatTime(event.event_date)}</div>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center text-gray-600 col-span-2">
              <MapPin size={18} className="mr-3 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Location</div>
                <div className="text-sm">{event.location}</div>
              </div>
            </div>
          )}

          {event.max_attendees && (
            <div className="flex items-center text-gray-600 col-span-2">
              <Users size={18} className="mr-3 text-red-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Max Attendees</div>
                <div className="text-sm">{event.max_attendees} people</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Link href={`/events/${event.id}`} className="flex-1">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Learn More
            </button>
          </Link>
          {event.registration_required && (
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Register
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
