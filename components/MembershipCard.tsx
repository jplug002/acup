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

  const generateMembershipId = () => {
    if (!profile) return "N/A"

    const countryCode = (profile.country || "XX").substring(0, 2).toUpperCase()
    const firstThreeChars = (profile.first_name || "XXX").substring(0, 3).toUpperCase()

    const registrationDate = new Date(profile.created_at)
    const month = String(registrationDate.getMonth() + 1).padStart(2, "0")
    const year = registrationDate.getFullYear()

    const birthYear = profile.date_of_birth ? new Date(profile.date_of_birth).getFullYear().toString().slice(-2) : "00"

    const gender = (profile.gender || "U").charAt(0).toUpperCase()
    const userId = profile.id || 1

    return `${countryCode}${firstThreeChars}${month}${year}${birthYear}${gender}${userId}`
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
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
          <CardContent className="p-8">
            <p className="text-center text-gray-600">Loading membership card...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const membershipId = generateMembershipId()
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : session.user.name?.toUpperCase() || "MEMBER"
  const country = profile?.country?.toUpperCase() || "N/A"
  const gender = profile?.gender?.toUpperCase() || "N/A"
  const issueDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 border-4 border-black shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header with ACUP branding */}
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b-2 border-black">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 relative">
                <Image
                  src="/acup-logo.jpg"
                  alt="ACUP Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-blue-900 leading-tight">AFRICAN CONTINENTAL UNITY PARTY</h3>
                <p className="text-blue-700 text-sm font-semibold">ACUP MEMBERSHIP CARD</p>
              </div>
            </div>
          </div>

          {/* Card body with diagonal line pattern background */}
          <div
            className="px-8 py-6 relative"
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
            <div className="flex items-start space-x-6">
              {/* Profile photo with red circular border */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-red-600 overflow-hidden bg-white p-1">
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
                        <span className="text-3xl font-bold text-gray-500">
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

              {/* Member information */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase">Country of Origin</p>
                    <p className="text-base font-bold text-gray-900">{country}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase">Issue Date</p>
                    <p className="text-base font-bold text-gray-900">{issueDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase">Gender</p>
                  <p className="text-base font-bold text-gray-900">{gender}</p>
                </div>
              </div>
            </div>

            {/* Membership ID */}
            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-gray-700 uppercase mb-1">ACUP Membership ID</p>
              <p className="text-2xl font-bold text-blue-900 tracking-wider">{membershipId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Download className="w-4 h-4" />
            Download Card
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Share2 className="w-4 h-4" />
            Share Card
          </Button>
        </div>
      )}

      {/* Membership ID format explanation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Membership ID Format</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• COUNTRYCODE (2 letters)</p>
          <p>• FIRST 3 CHARACTERS OF FIRST NAME</p>
          <p>• MONTH (2 digits)</p>
          <p>• YEAR OF REGISTRATION (4 digits)</p>
          <p>• YEAR OF BIRTH (2 digits)</p>
          <p>• GENDER (M/F)</p>
          <p>• USERID</p>
          <p className="mt-2 font-mono text-xs bg-white p-2 rounded border">
            Example: If userID=1, then {membershipId}
          </p>
        </div>
      </div>
    </div>
  )
}
