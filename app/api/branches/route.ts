import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const branches = await sql`
      SELECT id, name, location, country, contact_info, status, created_at, updated_at
      FROM branches 
      WHERE status = 'ACTIVE'
      ORDER BY name ASC
    `

    return NextResponse.json(branches)
  } catch (error) {
    console.error("Error fetching public branches:", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}
