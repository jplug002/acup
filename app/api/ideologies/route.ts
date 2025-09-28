import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const ideologies = await sql`
      SELECT id, title, content, status, created_at, updated_at
      FROM ideologies 
      WHERE status = 'ACTIVE'
      ORDER BY created_at DESC
    `

    return NextResponse.json(ideologies)
  } catch (error) {
    console.error("Error fetching public ideologies:", error)
    return NextResponse.json({ error: "Failed to fetch ideologies" }, { status: 500 })
  }
}
