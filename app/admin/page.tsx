"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useToast } from "@/hooks/use-toast"

import Link from "next/link"

interface DashboardStats {
  branches: number
  ideologies: number
  events: number
  articles: number
  leadership: number
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
  content: string
  category: string
  status: string
  created_at: string
  download_id?: number
  file_url?: string
  file_name?: string
  file_type?: string
  file_size?: number
  download_count?: number
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

interface LeadershipProfile {
  id: number
  name: string
  role: string
  title: string
  bio: string
  photo_url: string
  display_order: number
  status: string
}

export default function AdminDashboard() {
  const { toast } = useToast()

  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [activeTab, setActiveTab] = useState("events")

  const [stats, setStats] = useState<DashboardStats>({
    branches: 0,
    ideologies: 0,
    events: 0,
    articles: 0,
    leadership: 0,
  })

  const [branches, setBranches] = useState<Branch[]>([])
  const [ideologies, setIdeologies] = useState<Ideology[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [leadership, setLeadership] = useState<LeadershipProfile[]>([])
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

  const [ideologyFile, setIdeologyFile] = useState<string>("")
  const [ideologyFileName, setIdeologyFileName] = useState<string>("")

  const [newLeader, setNewLeader] = useState({
    name: "",
    role: "",
    title: "",
    bio: "",
    photo_url: "",
  })

  const [leaderImagePreview, setLeaderImagePreview] = useState<string>("")

  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editingBranch, setEditingBranch] = useState<string | null>(null)
  const [editingIdeology, setEditingIdeology] = useState<string | null>(null)
  const [editingLeader, setEditingLeader] = useState<number | null>(null)

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

      const [branchesRes, ideologiesRes, eventsRes, leadershipRes] = await Promise.all([
        fetch("/api/admin/branches"),
        fetch("/api/admin/ideologies"),
        fetch("/api/admin/events"),
        fetch("/api/admin/leadership"),
      ])

      console.log("[v0] API responses:", {
        branches: branchesRes.status,
        ideologies: ideologiesRes.status,
        events: eventsRes.status,
        leadership: leadershipRes.status,
      })

      const branchesData = branchesRes.ok ? await branchesRes.json() : []
      const ideologiesData = ideologiesRes.ok ? await ideologiesRes.json() : []
      const eventsData = eventsRes.ok ? await eventsRes.json() : []
      const leadershipData = leadershipRes.ok ? await leadershipRes.json() : []

      setBranches(branchesData)
      setIdeologies(ideologiesData)
      setEvents(eventsData)
      setLeadership(leadershipData)

      setStats({
        branches: branchesData.length,
        ideologies: ideologiesData.length,
        events: eventsData.length,
        articles: 0,
        leadership: leadershipData.length,
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
        toast({
          title: "Error",
          description: `Failed to create event: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
        return
      }

      const result = await response.json()
      console.log("[v0] Event created successfully:", result)

      toast({
        title: "Success",
        description: "Event has been successfully created",
      })

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
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
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
        toast({
          title: "Error",
          description: `Failed to create branch: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
        return
      }

      const result = await response.json()
      console.log("[v0] Branch created successfully:", result)

      toast({
        title: "Success",
        description: "Branch has been successfully created",
      })

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
      toast({
        title: "Error",
        description: "Failed to create branch. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleIdeologyFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File",
          description: "Please select a PDF or Word document",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size should be less than 10MB",
          variant: "destructive",
        })
        return
      }

      try {
        // Convert file to base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          setIdeologyFile(base64)
          setIdeologyFileName(file.name)
          console.log("[v0] File loaded:", file.name, "Size:", file.size, "bytes")
        }
        reader.onerror = () => {
          toast({
            title: "Error",
            description: "Failed to read file. Please try again.",
            variant: "destructive",
          })
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("[v0] Error processing file:", error)
        toast({
          title: "Error",
          description: "Failed to process file. Please try another file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreateIdeology = async () => {
    try {
      console.log("[v0] Creating ideology with data:", newIdeology)

      if (!newIdeology.title.trim() || !newIdeology.content.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in both title and content fields",
          variant: "destructive",
        })
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
          file: ideologyFile,
          fileName: ideologyFileName,
        }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        let errorMessage = "Unknown error"

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.details || errorMessage
        } catch (parseError) {
          // If JSON parsing fails, it's likely an HTML error page
          const textError = await response.text()
          console.error("[v0] Non-JSON error response:", textError)

          if (response.status === 413) {
            errorMessage = "File too large. Please use a file smaller than 10MB."
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again or use a smaller file."
          } else {
            errorMessage = `Server returned error ${response.status}`
          }
        }

        console.error("[v0] API Error:", errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      const result = await response.json()
      console.log("[v0] Ideology created successfully:", result)

      toast({
        title: "Success",
        description: "Ideology has been successfully created",
      })

      setNewIdeology({
        title: "",
        content: "",
        category: "political",
      })
      setIdeologyFile("")
      setIdeologyFileName("")
      fetchData()
    } catch (error) {
      console.error("[v0] Error creating ideology:", error)
      toast({
        title: "Error",
        description: "Failed to create ideology. Please try again with a smaller file.",
        variant: "destructive",
      })
    }
  }

  const handleCreateLeader = async () => {
    try {
      console.log("[v0] Creating leader with data:", newLeader)

      if (!newLeader.name.trim() || !newLeader.role.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in name and role fields",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/admin/leadership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLeader),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API Error:", errorData)
        toast({
          title: "Error",
          description: `Failed to create leader: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
        return
      }

      const result = await response.json()
      console.log("[v0] Leader created successfully:", result)

      toast({
        title: "Success",
        description: "Leadership profile has been successfully created",
      })

      setNewLeader({
        name: "",
        role: "",
        title: "",
        bio: "",
        photo_url: "",
      })
      setLeaderImagePreview("")
      fetchData()
    } catch (error) {
      console.error("[v0] Error creating leader:", error)
      toast({
        title: "Error",
        description: "Failed to create leader. Please try again.",
        variant: "destructive",
      })
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

  const handleDeleteLeader = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/leadership/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting leader:", error)
    }
  }

  const handleUpdateEvent = async (id: string) => {
    try {
      const event = events.find((e) => e.id === id)
      if (!event) return

      const response = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          event_date: newEvent.date, // Changed from 'date' to 'event_date' to match database
          location: newEvent.location,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event has been successfully updated",
        })
        setEditingEvent(null)
        setNewEvent({
          title: "",
          description: "",
          date: "",
          location: "",
          registration_required: true,
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Failed to update event: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBranch = async (id: string) => {
    try {
      const contactInfo = JSON.stringify({
        email: newBranch.contact_email,
        phone: newBranch.contact_phone,
        description: newBranch.description,
      })

      const response = await fetch(`/api/admin/branches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBranch.name,
          location: newBranch.location,
          contact_info: contactInfo, // Changed to match database schema
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Branch has been successfully updated",
        })
        setEditingBranch(null)
        setNewBranch({
          name: "",
          location: "",
          contact_email: "",
          contact_phone: "",
          description: "",
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Failed to update branch: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating branch:", error)
      toast({
        title: "Error",
        description: "Failed to update branch. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateIdeology = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ideologies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newIdeology.title,
          content: newIdeology.content, // Changed from 'description' to 'content' to match database
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ideology has been successfully updated",
        })
        setEditingIdeology(null)
        setNewIdeology({
          title: "",
          content: "",
          category: "political",
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Failed to update ideology: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating ideology:", error)
      toast({
        title: "Error",
        description: "Failed to update ideology. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLeader = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/leadership/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeader),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Leadership profile has been successfully updated",
        })
        setEditingLeader(null)
        setNewLeader({
          name: "",
          role: "",
          title: "",
          bio: "",
          photo_url: "",
        })
        setLeaderImagePreview("")
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Failed to update leader: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating leader:", error)
      toast({
        title: "Error",
        description: "Failed to update leader. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEditEvent = (event: Event) => {
    setEditingEvent(event.id)
    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.event_date).toISOString().slice(0, 16),
      location: event.location,
      registration_required: event.registration_required,
    })
  }

  const startEditBranch = (branch: Branch) => {
    setEditingBranch(branch.id)
    setNewBranch({
      name: branch.name,
      location: branch.city,
      contact_email: branch.contact_email,
      contact_phone: branch.contact_phone,
      description: branch.description,
    })
  }

  const startEditIdeology = (ideology: Ideology) => {
    setEditingIdeology(ideology.id)
    setNewIdeology({
      title: ideology.title,
      content: ideology.content,
      category: ideology.category,
    })
  }

  const startEditLeader = (leader: LeadershipProfile) => {
    setEditingLeader(leader.id)
    setNewLeader({
      name: leader.name,
      role: leader.role,
      title: leader.title,
      bio: leader.bio,
      photo_url: leader.photo_url,
    })
    setLeaderImagePreview(leader.photo_url)
  }

  const cancelEdit = () => {
    setEditingEvent(null)
    setEditingBranch(null)
    setEditingIdeology(null)
    setEditingLeader(null)
    setNewEvent({
      title: "",
      description: "",
      date: "",
      location: "",
      registration_required: true,
    })
    setNewBranch({
      name: "",
      location: "",
      contact_email: "",
      contact_phone: "",
      description: "",
    })
    setNewIdeology({
      title: "",
      content: "",
      category: "political",
    })
    setIdeologyFile("")
    setIdeologyFileName("")
    setNewLeader({
      name: "",
      role: "",
      title: "",
      bio: "",
      photo_url: "",
    })
    setLeaderImagePreview("")
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            reject(new Error("Failed to get canvas context"))
            return
          }

          // Calculate new dimensions (max 800px on longest side)
          const maxSize = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to base64 with compression (0.8 quality)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8)
          resolve(compressedBase64)
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleLeaderImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      try {
        const compressedBase64 = await compressImage(file)
        console.log("[v0] Image compressed, size:", compressedBase64.length, "characters")
        setNewLeader({ ...newLeader, photo_url: compressedBase64 })
        setLeaderImagePreview(compressedBase64)
      } catch (error) {
        console.error("[v0] Error compressing image:", error)
        toast({
          title: "Error",
          description: "Failed to process image. Please try another image.",
          variant: "destructive",
        })
      }
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
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
            <Link
              href="/"
              className="text-red-600 hover:text-red-700 font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              ← Back
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">ACUP Admin</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Branches</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.branches}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Ideologies</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.ideologies}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Events</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.events}</div>
          </div>
          <Link
            href="/admin/blog"
            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Articles</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">Manage →</div>
          </Link>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Leadership</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.leadership}</div>
          </div>
          <Link
            href="/admin/users"
            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Users</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">Manage →</div>
          </Link>
        </div>

        {/* Management Tabs */}
        <div className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit min-w-full sm:min-w-0">
              <button
                onClick={() => setActiveTab("events")}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "events" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab("branches")}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "branches" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Branches
              </button>
              <button
                onClick={() => setActiveTab("ideologies")}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "ideologies" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Ideologies
              </button>
              <button
                onClick={() => setActiveTab("leadership")}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "leadership" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Leadership
              </button>
            </div>
          </div>

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {editingEvent ? "Update the event details" : "Add a new event to the ACUP calendar"}
                </p>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => (editingEvent ? handleUpdateEvent(editingEvent) : handleCreateEvent())}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      {editingEvent ? "Update Event" : "Create Event"}
                    </button>
                    {editingEvent && (
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
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
                            onClick={() => startEditEvent(event)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {editingBranch ? "Edit Branch" : "Create New Branch"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {editingBranch ? "Update the branch details" : "Add a new ACUP branch location"}
                </p>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => (editingBranch ? handleUpdateBranch(editingBranch) : handleCreateBranch())}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      {editingBranch ? "Update Branch" : "Create Branch"}
                    </button>
                    {editingBranch && (
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
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
                            onClick={() => startEditBranch(branch)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {editingIdeology ? "Edit Ideology" : "Create New Ideology"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {editingIdeology ? "Update the ideology details" : "Add a new ideological content piece"}
                </p>
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Upload Document (Optional)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleIdeologyFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                    />
                    <p className="text-sm text-gray-500">Upload a PDF or Word document (max 10MB)</p>
                    {ideologyFileName && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>File selected: {ideologyFileName}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => (editingIdeology ? handleUpdateIdeology(editingIdeology) : handleCreateIdeology())}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      {editingIdeology ? "Update Ideology" : "Create Ideology"}
                    </button>
                    {editingIdeology && (
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
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
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ideology.content}</p>
                          {ideology.file_url && <p className="text-xs text-green-600 mt-1">📄 Document attached</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditIdeology(ideology)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
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

          {activeTab === "leadership" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {editingLeader ? "Edit Leadership Profile" : "Add Leadership Profile"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {editingLeader ? "Update the leader details" : "Add a new leader to the leadership team"}
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Name *</label>
                      <input
                        type="text"
                        value={newLeader.name}
                        onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                        placeholder="Enter leader name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Role *</label>
                      <input
                        type="text"
                        value={newLeader.role}
                        onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                        placeholder="e.g., Chief Executive Officer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={newLeader.title}
                      onChange={(e) => setNewLeader({ ...newLeader, title: e.target.value })}
                      placeholder="e.g., President, Vice President"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLeaderImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                    />
                    <p className="text-sm text-gray-500">Upload an image from your device (max 5MB)</p>
                    {leaderImagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={leaderImagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      value={newLeader.bio}
                      onChange={(e) => setNewLeader({ ...newLeader, bio: e.target.value })}
                      placeholder="Enter leader biography"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => (editingLeader ? handleUpdateLeader(editingLeader) : handleCreateLeader())}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      {editingLeader ? "Update Leader" : "Add Leader"}
                    </button>
                    {editingLeader && (
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Leadership List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Leadership Team</h2>
                {loading ? (
                  <p>Loading leadership...</p>
                ) : leadership.length === 0 ? (
                  <p className="text-gray-500">No leadership profiles found.</p>
                ) : (
                  <div className="space-y-4">
                    {leadership.map((leader) => (
                      <div key={leader.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        {leader.photo_url ? (
                          <img
                            src={leader.photo_url || "/placeholder.svg"}
                            alt={leader.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-3xl">👤</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{leader.name}</h3>
                          <p className="text-sm text-red-600 font-medium">{leader.role}</p>
                          {leader.title && <p className="text-sm text-gray-600">{leader.title}</p>}
                          {leader.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{leader.bio}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditLeader(leader)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLeader(leader.id)}
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
