import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface MembershipApplicationData {
  fullName: string
  phoneNumber: string
  region: string
  country: string
  profession: string
  gender: string
  volunteerStatus: boolean
  motivation: string
  dateOfBirth: string
  address: string
  city: string
  postalCode: string
  education: string
  experience: string
  skills: string
  languages: string
  emergencyContact: string
  emergencyPhone: string
  politicalExperience: string
  leadershipRoles: string
  communityInvolvement: string
  expectations: string
  email?: string
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: MembershipApplicationData = await request.json()

    console.log("[v0] Received membership application data:", data)

    // Validate required fields
    const requiredFields = ["fullName", "phoneNumber", "region", "country", "profession", "gender", "motivation"]
    const missingFields = requiredFields.filter((field) => !data[field as keyof MembershipApplicationData])

    if (missingFields.length > 0) {
      console.log("[v0] Missing required fields:", missingFields)
      return NextResponse.json({ error: "Missing required fields", missingFields }, { status: 400 })
    }

    const nameParts = data.fullName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const result = await sql`
      INSERT INTO membership_applications (
        application_id,
        first_name,
        last_name,
        phone,
        email,
        address,
        occupation,
        motivation,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${`APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`},
        ${firstName},
        ${lastName},
        ${data.phoneNumber},
        ${data.email || ""},
        ${`${data.address}, ${data.city}, ${data.region}, ${data.country} ${data.postalCode}`.trim()},
        ${data.profession},
        ${data.motivation},
        'pending',
        NOW(),
        NOW()
      ) RETURNING id, application_id
    `

    console.log("[v0] Successfully inserted membership application:", result[0])

    const response = {
      success: true,
      message:
        "Membership application submitted successfully! We will review your application and get back to you soon.",
      applicationId: result[0].application_id,
      status: "pending",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("[v0] Error processing membership application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const applications = await sql`
      SELECT 
        id,
        application_id,
        first_name,
        last_name,
        phone,
        email,
        address,
        occupation,
        motivation,
        status,
        created_at,
        updated_at
      FROM membership_applications 
      ORDER BY created_at DESC
    `

    return NextResponse.json(applications)
  } catch (error) {
    console.error("[v0] Error fetching membership applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
