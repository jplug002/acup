"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

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
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    featured_image: "",
    status: "draft",
  })

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/admin/blog/articles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error("Error deleting article:", error)
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
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-red-600 hover:text-red-700 font-medium transition-colors">
              ← Back to Admin
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Blog Management</h1>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Articles</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">{articles.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Published</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {articles.filter((a) => a.status === "published").length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Drafts</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {articles.filter((a) => a.status === "draft").length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {articles.reduce((sum, a) => sum + (a.views_count || 0), 0)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Create New Article</h2>
            <p className="text-gray-600 mb-6">Add a new blog article</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Enter article title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    placeholder="e.g., Politics, News"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content *</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Enter article content"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                    placeholder="Comma-separated tags"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Featured Image URL</label>
                  <input
                    type="text"
                    value={newArticle.featured_image}
                    onChange={(e) => setNewArticle({ ...newArticle, featured_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newArticle.status}
                  onChange={(e) => setNewArticle({ ...newArticle, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <button
                onClick={handleCreateArticle}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Create Article
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Articles</h2>
            {loading ? (
              <p>Loading articles...</p>
            ) : articles.length === 0 ? (
              <p className="text-gray-500">No articles found.</p>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      <p className="text-sm text-gray-500">/{article.slug}</p>
                      <div className="flex items-center gap-3 mt-2">
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
                        <span className="text-sm text-gray-500">
                          {article.published_at ? formatDate(article.published_at) : "Not published"}
                        </span>
                        <span className="text-sm text-gray-500">👁 {article.views_count || 0}</span>
                        <span className="text-sm text-gray-500">❤️ {article.likes_count || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
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
      </main>
    </div>
  )
}
