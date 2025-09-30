import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountryFlag } from "@/components/CountryFlag"

interface Branch {
  id: number
  name: string
  location: string
  country: string
  contact_info: string
  status: string
  created_at: string
}

async function getBranches(): Promise<Branch[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/branches`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching branches:", error)
    return []
  }
}

export default async function BranchesPage() {
  const adminBranches = await getBranches()

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "establishing":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getCountryFlag = (country: string) => {
    return <CountryFlag country={country} size={32} className="mx-auto" />
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

            {adminBranches.length > 0 && (
              <div className="mb-20">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Active Branches</h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Connect with our established branches across the continent
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {adminBranches.map((branch) => (
                    <Link key={branch.id} href={`/branches/${branch.id}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={getStatusColor(branch.status)}>{branch.status || "Active"}</Badge>
                            {getCountryFlag(branch.country)}
                          </div>
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {branch.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">{branch.country}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2 text-blue-600">📍</span>
                              <span>{branch.location}</span>
                            </div>
                            <div className="flex items-start text-sm text-gray-600">
                              <span className="mr-2 text-blue-600 mt-0.5">📞</span>
                              <span className="break-all">{branch.contact_info}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Unified "Our Branches Across Africa" section */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                  <span className="text-4xl">🌍</span>
                  Our Branches Across Africa
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Democratic foundations connecting communities across the African continent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <CountryFlag country="Ghana" size={48} />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">Ghana</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Accra Branch</CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <CountryFlag country="Nigeria" size={48} />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">Nigeria</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Lagos Branch</CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <CountryFlag country="South Africa" size={48} />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">South Africa</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Cape Town Branch</CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <CountryFlag country="Kenya" size={48} />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">Kenya</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Nairobi Branch</CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <CountryFlag country="Côte d'Ivoire" size={48} />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">Côte d'Ivoire</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Abidjan Branch</CardDescription>
                    </CardContent>
                  </Card>
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
