import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const memberships = await sql`
      SELECT id, user_id, membership_type, status, joined_date, notes, created_at, updated_at
      FROM memberships 
      ORDER BY created_at DESC
    `
    return NextResponse.json(memberships)
  } catch (error) {
    console.error("Error fetching memberships:", error)
    return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 })
  }
}
