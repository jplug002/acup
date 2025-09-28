"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"

interface DashboardStats {
  branches: number
  ideologies: number
  events: number
  articles: number
}

interface Branch {
  id: string
  name: string
  city: string
  contact_email: string
  contact_phone: string
  description: string
  created_at: string
}

interface Ideology {
  id: string
  title: string
  description: string
  category: string
  created_at: string
}

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  registration_required: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [activeTab, setActiveTab] = useState("events")

  const [stats, setStats] = useState<DashboardStats>({
    branches: 0,
    ideologies: 0,
    events: 0,
    articles: 47,
  })

  const [branches, setBranches] = useState<Branch[]>([])
  const [ideologies, setIdeologies] = useState<Ideology[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    registration_required: true,
  })

  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    contact_email: "",
    contact_phone: "",
    description: "",
  })

  const [newIdeology, setNewIdeology] = useState({
    title: "",
    content: "",
    category: "political",
  })

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "acup@123") {
      setIsAuthenticated(true)
      setPasswordError("")
    } else {
      setPasswordError("Invalid password. Please try again.")
      setPassword("")
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching admin data...")

      const [branchesRes, ideologiesRes, eventsRes] = await Promise.all([
        fetch("/api/admin/branches"),
        fetch("/api/admin/ideologies"),
        fetch("/api/admin/events"),
      ])

      console.log("[v0] API responses:", {
        branches: branchesRes.status,
        ideologies: ideologiesRes.status,
        events: eventsRes.status,
      })

      const branchesData = branchesRes.ok ? await branchesRes.json() : []
      const ideologiesData = ideologiesRes.ok ? await ideologiesRes.json() : []
      const eventsData = eventsRes.ok ? await eventsRes.json() : []

      setBranches(branchesData)
      setIdeologies(ideologiesData)
      setEvents(eventsData)

      setStats({
        branches: branchesData.length,
        ideologies: ideologiesData.length,
        events: eventsData.length,
        articles: 47,
      })
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      setError(`Failed to fetch data: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      console.log("[v0] Creating event with data:", newEvent)

      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date, // This matches what the API expects
          location: newEvent.location,
          registration_required: newEvent.registration_required,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API Error:", errorData)
        alert(`Failed to create event: ${errorData.error || "Unknown error"}`)
        return
      }

      const result = await response.json()
      console.log("[v0] Event created successfully:", result)

      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        registration_required: true,
      })
      fetchData()
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      alert("Failed to create event. Please check the console for details.")
    }
  }

  const handleCreateBranch = async () => {
    try {
      console.log("[v0] Creating branch with data:", newBranch)

      const response = await fetch("/api/admin/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newBranch.name,
          location: newBranch.location,
          contact_email: newBranch.contact_email,
          contact_phone: newBranch.contact_phone,
          description: newBranch.description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API Error:", errorData)
        alert(`Failed to create branch: ${errorData.error || "Unknown error"}`)
        return
      }

      const result = await response.json()
      console.log("[v0] Branch created successfully:", result)

      setNewBranch({
        name: "",
        location: "",
        contact_email: "",
        contact_phone: "",
        description: "",
      })
      fetchData()
    } catch (error) {
      console.error("[v0] Error creating branch:", error)
      alert("Failed to create branch. Please check the console for details.")
    }
  }

  const handleCreateIdeology = async () => {
    try {
      console.log("[v0] Creating ideology with data:", newIdeology)

      if (!newIdeology.title.trim() || !newIdeology.content.trim()) {
        alert("Please fill in both title and content fields")
        return
      }

      const response = await fetch("/api/admin/ideologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newIdeology.title,
          content: newIdeology.content,
          category: newIdeology.category,
        }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API Error:", errorData)
        alert(`Failed to create ideology: ${errorData.error || "Unknown error"}`)
        return
      }

      const result = await response.json()
      console.log("[v0] Ideology created successfully:", result)

      alert("Ideology created successfully!")

      setNewIdeology({
        title: "",
        content: "",
        category: "political",
      })
      fetchData()
    } catch (error) {
      console.error("[v0] Error creating ideology:", error)
      alert("Failed to create ideology. Please check the console for details.")
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const handleDeleteBranch = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/branches/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting branch:", error)
    }
  }

  const handleDeleteIdeology = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ideologies/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting ideology:", error)
    }
  }

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("[v0] Client error caught:", event.error)
      setError(`Client error: ${event.error?.message || "Unknown error"}`)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("[v0] Unhandled promise rejection:", event.reason)
      setError(`Promise rejection: ${event.reason}`)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              window.location.reload()
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ACUP Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter the admin password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Access Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-red-600 hover:text-red-700 font-medium transition-colors">
              ← Back to Site
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">ACUP Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
            <span className="hidden sm:inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Welcome, Admin
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Branches</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.branches}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Ideologies</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.ideologies}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Events</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.events}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Articles</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.articles}</div>
          </div>
        </div>

        {/* Management Tabs */}
        <div className="space-y-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "events" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("branches")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "branches" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Branches
            </button>
            <button
              onClick={() => setActiveTab("ideologies")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "ideologies" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ideologies
            </button>
          </div>

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Create New Event</h2>
                <p className="text-gray-600 mb-6">Add a new event to the ACUP calendar</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Event Title</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="datetime-local"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Enter event location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateEvent}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </div>

              {/* Events List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Events</h2>
                {loading ? (
                  <p>Loading events...</p>
                ) : events.length === 0 ? (
                  <p className="text-gray-500">No events found.</p>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Branches Tab */}
          {activeTab === "branches" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Create New Branch</h2>
                <p className="text-gray-600 mb-6">Add a new ACUP branch location</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Branch Name</label>
                      <input
                        type="text"
                        value={newBranch.name}
                        onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                        placeholder="Enter branch name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={newBranch.location}
                        onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                        placeholder="Enter branch location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        value={newBranch.contact_email}
                        onChange={(e) => setNewBranch({ ...newBranch, contact_email: e.target.value })}
                        placeholder="Enter contact email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Contact Phone</label>
                      <input
                        type="text"
                        value={newBranch.contact_phone}
                        onChange={(e) => setNewBranch({ ...newBranch, contact_phone: e.target.value })}
                        placeholder="Enter contact phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newBranch.description}
                      onChange={(e) => setNewBranch({ ...newBranch, description: e.target.value })}
                      placeholder="Enter branch description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateBranch}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Create Branch
                  </button>
                </div>
              </div>

              {/* Branches List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Branches</h2>
                {loading ? (
                  <p>Loading branches...</p>
                ) : branches.length === 0 ? (
                  <p className="text-gray-500">No branches found.</p>
                ) : (
                  <div className="space-y-4">
                    {branches.map((branch) => (
                      <div
                        key={branch.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                          <p className="text-sm text-gray-600">{branch.city}</p>
                          <p className="text-sm text-gray-500">{branch.contact_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteBranch(branch.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ideologies Tab */}
          {activeTab === "ideologies" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Create New Ideology</h2>
                <p className="text-gray-600 mb-6">Add a new ideological content piece</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={newIdeology.title}
                        onChange={(e) => setNewIdeology({ ...newIdeology, title: e.target.value })}
                        placeholder="Enter ideology title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={newIdeology.category}
                        onChange={(e) => setNewIdeology({ ...newIdeology, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="political">Political</option>
                        <option value="economic">Economic</option>
                        <option value="social">Social</option>
                        <option value="cultural">Cultural</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      value={newIdeology.content}
                      onChange={(e) => setNewIdeology({ ...newIdeology, content: e.target.value })}
                      placeholder="Enter ideology content"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateIdeology}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Create Ideology
                  </button>
                </div>
              </div>

              {/* Ideologies List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Ideologies</h2>
                {loading ? (
                  <p>Loading ideologies...</p>
                ) : ideologies.length === 0 ? (
                  <p className="text-gray-500">No ideologies found.</p>
                ) : (
                  <div className="space-y-4">
                    {ideologies.map((ideology) => (
                      <div
                        key={ideology.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{ideology.title}</h3>
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full mt-1">
                            {ideology.category}
                          </span>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ideology.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteIdeology(ideology.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
