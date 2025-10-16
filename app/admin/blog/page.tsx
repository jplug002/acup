"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"
import Image from "next/image"

interface BlogArticle {
  id: string
  title: string
  slug: string
  status: string
  author_name: string
  published_at: string | null
  created_at: string
  views_count: number
  likes_count: number
}

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    featured_image: "",
    status: "draft",
  })
  const [editingArticle, setEditingArticle] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/blog/articles")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = document.createElement("img")
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Failed to get canvas context"))
            return
          }

          const maxSize = 800
          let width = img.width
          let height = img.height

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          } else if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8)
          resolve(compressedBase64)
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    try {
      const compressedImage = await compressImage(file)
      setNewArticle({ ...newArticle, featured_image: compressedImage })
      setImagePreview(compressedImage)
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Failed to process image")
    }
  }

  const handleCreateArticle = async () => {
    try {
      if (!newArticle.title.trim() || !newArticle.content.trim()) {
        alert("Please fill in title and content fields")
        return
      }

      const response = await fetch("/api/admin/blog/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newArticle.title,
          content: newArticle.content,
          excerpt: newArticle.excerpt,
          category: newArticle.category,
          tags: newArticle.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          featured_image: newArticle.featured_image,
          status: newArticle.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        alert(`Failed to create article: ${errorData.error || "Unknown error"}`)
        return
      }

      alert("Article created successfully!")
      setImagePreview("")
      setNewArticle({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        featured_image: "",
        status: "draft",
      })
      fetchArticles()
    } catch (error) {
      console.error("Error creating article:", error)
      alert("Failed to create article. Please check the console for details.")
    }
  }

  const handleUpdateArticle = async (id: string) => {
    try {
      if (!newArticle.title.trim() || !newArticle.content.trim()) {
        alert("Please fill in title and content fields")
        return
      }

      const response = await fetch(`/api/admin/blog/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newArticle.title,
          content: newArticle.content,
          excerpt: newArticle.excerpt,
          category: newArticle.category,
          tags: newArticle.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          featured_image: newArticle.featured_image,
          status: newArticle.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to update article: ${errorData.error || "Unknown error"}`)
        return
      }

      alert("Article updated successfully!")
      setEditingArticle(null)
      setImagePreview("")
      setNewArticle({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        featured_image: "",
        status: "draft",
      })
      fetchArticles()
    } catch (error) {
      console.error("Error updating article:", error)
      alert("Failed to update article")
    }
  }

  const startEditArticle = async (article: BlogArticle) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/blog/articles/${article.id}`)

      if (!response.ok) {
        alert("Failed to load article details")
        return
      }

      const data = await response.json()
      const fullArticle = data.article

      setEditingArticle(article.id)
      setNewArticle({
        title: fullArticle.title || "",
        content: fullArticle.content || "",
        excerpt: fullArticle.excerpt || "",
        category: fullArticle.category || "",
        tags: Array.isArray(fullArticle.tags) ? fullArticle.tags.join(", ") : "",
        featured_image: fullArticle.featured_image || "",
        status: fullArticle.status || "draft",
      })

      if (fullArticle.featured_image) {
        setImagePreview(fullArticle.featured_image)
      }
    } catch (error) {
      console.error("Error loading article:", error)
      alert("Failed to load article details")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditingArticle(null)
    setImagePreview("")
    setNewArticle({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      featured_image: "",
      status: "draft",
    })
  }

  const handleDelete = async (id: string) => {
    const article = articles.find((a) => a.id === id)
    const confirmMessage = article
      ? `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
      : "Are you sure you want to delete this article? This action cannot be undone."

    if (!confirm(confirmMessage)) return

    try {
      console.log("[v0] Deleting article:", id)

      const response = await fetch(`/api/admin/blog/articles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Delete failed:", errorData)
        alert(`Failed to delete article: ${errorData.error || "Unknown error"}`)
        return
      }

      const result = await response.json()
      console.log("[v0] Article deleted successfully:", result)

      alert("Article deleted successfully!")

      fetchArticles()
    } catch (error) {
      console.error("[v0] Error deleting article:", error)
      alert("Failed to delete article. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/admin"
              className="text-red-600 hover:text-red-700 font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              ← Back
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">Blog Management</h1>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Articles</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{articles.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Published</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
              {articles.filter((a) => a.status === "published").length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Drafts</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
              {articles.filter((a) => a.status === "draft").length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Views</h3>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
              {articles.reduce((sum, a) => sum + (a.views_count || 0), 0)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {editingArticle ? "Edit Article" : "Create New Article"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {editingArticle ? "Update the article details" : "Add a new blog article"}
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Enter article title"
                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    placeholder="e.g., Politics, News"
                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Excerpt</label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="Brief summary of the article"
                  rows={2}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content *</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Enter article content"
                  rows={6}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                    placeholder="Comma-separated tags"
                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                  />
                  <p className="text-xs text-gray-500">Max size: 5MB. Image will be compressed automatically.</p>
                </div>
              </div>
              {imagePreview && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Image Preview</label>
                  <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newArticle.status}
                  onChange={(e) => setNewArticle({ ...newArticle, status: e.target.value })}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (editingArticle ? handleUpdateArticle(editingArticle) : handleCreateArticle())}
                  disabled={loading}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Loading..." : editingArticle ? "Update Article" : "Create Article"}
                </button>
                {editingArticle && (
                  <button
                    onClick={cancelEdit}
                    className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Existing Articles</h2>
            {loading ? (
              <p className="text-sm sm:text-base">Loading articles...</p>
            ) : articles.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500">No articles found.</p>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border border-gray-200 rounded-lg gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{article.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">/{article.slug}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            article.status === "published"
                              ? "bg-green-100 text-green-800"
                              : article.status === "draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {article.published_at ? formatDate(article.published_at) : "Not published"}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">👁 {article.views_count || 0}</span>
                        <span className="text-xs sm:text-sm text-gray-500">❤️ {article.likes_count || 0}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => startEditArticle(article)}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="flex-1 sm:flex-none px-3 py-2 text-sm text-center border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
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
      </main>
    </div>
  )
}
