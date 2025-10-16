import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, ArrowLeft, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Branch {
  id: number
  name: string
  location: string
  contact_email: string
  contact_phone: string
  description: string
  created_at: string
}

async function getBranch(id: string): Promise<Branch | null> {
  try {
    const response = await fetch("/api/branches", {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const branches = await response.json()
    return branches.find((branch: Branch) => branch.id.toString() === id) || null
  } catch (error) {
    console.error("Error fetching branch:", error)
    return null
  }
}

export default async function BranchDetailPage({ params }: { params: { id: string } }) {
  const branch = await getBranch(params.id)

  if (!branch) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-red-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/branches"
            className="inline-flex items-center text-red-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Branches
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{branch.name}</h1>
          <div className="flex items-center text-red-100">
            <MapPin size={20} className="mr-2" />
            {branch.location}
          </div>
        </div>
      </section>

      {/* Branch Details */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About This Branch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">{branch.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Our Mission</h4>
                      <p className="text-gray-600">
                        As part of the African Continental Unity Party, our {branch.location} branch is committed to
                        advancing African unity, promoting economic development, and fostering political cooperation
                        across the continent. We work locally to achieve continental goals.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What We Do</h4>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Organize community outreach programs</li>
                        <li>• Host educational workshops and seminars</li>
                        <li>• Facilitate political discussions and debates</li>
                        <li>• Support local economic development initiatives</li>
                        <li>• Connect with other ACUP branches across Africa</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Get Involved</h4>
                      <p className="text-gray-600">
                        We welcome new members and volunteers who share our vision for African unity. Whether you're
                        interested in political activism, community service, or educational initiatives, there's a place
                        for you in our branch.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 text-red-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-gray-600">{branch.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail size={20} className="mr-3 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a href={`mailto:${branch.contact_email}`} className="text-blue-600 hover:underline">
                        {branch.contact_email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone size={20} className="mr-3 text-green-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <a href={`tel:${branch.contact_phone}`} className="text-green-600 hover:underline">
                        {branch.contact_phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Users size={16} className="mr-2" />
                    Join This Branch
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail size={16} className="mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar size={16} className="mr-2" />
                    View Events
                  </Button>
                </CardContent>
              </Card>

              {/* Branch Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Branch Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Established</span>
                      <span className="font-medium">{new Date(branch.created_at).getFullYear()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region</span>
                      <span className="font-medium">{branch.location.split(",").pop()?.trim()}</span>
                    </div>
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
