import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const events = await sql`
      SELECT * FROM events 
      ORDER BY created_at DESC
    `
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Received event data:", body)

    const { title, description, date, location } = body

    if (!title || !description || !date) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Title, description, and date are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO events (title, description, event_date, location, status, created_at, updated_at)
      VALUES (${title}, ${description}, ${new Date(date)}, ${location || ""}, 'UPCOMING', NOW(), NOW())
      RETURNING *
    `

    console.log("[v0] Event created successfully:", result[0])
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Detailed error creating event:", {
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: "Failed to create event",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
