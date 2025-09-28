"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, User, Eye, Heart, MessageCircle, Share2 } from "lucide-react"

interface BlogArticle {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  author_name: string
  published_at: string
  views_count: number
  likes_count: number
  categories: Array<{
    id: number
    name: string
    slug: string
    color: string
  }>
}

interface Comment {
  id: number
  content: string
  user_name: string
  created_at: string
  status: string
}

export default function BlogArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string)
      fetchComments(params.slug as string)
    }
  }, [params.slug])

  const fetchArticle = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/articles/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data.article)
      } else {
        router.push("/blog")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      router.push("/blog")
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/articles/${slug}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleLike = async () => {
    if (!article) return

    try {
      const response = await fetch(`/api/blog/articles/${article.slug}/like`, {
        method: "POST",
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setArticle({
          ...article,
          likes_count: isLiked ? article.likes_count - 1 : article.likes_count + 1,
        })
      }
    } catch (error) {
      console.error("Error liking article:", error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!article || !newComment.trim()) return

    try {
      const response = await fetch(`/api/blog/articles/${article.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment("")
        fetchComments(article.slug)
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article not found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {article.featured_image && (
            <div className="relative h-64 md:h-96">
              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  style={{ backgroundColor: category.color + "20", color: category.color }}
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.views_count} views</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Action Buttons */}
            <div className="flex items-center gap-4 py-6 border-t border-b">
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {article.likes_count} Likes
              </Button>

              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button type="submit" disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-red-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{comment.user_name}</span>
                    <span className="text-gray-500 text-sm">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
