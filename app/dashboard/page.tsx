"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signOut } from "next-auth/react"
import Link from "next/link"

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
}

interface MembershipInfo {
  id: string
  status: string
  membership_type: string
  membership_number: string
  application_date: string
  approval_date?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
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
  })
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfo | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
    if (session?.user?.id) {
      loadUserData()
    }
  }, [status, session, router])

  const loadUserData = async () => {
    try {
      setLoading(true)

      // Load user profile
      const profileResponse = await fetch(`/api/user/profile`)
      if (profileResponse.ok) {
        const profile = await profileResponse.json()
        setProfileData(profile)
      }

      // Load membership info
      const membershipResponse = await fetch(`/api/user/membership`)
      if (membershipResponse.ok) {
        const membership = await membershipResponse.json()
        setMembershipInfo(membership)
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        setIsEditing(false)
        // Optionally show success message
      } else {
        console.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profileData.name || session.user.name}
              </h1>
              <p className="mt-2 text-gray-600">Manage your ACUP membership and profile</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline" className="w-full sm:w-auto">
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Membership Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getMembershipStatusColor(membershipInfo?.status || "none")}>
                {membershipInfo?.status || "No Application"}
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
              <p className="text-2xl font-bold text-gray-900">
                {membershipInfo?.approval_date
                  ? new Date(membershipInfo.approval_date).getFullYear()
                  : membershipInfo?.application_date
                    ? new Date(membershipInfo.application_date).getFullYear()
                    : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Membership Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 capitalize">{membershipInfo?.membership_type || "None"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} disabled={true} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone || ""}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profileData.country || ""}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city || ""}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={profileData.occupation || ""}
                        onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={profileData.education || ""}
                      onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <Input
                      id="interests"
                      value={profileData.interests || ""}
                      onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
                <CardTitle>Membership Details</CardTitle>
                <CardDescription>Your ACUP membership information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipInfo ? (
                    <>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Membership Status</h3>
                          <p className="text-sm text-gray-600">Current status of your membership</p>
                        </div>
                        <Badge className={getMembershipStatusColor(membershipInfo.status)}>
                          {membershipInfo.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">Membership Number</h4>
                          <p className="text-sm text-gray-600">{membershipInfo.membership_number}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">Application Date</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(membershipInfo.application_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {membershipInfo.status === "approved" && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-medium text-blue-900">Digital Membership Card</h3>
                          <p className="text-sm text-blue-700 mb-3">Your digital membership card is ready</p>
                          <Link href="/dashboard/membership-card">
                            <Button className="bg-blue-600 hover:bg-blue-700">View Membership Card</Button>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't applied for membership yet.</p>
                      <Link href="/membership">
                        <Button className="bg-blue-600 hover:bg-blue-700">Apply for Membership</Button>
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
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you can attend as an ACUP member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming events at this time.</p>
                  <p className="text-sm text-gray-400 mt-2">Check back later for new events and opportunities.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
