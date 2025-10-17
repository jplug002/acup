"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Camera, User } from "lucide-react"
import MembershipCard from "@/components/MembershipCard" // Import MembershipCard component

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  city?: string
  occupation?: string
  education?: string
  interests?: string
  bio?: string
  profile_picture?: string
  date_of_birth?: string
  gender?: string
  address?: string
  emergency_contact?: string
  political_experience?: string
  languages_spoken?: string
  social_media?: string
}

interface MembershipInfo {
  id: string
  status: string
  membership_type: string
  membership_number: string
  application_date: string
  approval_date?: string
  registration_fee_paid?: boolean
  branch_assigned?: string
  sponsor_name?: string
  membership_duration?: string
}

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  status: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get("welcome") === "true"
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showBioAlert, setShowBioAlert] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    occupation: "",
    education: "",
    interests: "",
    bio: "",
    profile_picture: "",
    date_of_birth: "",
    gender: "",
    address: "",
    emergency_contact: "",
    political_experience: "",
    languages_spoken: "",
    social_media: "",
  })
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfo | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
    if (session?.user?.id) {
      loadUserData()
      loadEvents()
    }
  }, [status, session, router])

  const loadUserData = async () => {
    try {
      setLoading(true)

      const profileResponse = await fetch(`/api/profile`)
      if (profileResponse.ok) {
        const { profile } = await profileResponse.json()

        const userRegistrationDate = profile.created_at || new Date().toISOString()

        // Map database fields to component state
        setProfileData({
          id: profile.id?.toString() || "",
          name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          email: profile.email || "",
          phone: profile.phone || "",
          country: profile.country || "",
          city: profile.city || "",
          occupation: profile.occupation || "",
          education: profile.education_level || "",
          interests: Array.isArray(profile.interests) ? profile.interests.join(", ") : profile.interests || "",
          bio: profile.bio || "",
          profile_picture: profile.profile_picture || profile.image || "",
          date_of_birth: profile.date_of_birth || "",
          gender: profile.gender || "",
          address: profile.address || "",
          emergency_contact:
            profile.emergency_contact_name && profile.emergency_contact_phone
              ? `${profile.emergency_contact_name} (${profile.emergency_contact_phone})`
              : profile.emergency_contact_name || profile.emergency_contact_phone || "",
          political_experience: profile.political_experience || "",
          languages_spoken: Array.isArray(profile.languages_spoken)
            ? profile.languages_spoken.join(", ")
            : profile.languages_spoken || "",
          social_media: profile.social_media_links
            ? Object.entries(profile.social_media_links)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : "",
        })

        setMembershipInfo({
          id: profile.id?.toString() || "",
          status: profile.membership_status || "active",
          membership_type: profile.membership_type || "regular",
          membership_number: profile.membership_number || `ACUP-${String(profile.id).padStart(6, "0")}`,
          application_date: userRegistrationDate,
          approval_date: profile.joined_date || userRegistrationDate,
          registration_fee_paid: profile.membership_status === "approved",
          branch_assigned: profile.branch_preference || profile.country,
          sponsor_name: profile.sponsor_name,
          membership_duration: "Annual",
        })

        if (isWelcome && !profile.bio) {
          setShowBioAlert(true)
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updateData = {
        bio: profileData.bio,
        profile_picture: profileData.profile_picture,
        date_of_birth: profileData.date_of_birth,
        gender: profileData.gender,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        occupation: profileData.occupation,
        education_level: profileData.education,
        political_experience: profileData.political_experience,
        languages_spoken: profileData.languages_spoken
          ? profileData.languages_spoken.split(",").map((s) => s.trim())
          : [],
        interests: profileData.interests ? profileData.interests.split(",").map((s) => s.trim()) : [],
        emergency_contact_name: profileData.emergency_contact.split("(")[0]?.trim() || "",
        emergency_contact_phone: profileData.emergency_contact.match(/$$([^)]+)$$/)?.[1] || "",
        social_media_links: profileData.social_media
          ? Object.fromEntries(
              profileData.social_media.split(",").map((item) => {
                const [key, value] = item.split(":").map((s) => s.trim())
                return [key || "link", value || ""]
              }),
            )
          : {},
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setIsEditing(false)
        // Reload data to show updated information
        loadUserData()
      } else {
        console.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Vercel Blob
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileData({ ...profileData, profile_picture: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBioAlert && (
          <div className="mb-4 sm:mb-6 bg-blue-50 border-l-4 border-blue-600 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-900">Complete Your Profile</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Welcome to ACUP! Please complete your bio and profile information to get the most out of your
                  membership.
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => {
                      setIsEditing(true)
                      setShowBioAlert(false)
                      document.querySelector('[value="profile"]')?.scrollIntoView({ behavior: "smooth" })
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Complete Profile Now
                  </Button>
                  <Button
                    onClick={() => setShowBioAlert(false)}
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                <AvatarImage src={profileData.profile_picture || "/placeholder.svg"} alt={profileData.name} />
                <AvatarFallback className="bg-red-100 text-red-600 text-lg sm:text-xl">
                  {profileData.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") ||
                    session?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Welcome back, {profileData.name || session?.user?.name}
                </h1>
                <p className="mt-1 sm:mt-2 text-gray-600">
                  {membershipInfo?.membership_number && (
                    <span className="inline-flex items-center text-xs sm:text-sm">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Member #{membershipInfo.membership_number}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline" className="w-full sm:w-auto">
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Membership Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getMembershipStatusColor(membershipInfo?.status || "none")}>
                {membershipInfo?.status || "Active"}
              </Badge>
              {membershipInfo?.membership_number && (
                <p className="text-xs text-gray-500 mt-1">ID: {membershipInfo.membership_number}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Member Since</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {membershipInfo?.application_date
                  ? new Date(membershipInfo.application_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Membership Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
                {membershipInfo?.membership_type || "Member"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {membershipInfo?.branch_assigned || profileData.country || "Not Assigned"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 sm:py-2.5">
              Profile
            </TabsTrigger>
            <TabsTrigger value="membership" className="text-xs sm:text-sm py-2 sm:py-2.5">
              Membership Card
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm py-2 sm:py-2.5">
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                    <CardDescription className="text-sm text-blue-700">
                      Update your personal information and bio
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                      <AvatarImage src={profileData.profile_picture || "/placeholder.svg"} alt={profileData.name} />
                      <AvatarFallback className="bg-red-100 text-red-600 text-xl sm:text-2xl">
                        {profileData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="w-full sm:w-auto">
                        <Label htmlFor="profile-picture" className="cursor-pointer">
                          <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            <Camera className="h-4 w-4" />
                            <span className="text-sm sm:text-base">Change Photo</span>
                          </div>
                        </Label>
                        <Input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm sm:text-base">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your political interests, and your goals..."
                      value={profileData.bio || ""}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 min-h-[100px] text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm sm:text-base">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth" className="text-sm sm:text-base">
                        Date of Birth
                      </Label>
                      {!isEditing && profileData.date_of_birth ? (
                        <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md text-sm sm:text-base text-gray-900">
                          {new Date(profileData.date_of_birth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      ) : (
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={profileData.date_of_birth || ""}
                          onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1 text-sm sm:text-base"
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gender" className="text-sm sm:text-base">
                        Gender
                      </Label>
                      <Input
                        id="gender"
                        value={profileData.gender || ""}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                        placeholder="e.g., Male, Female, Other"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone || ""}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact" className="text-sm sm:text-base">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergency_contact"
                        value={profileData.emergency_contact || ""}
                        onChange={(e) => setProfileData({ ...profileData, emergency_contact: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                        placeholder="Name and phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="country" className="text-sm sm:text-base">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={profileData.country || ""}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-sm sm:text-base">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={profileData.city || ""}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm sm:text-base">
                      Full Address
                    </Label>
                    <Textarea
                      id="address"
                      value={profileData.address || ""}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 text-sm sm:text-base"
                      placeholder="Complete residential address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="occupation" className="text-sm sm:text-base">
                        Occupation
                      </Label>
                      <Input
                        id="occupation"
                        value={profileData.occupation || ""}
                        onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="education" className="text-sm sm:text-base">
                        Education
                      </Label>
                      <Input
                        id="education"
                        value={profileData.education || ""}
                        onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="political_experience" className="text-sm sm:text-base">
                        Political Experience
                      </Label>
                      <Textarea
                        id="political_experience"
                        value={profileData.political_experience || ""}
                        onChange={(e) => setProfileData({ ...profileData, political_experience: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                        placeholder="Previous political involvement, leadership roles, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="languages_spoken" className="text-sm sm:text-base">
                        Languages Spoken
                      </Label>
                      <Input
                        id="languages_spoken"
                        value={profileData.languages_spoken || ""}
                        onChange={(e) => setProfileData({ ...profileData, languages_spoken: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                        placeholder="e.g., English, French, Swahili"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="interests" className="text-sm sm:text-base">
                        Interests
                      </Label>
                      <Input
                        id="interests"
                        value={profileData.interests || ""}
                        onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_media" className="text-sm sm:text-base">
                        Social Media
                      </Label>
                      <Input
                        id="social_media"
                        value={profileData.social_media || ""}
                        onChange={(e) => setProfileData({ ...profileData, social_media: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1 text-sm sm:text-base"
                        placeholder="Twitter, LinkedIn, etc."
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-2">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Membership Card Details</CardTitle>
                <CardDescription className="text-sm text-blue-700">
                  Your ACUP membership card information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipInfo ? (
                    <>
                      <div className="mb-6">
                        <MembershipCard showActions={false} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Membership Status</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Current status of your membership</p>
                        </div>
                        <Badge className={getMembershipStatusColor(membershipInfo.status)}>
                          {membershipInfo.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Membership Number</h4>
                          <p className="text-xs sm:text-sm text-gray-600 break-all">
                            {membershipInfo.membership_number}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Application Date</h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(membershipInfo.application_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {membershipInfo.status === "approved" && (
                        <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                          <h3 className="font-medium text-red-900 text-sm sm:text-base">Digital Membership Card</h3>
                          <p className="text-xs sm:text-sm text-red-700 mb-3">Your digital membership card is ready</p>
                          <Link href="/dashboard/membership-card">
                            <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                              View Membership Card
                            </Button>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-gray-500 mb-4 text-sm sm:text-base">You haven't applied for membership yet.</p>
                      <Link href="/membership">
                        <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">Apply for Membership</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Upcoming Events</CardTitle>
                <CardDescription className="text-sm text-blue-700">
                  Events you can attend as an ACUP member
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                <span className="mr-2">📍</span>
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="mr-2">📅</span>
                                <span>
                                  {new Date(event.event_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="mr-2">🕐</span>
                                <span>
                                  {new Date(event.event_date).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-500 text-sm sm:text-base">No upcoming events at this time.</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      Check back later for new events and opportunities.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
