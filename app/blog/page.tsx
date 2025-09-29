"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, Eye, Heart } from "lucide-react"

interface BlogArticle {
  id: number
  title: string
  slug: string
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

interface BlogCategory {
  id: number
  name: string
  slug: string
  color: string
}

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [selectedCategory, searchQuery])

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/blog/articles?${params}`)
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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/blog/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ACUP Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay informed with the latest news, insights, and perspectives on African politics and Pan-Africanism
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => setSelectedCategory("")}
              className="whitespace-nowrap"
            >
              All Articles
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.slug)}
                className="text-sm"
                style={{
                  backgroundColor: selectedCategory === category.slug ? category.color : undefined,
                  borderColor: category.color,
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery || selectedCategory ? (
              <>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">No blog posts yet</h3>
                <p className="text-gray-500 mb-6">Check back soon for news and updates from ACUP</p>
                <Image 
                  src="/placeholder.svg" 
                  alt="No blogs yet" 
                  width={200} 
                  height={200} 
                  className="mx-auto opacity-50"
                />
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                {article.featured_image && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={article.featured_image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
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

                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{article.likes_count}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">Read More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
