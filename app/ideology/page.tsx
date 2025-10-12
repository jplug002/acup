import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { neon } from "@neondatabase/serverless"
import { DownloadIcon } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const sql = neon(process.env.DATABASE_URL!)

interface Ideology {
  id: number
  title: string
  content: string
  status: string
  created_at: string
}

interface IdeologyDownload {
  id: number
  ideology_id?: number
  title: string
  description: string
  file_url: string
  file_name: string
  file_type: string
  file_size: string
  category: string
  status: string
}

async function getIdeologies(): Promise<Ideology[]> {
  try {
    const ideologies = await sql`
      SELECT id, title, content, status, created_at
      FROM ideologies 
      WHERE status = 'ACTIVE'
      ORDER BY created_at DESC
    `
    return ideologies as Ideology[]
  } catch (error) {
    console.error("Error fetching ideologies:", error)
    return []
  }
}

async function getDownloads(): Promise<IdeologyDownload[]> {
  try {
    const downloads = await sql`
      SELECT id, ideology_id, title, description, file_url, file_name, file_type, file_size, category, status
      FROM downloads 
      WHERE status = 'published' AND ideology_id IS NOT NULL
      ORDER BY created_at DESC
    `
    return downloads as IdeologyDownload[]
  } catch (error) {
    console.error("Error fetching downloads:", error)
    return []
  }
}

export default async function IdeologyPage() {
  const adminIdeologies = await getIdeologies()
  const downloads = await getDownloads()

  const getTitleColor = (title: string, index: number) => {
    return index % 2 === 0 ? "bg-blue-600" : "bg-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getIdeologyDownload = (ideologyId: number) => {
    return downloads.find((download) => download.ideology_id === ideologyId)
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-balance">Our Ideology</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto font-light leading-relaxed">
            Building a unified Africa through democratic principles, progressive values, and inclusive governance
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {adminIdeologies.length > 0 ? (
              <div className="mb-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">Our Principles & Beliefs</h2>
                  <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
                    Explore the foundational ideologies that guide our mission to transform Africa through democratic
                    excellence
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {adminIdeologies.map((ideology, index) => {
                    const ideologyDownload = getIdeologyDownload(ideology.id)

                    return (
                      <Card
                        key={ideology.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 h-full overflow-hidden flex flex-col"
                      >
                        <div className={`${getTitleColor(ideology.title, index)} text-white px-6 py-4`}>
                          <h3 className="text-xl font-bold">{ideology.title}</h3>
                        </div>
                        <CardContent className="pt-6 flex-1 flex flex-col">
                          <CardDescription className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">
                            {ideology.content}
                          </CardDescription>

                          {ideologyDownload && (
                            <div className="mt-auto pt-4 border-t border-gray-200">
                              <a
                                href={ideologyDownload.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg group"
                              >
                                <div className="flex items-center gap-2">
                                  <DownloadIcon className="w-4 h-4" />
                                  <span className="font-semibold text-sm">Download Document</span>
                                </div>
                                <span className="text-xs opacity-90">
                                  {(Number(ideologyDownload.file_size) / 1024).toFixed(0)} KB
                                </span>
                              </a>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 mb-20">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Ideologies Available</h3>
                <p className="text-gray-600">Our ideological framework is being developed. Check back soon.</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-16 mb-20">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-blue-600 text-4xl">🎯</span>
                    Core Principles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Democratic Governance</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Transparent institutions and accountable leadership
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Pan-African Unity</h4>
                        <p className="text-gray-700 leading-relaxed">Continental cooperation and shared prosperity</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Economic Empowerment</h4>
                        <p className="text-gray-700 leading-relaxed">Sustainable development and inclusive growth</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Social Justice</h4>
                        <p className="text-gray-700 leading-relaxed">Equality, human rights, and dignity for all</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-red-600 text-4xl">❤️</span>
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      We envision a united Africa where democratic institutions thrive, economic opportunities are
                      accessible to all citizens, and cultural diversity is celebrated as our greatest strength and
                      source of innovation.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Through progressive policies, inclusive governance, and community-driven initiatives, we aim to
                      build sustainable societies that serve as models for democratic excellence and social progress
                      across the continent.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-4xl font-black text-gray-900 mb-4">Policy Pillars</CardTitle>
                <CardDescription className="text-lg text-gray-700 max-w-2xl mx-auto">
                  The fundamental areas where we focus our efforts to create lasting democratic change
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🏛️</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-4">Governance</CardTitle>
                      <CardDescription className="leading-relaxed text-gray-700">
                        Strengthening democratic institutions, promoting transparency, and ensuring accountable
                        leadership at all levels
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">💼</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-4">Economy</CardTitle>
                      <CardDescription className="leading-relaxed text-gray-700">
                        Creating sustainable economic opportunities, fostering innovation, and ensuring equitable
                        distribution of resources
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🤝</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-4">Unity</CardTitle>
                      <CardDescription className="leading-relaxed text-gray-700">
                        Fostering continental cooperation, cultural exchange, and building bridges across diverse
                        communities
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-20 bg-gradient-to-r from-blue-600 to-red-600 text-white">
              <CardContent className="text-center py-12">
                <h3 className="text-4xl font-black mb-4">Join the Movement</h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                  Be part of building Africa's democratic future. Engage with our ideologies and help shape progressive
                  policies
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold bg-transparent"
                  >
                    <Link href="/register">Join ACUP Today</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
