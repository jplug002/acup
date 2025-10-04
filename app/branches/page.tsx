import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"
export const revalidate = 0

const sql = neon(process.env.DATABASE_URL!)

interface Branch {
  id: number
  name: string
  location: string
  country: string
  contact_info: string
  status: string
  created_at: string
}

interface ContactInfo {
  email?: string
  phone?: string
  description?: string
}

async function getBranches(): Promise<Branch[]> {
  try {
    const branches = await sql`
      SELECT id, name, location, country, contact_info, status, created_at
      FROM branches 
      WHERE status = 'ACTIVE'
      ORDER BY name ASC
    `
    return branches as Branch[]
  } catch (error) {
    console.error("Error fetching branches:", error)
    return []
  }
}

function parseContactInfo(contactInfoStr: string): ContactInfo {
  try {
    return JSON.parse(contactInfoStr)
  } catch {
    return {}
  }
}

export default async function BranchesPage() {
  const adminBranches = await getBranches()

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "establishing":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Branches</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            ACUP presence across Africa - connecting communities and building democratic foundations continent-wide
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Continental Network</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Our branches span across Africa, each working to advance democratic values and promote unity while
                addressing local community needs and fostering grassroots engagement.
              </p>
            </div>

            {adminBranches.length > 0 ? (
              <div className="mb-20">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Active Branches</h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Connect with our established branches across the continent
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {adminBranches.map((branch) => {
                    const contactInfo = parseContactInfo(branch.contact_info)

                    return (
                      <Card
                        key={branch.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={getStatusColor(branch.status)}>{branch.status || "Active"}</Badge>
                            {/* Removed country flag */}
                          </div>
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {branch.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">{branch.country}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {/* Location */}
                            {branch.location && (
                              <div className="flex items-start text-sm text-gray-600">
                                <span className="mr-2 text-blue-600">📍</span>
                                <span>{branch.location}</span>
                              </div>
                            )}

                            {/* Email */}
                            {contactInfo.email && (
                              <div className="flex items-start text-sm text-gray-600">
                                <span className="mr-2 text-blue-600">📧</span>
                                <a
                                  href={`mailto:${contactInfo.email}`}
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors break-all"
                                >
                                  {contactInfo.email}
                                </a>
                              </div>
                            )}

                            {/* Phone */}
                            {contactInfo.phone && (
                              <div className="flex items-start text-sm text-gray-600">
                                <span className="mr-2 text-blue-600">📞</span>
                                <a
                                  href={`tel:${contactInfo.phone}`}
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  {contactInfo.phone}
                                </a>
                              </div>
                            )}

                            {/* Description */}
                            {contactInfo.description && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-600 italic leading-relaxed">
                                  {contactInfo.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 mb-20">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Branches Available</h3>
                <p className="text-gray-600">We are expanding across Africa. Check back soon for branch locations.</p>
              </div>
            )}

            {/* ACUP Across Africa section */}
            <Card className="border border-gray-200 mb-20">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                  <span className="text-4xl">🌍</span>
                  ACUP Across Africa
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Democratic foundations connecting communities across the African continent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: "Ghana", image: "/ghana.jpg" },
                    { name: "South Africa", image: "/south africa.jpg" },
                    { name: "Guinea", image: "/guinea.jpg" },
                    { name: "Côte d'Ivoire", image: "/cotedevoir.jpg" },
                  ].map((country, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={country.image || "/placeholder.svg"}
                          alt={`ACUP in ${country.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-center text-gray-800">{country.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-20 bg-gradient-to-r from-blue-600 to-red-500 text-white">
              <CardContent className="text-center py-12">
                <h3 className="text-4xl font-bold mb-4">Join the Movement</h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                  Be part of building Africa's democratic future. Engage with our ideologies and help shape progressive
                  policies
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    <Link href="ideology">Explore All Ideologies</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold bg-transparent"
                  >
                    <Link href="register">Join ACUP Today</Link>
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
