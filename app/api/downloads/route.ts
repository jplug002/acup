import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const downloads = await sql`
      SELECT * FROM downloads 
      WHERE status = 'published' 
      ORDER BY created_at DESC
    `

    return NextResponse.json(downloads)
  } catch (error) {
    console.error("Error fetching downloads:", error)
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 })
  }
}
