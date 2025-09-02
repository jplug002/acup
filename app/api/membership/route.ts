import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { membershipQueries, userQueries } from "@/lib/db"

interface MembershipData {
  fullName: string
  phoneNumber: string
  region: string
  country: string
  profession: string
  gender: string
  volunteerStatus: boolean
  motivation: string
  userId?: string
  email?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const data: MembershipData = await request.json()

    // Validate required fields
    const requiredFields = ["fullName", "phoneNumber", "region", "country", "profession", "gender", "motivation"]
    const missingFields = requiredFields.filter((field) => !data[field as keyof MembershipData])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Missing required fields", missingFields }, { status: 400 })
    }

    let userId = session?.user?.id
    let userEmail = session?.user?.email

    if (!userId && data.email) {
      // Check if user exists by email
      const existingUser = await userQueries.findByEmail(data.email)
      if (existingUser) {
        userId = existingUser.id
        userEmail = existingUser.email
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          error: "User account required. Please register or login first.",
        },
        { status: 400 },
      )
    }

    const existingMembership = await membershipQueries.findByUserId(userId)
    if (existingMembership) {
      return NextResponse.json(
        {
          error: "You already have a membership application.",
          membershipId: existingMembership.membership_number,
          status: existingMembership.status,
        },
        { status: 400 },
      )
    }

    await userQueries.update(userId, {
      name: data.fullName,
      phone: data.phoneNumber,
      country: data.country,
      occupation: data.profession,
      interests: data.motivation,
    })

    const membership = await membershipQueries.create({
      user_id: userId,
      membership_type: "standard",
      notes: `Application details: Region: ${data.region}, Gender: ${data.gender}, Volunteer: ${data.volunteerStatus ? "Yes" : "No"}, Motivation: ${data.motivation}`,
    })

    const response = {
      success: true,
      message: "Membership application submitted successfully! Check your dashboard for updates.",
      membershipId: membership.membership_number,
      status: membership.status,
      redirectTo: "/dashboard",
      userLinked: true,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error processing membership application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
