import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Ideology {
  id: number
  title: string
  content: string
  category: string
  created_at: string
}

async function getIdeology(id: string): Promise<Ideology | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ideologies`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const ideologies = await response.json()
    return ideologies.find((ideology: Ideology) => ideology.id.toString() === id) || null
  } catch (error) {
    console.error("Error fetching ideology:", error)
    return null
  }
}

export default async function IdeologyDetailPage({ params }: { params: { id: string } }) {
  const ideology = await getIdeology(params.id)

  if (!ideology) {
    notFound()
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "political":
        return "bg-blue-100 text-blue-800"
      case "economic":
        return "bg-green-100 text-green-800"
      case "social":
        return "bg-purple-100 text-purple-800"
      case "cultural":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/ideology"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Ideologies
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{ideology.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(ideology.category)}>
              {ideology.category.charAt(0).toUpperCase() + ideology.category.slice(1)}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">Published {formatDate(ideology.created_at)}</Badge>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="pt-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ideology.content}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Topics */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Understanding This Ideology</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Core Principles</h4>
                      <p className="text-gray-600">
                        This {ideology.category} ideology represents one of ACUP's fundamental beliefs in building a
                        unified and prosperous Africa. It reflects our commitment to addressing the challenges and
                        opportunities facing our continent.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Practical Application</h4>
                      <p className="text-gray-600">
                        These principles guide our policy positions, community initiatives, and collaborative efforts
                        across African nations. They form the foundation of our approach to continental unity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share2 size={16} className="mr-2" />
                    Share Article
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <BookOpen size={16} className="mr-2" />
                    Save for Later
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Users size={16} className="mr-2" />
                    Discuss
                  </Button>
                </CardContent>
              </Card>

              {/* Category Information */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Category: {ideology.category.charAt(0).toUpperCase() + ideology.category.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Explore more {ideology.category} ideologies and principles that guide ACUP's vision for Africa.
                  </p>
                  <Link href="/ideology">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View All Ideologies
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle>Get Involved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Join the conversation about African unity and help shape our continent's future.
                  </p>
                  <div className="space-y-2">
                    <Link href="/membership">
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        Become a Member
                      </Button>
                    </Link>
                    <Link href="/branches">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Find Local Branch
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
