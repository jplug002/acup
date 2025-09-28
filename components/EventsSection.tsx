import React from "react";
import useSWR from "swr";
import EventCard from "./EventCard";
import { Calendar, MapPin, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EventsSection = () => {
  const { data: events = [], isLoading } = useSWR("/api/events", fetcher, { refreshInterval: 5000 });

  const today = new Date();
  const previousEvents = events.filter((event: any) => new Date(event.date) < today);
  const upcomingEvents = events.filter((event: any) => new Date(event.date) >= today);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Events</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with ACUP's latest activities and developments across Africa
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
            <div className="space-y-6">
              {isLoading ? <p>Loading...</p> : (
                upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : <p>No upcoming events.</p>
              )}
            </div>
          </div>
          {/* Previous Events */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Previous Events</h3>
            <div className="space-y-6">
              {isLoading ? <p>Loading...</p> : (
                previousEvents.length > 0 ? (
                  previousEvents.map((event: any) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : <p>No previous events.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
