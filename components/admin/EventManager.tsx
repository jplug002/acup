"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { eventQueries } from "@/lib/db"

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
  created_at?: string
  updated_at?: string
}

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    end_date: "",
    location: "",
    event_type: "conference" as "conference" | "rally" | "meeting" | "workshop" | "general",
    status: "upcoming" as "upcoming" | "ongoing" | "completed" | "cancelled",
    max_attendees: 100,
    registration_required: false,
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventQueries.getAll()
      setEvents(data)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingEvent) {
        // Update existing event
        await eventQueries.update(editingEvent.id, {
          title: formData.title,
          description: formData.description,
          event_date: formData.event_date,
          end_date: formData.end_date || undefined,
          location: formData.location,
          event_type: formData.event_type,
          max_attendees: formData.max_attendees,
          registration_required: formData.registration_required,
          status: formData.status,
        })
      } else {
        // Add new event
        await eventQueries.create({
          title: formData.title,
          description: formData.description,
          event_date: formData.event_date,
          end_date: formData.end_date || undefined,
          location: formData.location,
          event_type: formData.event_type,
          max_attendees: formData.max_attendees,
          registration_required: formData.registration_required,
        })
      }

      // Reload events from database
      await loadEvents()
      resetForm()
    } catch (error) {
      console.error("Failed to save event:", error)
      alert("Failed to save event. Please try again.")
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date.split("T")[0] + "T" + event.event_date.split("T")[1]?.substring(0, 5) || "",
      end_date: event.end_date
        ? event.end_date.split("T")[0] + "T" + event.end_date.split("T")[1]?.substring(0, 5)
        : "",
      location: event.location || "",
      event_type: event.event_type,
      status: event.status,
      max_attendees: event.max_attendees || 100,
      registration_required: event.registration_required,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await eventQueries.delete(id)
        await loadEvents()
      } catch (error) {
        console.error("Failed to delete event:", error)
        alert("Failed to delete event. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      end_date: "",
      location: "",
      event_type: "conference",
      status: "upcoming",
      max_attendees: 100,
      registration_required: false,
    })
    setShowForm(false)
    setEditingEvent(null)
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Event
        </button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingEvent ? "Edit Event" : "Add New Event"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the event"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_type: e.target.value as "conference" | "rally" | "meeting" | "workshop" | "general",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="conference">Conference</option>
                    <option value="rally">Rally</option>
                    <option value="meeting">Meeting</option>
                    <option value="workshop">Workshop</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "upcoming" | "ongoing" | "completed" | "cancelled",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registration_required"
                  checked={formData.registration_required}
                  onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="registration_required" className="ml-2 block text-sm text-gray-900">
                  Registration Required
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(event.event_type)}`}
                  >
                    {event.event_type}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}
                  >
                    {event.status}
                  </span>
                  {event.registration_required && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                      Registration Required
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{event.description}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Start:</span>
                <div className="text-gray-600">{formatDateTime(event.event_date)}</div>
              </div>
              {event.end_date && (
                <div>
                  <span className="font-medium text-gray-700">End:</span>
                  <div className="text-gray-600">{formatDateTime(event.end_date)}</div>
                </div>
              )}
              {event.location && (
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <div className="text-gray-600">{event.location}</div>
                </div>
              )}
              {event.max_attendees && (
                <div>
                  <span className="font-medium text-gray-700">Max Attendees:</span>
                  <div className="text-gray-600">{event.max_attendees}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No events found</div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Event
          </button>
        </div>
      )}
    </div>
  )
}
