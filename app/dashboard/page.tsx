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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Camera, MapPin, Briefcase, Calendar, Phone, Mail, User } from "lucide-react"

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
    }
  }, [status, session, router])

  const loadUserData = async () => {
    try {
      setLoading(true)

      const profileResponse = await fetch(`/api/profile`)
      if (profileResponse.ok) {
        const { profile } = await profileResponse.json()

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

        // Set membership info if available
        if (profile.membership_type) {
          setMembershipInfo({
            id: profile.id?.toString() || "",
            status: profile.membership_status || "pending",
            membership_type: profile.membership_type || "regular",
            membership_number: profile.membership_number || `ACUP-${String(profile.id).padStart(6, "0")}`,
            application_date: profile.created_at || new Date().toISOString(),
            approval_date: profile.membership_status === "approved" ? profile.joined_date : undefined,
            registration_fee_paid: profile.membership_status === "approved",
            branch_assigned: profile.branch_preference || profile.country,
            sponsor_name: profile.sponsor_name,
            membership_duration: "Annual",
          })
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileData.profile_picture || "/placeholder.svg"} alt={profileData.name} />
                <AvatarFallback className="bg-red-100 text-red-600 text-xl">
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {profileData.name || session?.user?.name}
                </h1>
                <p className="mt-2 text-gray-600">
                  {membershipInfo?.membership_number && (
                    <span className="inline-flex items-center text-sm">
                      <User className="h-4 w-4 mr-1" />
                      Member #{membershipInfo.membership_number}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline" className="w-full sm:w-auto">
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-2xl font-bold text-gray-900 capitalize">{membershipInfo?.membership_type || "Member"}</p>
            </CardContent>
          </Card>

          {/* Branch Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-gray-900">
                {membershipInfo?.branch_assigned || profileData.country || "Not Assigned"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and bio</CardDescription>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Profile Picture Upload Section */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.profile_picture || "/placeholder.svg"} alt={profileData.name} />
                      <AvatarFallback className="bg-red-100 text-red-600 text-2xl">
                        {profileData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div>
                        <Label htmlFor="profile-picture" className="cursor-pointer">
                          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            <Camera className="h-4 w-4" />
                            <span>Change Photo</span>
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

                  {/* Bio Section */}
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your political interests, and your goals..."
                      value={profileData.bio || ""}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  {/* Basic Information */}
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
                    {/* Date of Birth and Gender */}
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={profileData.date_of_birth || ""}
                        onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={profileData.gender || ""}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="e.g., Male, Female, Other"
                      />
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
                      <Label htmlFor="emergency_contact">Emergency Contact</Label>
                      <Input
                        id="emergency_contact"
                        value={profileData.emergency_contact || ""}
                        onChange={(e) => setProfileData({ ...profileData, emergency_contact: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="Name and phone number"
                      />
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  {/* Full Address Field */}
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address || ""}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Complete residential address"
                    />
                  </div>

                  {/* Professional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  {/* Political Experience and Languages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="political_experience">Political Experience</Label>
                      <Textarea
                        id="political_experience"
                        value={profileData.political_experience || ""}
                        onChange={(e) => setProfileData({ ...profileData, political_experience: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="Previous political involvement, leadership roles, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="languages_spoken">Languages Spoken</Label>
                      <Input
                        id="languages_spoken"
                        value={profileData.languages_spoken || ""}
                        onChange={(e) => setProfileData({ ...profileData, languages_spoken: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="e.g., English, French, Swahili"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="social_media">Social Media</Label>
                      <Input
                        id="social_media"
                        value={profileData.social_media || ""}
                        onChange={(e) => setProfileData({ ...profileData, social_media: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="Twitter, LinkedIn, etc."
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
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
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h3 className="font-medium text-red-900">Digital Membership Card</h3>
                          <p className="text-sm text-red-700 mb-3">Your digital membership card is ready</p>
                          <Link href="/dashboard/membership-card">
                            <Button className="bg-red-600 hover:bg-red-700">View Membership Card</Button>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't applied for membership yet.</p>
                      <Link href="/membership">
                        <Button className="bg-red-600 hover:bg-red-700">Apply for Membership</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registration Details Tab */}
          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
                <CardDescription>Complete information about your ACUP membership registration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {membershipInfo ? (
                    <>
                      {/* Registration Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-blue-900">Application Date</h4>
                              <p className="text-sm text-blue-700">
                                {new Date(membershipInfo.application_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          {membershipInfo.approval_date && (
                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600" />
                              <div>
                                <h4 className="font-medium text-green-900">Approval Date</h4>
                                <p className="text-sm text-green-700">
                                  {new Date(membershipInfo.approval_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <User className="h-5 w-5 text-gray-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">Membership Number</h4>
                              <p className="text-sm text-gray-700 font-mono">{membershipInfo.membership_number}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-red-600" />
                            <div>
                              <h4 className="font-medium text-red-900">Branch Assignment</h4>
                              <p className="text-sm text-red-700">
                                {membershipInfo.branch_assigned || profileData.country || "Pending Assignment"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                            <Briefcase className="h-5 w-5 text-yellow-600" />
                            <div>
                              <h4 className="font-medium text-yellow-900">Membership Type</h4>
                              <p className="text-sm text-yellow-700 capitalize">{membershipInfo.membership_type}</p>
                            </div>
                          </div>

                          {membershipInfo.sponsor_name && (
                            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                              <User className="h-5 w-5 text-purple-600" />
                              <div>
                                <h4 className="font-medium text-purple-900">Sponsored By</h4>
                                <p className="text-sm text-purple-700">{membershipInfo.sponsor_name}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Registration Fee</h4>
                            <p className="text-sm text-gray-600">Membership registration payment status</p>
                          </div>
                          <Badge
                            className={
                              membershipInfo.registration_fee_paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {membershipInfo.registration_fee_paid ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>

                      {/* Contact Information Summary */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information on File</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{profileData.email}</span>
                          </div>
                          {profileData.phone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{profileData.phone}</span>
                            </div>
                          )}
                          {profileData.country && (
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {profileData.city}, {profileData.country}
                              </span>
                            </div>
                          )}
                          {profileData.occupation && (
                            <div className="flex items-center space-x-3">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{profileData.occupation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No registration information available.</p>
                      <Link href="/membership">
                        <Button className="bg-red-600 hover:bg-red-700">Apply for Membership</Button>
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
