"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ideologyQueries } from "@/lib/db"

interface Ideology {
  id: string
  title: string
  description: string
  category: string
  priority: number
  status: "active" | "draft" | "archived"
  created_at?: string
  updated_at?: string
}

export default function IdeologyManager() {
  const [ideologies, setIdeologies] = useState<Ideology[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIdeology, setEditingIdeology] = useState<Ideology | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: 0,
    status: "draft" as "active" | "draft" | "archived",
  })

  useEffect(() => {
    loadIdeologies()
  }, [])

  const loadIdeologies = async () => {
    try {
      setLoading(true)
      const data = await ideologyQueries.getAll()
      setIdeologies(data)
    } catch (error) {
      console.error("Failed to load ideologies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingIdeology) {
        // Update existing ideology
        await ideologyQueries.update(editingIdeology.id, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
        })
      } else {
        // Add new ideology
        await ideologyQueries.create({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
        })
      }

      // Reload ideologies from database
      await loadIdeologies()
      resetForm()
    } catch (error) {
      console.error("Failed to save ideology:", error)
      alert("Failed to save ideology. Please try again.")
    }
  }

  const handleEdit = (ideology: Ideology) => {
    setEditingIdeology(ideology)
    setFormData({
      title: ideology.title,
      description: ideology.description,
      category: ideology.category,
      priority: ideology.priority,
      status: ideology.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ideology?")) {
      try {
        await ideologyQueries.delete(id)
        await loadIdeologies()
      } catch (error) {
        console.error("Failed to delete ideology:", error)
        alert("Failed to delete ideology. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: 0,
      status: "draft",
    })
    setShowForm(false)
    setEditingIdeology(null)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "political":
        return "bg-blue-100 text-blue-800"
      case "economic":
        return "bg-green-100 text-green-800"
      case "social":
        return "bg-purple-100 text-purple-800"
      case "environmental":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "bg-red-100 text-red-800"
    if (priority >= 5) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading ideologies...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ideology Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Ideology
        </button>
      </div>

      {/* Ideology Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingIdeology ? "Edit Ideology" : "Add New Ideology"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ideology title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe the ideology in detail"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Political, Economic, Social"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "active" | "draft" | "archived" })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
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
                  {editingIdeology ? "Update Ideology" : "Add Ideology"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ideologies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideologies.map((ideology) => (
          <div
            key={ideology.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{ideology.title}</h3>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(ideology)} className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(ideology.id)} className="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ideology.description}</p>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(ideology.category)}`}
                >
                  {ideology.category}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ideology.priority)}`}
                >
                  Priority: {ideology.priority}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ideology.status)}`}
                >
                  {ideology.status}
                </span>
              </div>

              {ideology.created_at && (
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <div>Created: {new Date(ideology.created_at).toLocaleDateString()}</div>
                  {ideology.updated_at && <div>Updated: {new Date(ideology.updated_at).toLocaleDateString()}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {ideologies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No ideologies found</div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Ideology
          </button>
        </div>
      )}
    </div>
  )
}
