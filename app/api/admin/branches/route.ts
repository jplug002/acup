import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const branches = await sql`
      SELECT * FROM branches 
      ORDER BY created_at DESC
    `
    return NextResponse.json(branches)
  } catch (error) {
    console.error("Error fetching branches:", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Received branch data:", body)

    const { name, location, contact_email, contact_phone, description } = body

    if (!name || !location) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Name and location are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO branches (name, location, country, contact_info, status, created_at, updated_at)
      VALUES (
        ${name}, 
        ${location}, 
        'Unknown', 
        ${JSON.stringify({ email: contact_email, phone: contact_phone, description })}, 
        'ACTIVE', 
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    console.log("[v0] Branch created successfully:", result[0])
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Detailed error creating branch:", {
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: "Failed to create branch",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
