"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import MembershipCard from "@/components/MembershipCard"
import Link from "next/link"

export default function MembershipCardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your membership card...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Membership Card</h1>
          <p className="mt-2 text-gray-600">Your official ACUP digital membership card</p>
        </div>

        {/* Membership Card */}
        <div className="flex justify-center">
          <MembershipCard />
        </div>

        {/* Additional Info */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Your Membership Card</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This digital membership card serves as your official proof of membership with the African Cup Political
                Party (ACUP).
              </p>
              <p>
                You can download this card as a PDF or share it digitally. Keep your membership information up to date
                in your profile settings.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Member Benefits</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Access to exclusive ACUP events and meetings</li>
                  <li>• Voting rights in party decisions</li>
                  <li>• Leadership development opportunities</li>
                  <li>• Networking with fellow African leaders</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
