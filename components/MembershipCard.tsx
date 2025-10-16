"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface MembershipCardProps {
  showActions?: boolean
}

interface UserProfile {
  first_name: string
  last_name: string
  email: string
  country: string
  gender: string
  date_of_birth: string
  profile_picture?: string
  created_at: string
  id: number
  membership_number?: string // Added membership_number field
}

export default function MembershipCard({ showActions = true }: MembershipCardProps) {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      loadProfile()
    }
  }, [session])

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const { profile: profileData } = await response.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    // TODO: Implement card download as PDF/image
    console.log("Download membership card")
  }

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Share membership card")
  }

  if (!session?.user) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
          <CardContent className="p-4 sm:p-8">
            <p className="text-center text-gray-600 text-sm sm:text-base">Loading membership card...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const membershipId = profile?.membership_number || "N/A"
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : session.user.name?.toUpperCase() || "MEMBER"
  const country = profile?.country?.toUpperCase() || "N/A"
  const gender = profile?.gender?.toUpperCase() || "N/A"
  const issueDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 border-2 sm:border-4 border-black shadow-xl sm:shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-white px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b sm:border-b-2 border-black">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-16 sm:h-16 relative flex-shrink-0">
                <Image
                  src="/acup-logo.jpg"
                  alt="ACUP Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-lg text-blue-900 leading-tight">
                  AFRICAN CONTINENTAL UNITY PARTY
                </h3>
                <p className="text-blue-700 text-[10px] sm:text-sm font-semibold">ACUP MEMBERSHIP CARD</p>
              </div>
            </div>
          </div>

          <div
            className="px-4 sm:px-8 py-4 sm:py-6 relative"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.3) 10px,
                rgba(255, 255, 255, 0.3) 11px
              )`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 overflow-hidden bg-white p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {profile?.profile_picture ? (
                      <Image
                        src={profile.profile_picture || "/placeholder.svg"}
                        alt={fullName}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-500">
                          {fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2 sm:space-y-3 w-full text-center sm:text-left">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Full Name</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900 break-words">{fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Country of Origin</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{country}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Issue Date</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{issueDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Gender</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{gender}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">ACUP Membership ID</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-900 tracking-wider break-all">{membershipId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            Download Card
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent text-sm sm:text-base"
          >
            <Share2 className="w-4 h-4" />
            Share Card
          </Button>
        </div>
      )}
    </div>
  )
}
