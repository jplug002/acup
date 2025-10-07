"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, User, Eye, Heart, MessageCircle, Share2, LinkIcon, Check } from "lucide-react"

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
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string)
      fetchComments(params.slug as string)
      if (session?.user) {
        checkLikeStatus(params.slug as string)
      }
    }
  }, [params.slug, session])

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

  const checkLikeStatus = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/articles/${slug}/like`)
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLike = async () => {
    if (!article) return

    if (!session?.user) {
      alert("Please log in to like articles")
      router.push("/auth/login")
      return
    }

    try {
      const response = await fetch(`/api/blog/articles/${article.slug}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setArticle({
          ...article,
          likes_count: data.liked ? article.likes_count + 1 : article.likes_count - 1,
        })
      } else if (response.status === 401) {
        alert("Please log in to like articles")
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error liking article:", error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!article || !newComment.trim()) return

    if (!session?.user) {
      alert("Please log in to comment")
      router.push("/auth/login")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/blog/articles/${article.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment("")
        fetchComments(article.slug)
      } else if (response.status === 401) {
        alert("Please log in to comment")
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    const shareTitle = article?.title || "Check out this article"
    const shareText = article?.excerpt || ""

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log("Share cancelled or failed")
      }
    } else {
      setShowShareMenu(!showShareMenu)
    }
  }

  const copyToClipboard = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowShareMenu(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareOnSocialMedia = (platform: string) => {
    const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""
    const shareTitle = encodeURIComponent(article?.title || "")
    const shareText = encodeURIComponent(article?.excerpt || "")

    let url = ""
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
        break
      case "whatsapp":
        url = `https://wa.me/?text=${shareTitle}%20${shareUrl}`
        break
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400")
      setShowShareMenu(false)
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
            <div className="flex items-center gap-4 py-6 border-t border-b relative">
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className="flex items-center gap-2"
                disabled={status === "loading"}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {article.likes_count} {article.likes_count === 1 ? "Like" : "Likes"}
              </Button>

              {/* Share Button with Dropdown Menu */}
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>

                {/* Share Menu Dropdown */}
                {showShareMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 min-w-[200px]">
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Link copied!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-4 w-4" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => shareOnSocialMedia("twitter")}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>Share on Twitter</span>
                    </button>

                    <button
                      onClick={() => shareOnSocialMedia("facebook")}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Share on Facebook</span>
                    </button>

                    <button
                      onClick={() => shareOnSocialMedia("linkedin")}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>Share on LinkedIn</span>
                    </button>

                    <button
                      onClick={() => shareOnSocialMedia("whatsapp")}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>
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

            {session?.user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-4"
                  rows={4}
                  disabled={isSubmitting}
                />
                <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-600 mb-3">Please log in to comment on this article</p>
                <Link href="/auth/login">
                  <Button>Log In</Button>
                </Link>
              </div>
            )}

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
