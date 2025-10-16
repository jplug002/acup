import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const events = await sql`
      SELECT id, title, description, location, event_date, status, created_at, updated_at
      FROM events 
      WHERE status IN ('ACTIVE', 'UPCOMING')
      ORDER BY event_date ASC
    `

    console.log("[v0] Events API - Found events:", events.length)
    console.log("[v0] Events API - Events data:", events)

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching public events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
