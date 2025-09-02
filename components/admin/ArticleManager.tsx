"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { articleQueries } from "@/lib/db"
import { useSession } from "next-auth/react"

interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  author_id: string
  author_name?: string
  category?: string
  status: "draft" | "published" | "archived"
  tags?: string[]
  featured_image?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}

export default function ArticleManager() {
  const { data: session } = useSession()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft" as "draft" | "published" | "archived",
    tags: "",
    featured_image: "",
  })

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const data = await articleQueries.getAll()
      setArticles(data)
    } catch (error) {
      console.error("Failed to load articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      alert("You must be logged in to create articles.")
      return
    }

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      if (editingArticle) {
        // Update existing article
        await articleQueries.update(editingArticle.id, {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          category: formData.category,
          status: formData.status,
          tags: tagsArray,
          featured_image: formData.featured_image,
        })
      } else {
        // Add new article
        await articleQueries.create({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          author_id: session.user.id,
          category: formData.category,
          status: formData.status,
          tags: tagsArray,
          featured_image: formData.featured_image,
        })
      }

      // Reload articles from database
      await loadArticles()
      resetForm()
    } catch (error) {
      console.error("Failed to save article:", error)
      alert("Failed to save article. Please try again.")
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      category: article.category || "",
      status: article.status,
      tags: article.tags?.join(", ") || "",
      featured_image: article.featured_image || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await articleQueries.delete(id)
        await loadArticles()
      } catch (error) {
        console.error("Failed to delete article:", error)
        alert("Failed to delete article. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      status: "draft",
      tags: "",
      featured_image: "",
    })
    setShowForm(false)
    setEditingArticle(null)
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800"

    switch (category.toLowerCase()) {
      case "news":
        return "bg-blue-100 text-blue-800"
      case "opinion":
        return "bg-purple-100 text-purple-800"
      case "analysis":
        return "bg-green-100 text-green-800"
      case "announcement":
        return "bg-orange-100 text-orange-800"
      case "press-release":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateReadTime = (content: string) => {
    return Math.ceil(content.split(" ").length / 200)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading articles...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Article Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Article
        </button>
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingArticle ? "Edit Article" : "Add New Article"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Brief summary of the article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={10}
                  placeholder="Write your article content here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., News, Opinion, Analysis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="politics, africa, unity"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "draft" | "published" | "archived" })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
                  {editingArticle ? "Update Article" : "Add Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                  {article.category && (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                  )}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}
                  >
                    {article.status}
                  </span>
                </div>
                {article.excerpt && <p className="text-gray-600 mb-3">{article.excerpt}</p>}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button onClick={() => handleEdit(article)} className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 pt-4 border-t">
              <div>
                <span className="font-medium">Author:</span> {article.author_name || "Unknown"}
              </div>
              <div>
                <span className="font-medium">Read Time:</span> {calculateReadTime(article.content)} min
              </div>
              <div>
                <span className="font-medium">Published:</span>{" "}
                {article.published_at ? new Date(article.published_at).toLocaleDateString() : "Not published"}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {article.updated_at ? new Date(article.updated_at).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No articles found</div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Write Your First Article
          </button>
        </div>
      )}
    </div>
  )
}
