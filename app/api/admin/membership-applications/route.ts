import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const applications = await sql`
      SELECT id, first_name, last_name, email, phone, address, occupation, motivation, status, application_id, created_at, updated_at
      FROM membership_applications 
      ORDER BY created_at DESC
    `
    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching membership applications:", error)
    return NextResponse.json({ error: "Failed to fetch membership applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, address, occupation, motivation, application_id } = body

    const result = await sql`
      INSERT INTO membership_applications (first_name, last_name, email, phone, address, occupation, motivation, application_id, status, created_at, updated_at)
      VALUES (${first_name}, ${last_name}, ${email}, ${phone}, ${address || null}, ${occupation || null}, ${motivation || null}, ${application_id || null}, 'pending', NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating membership application:", error)
    return NextResponse.json({ error: "Failed to create membership application" }, { status: 500 })
  }
}
