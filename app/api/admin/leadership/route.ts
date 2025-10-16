import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const leadership = await sql`
      SELECT * FROM leadership_profiles 
      WHERE status = 'active'
      ORDER BY display_order ASC, created_at DESC
    `

    return NextResponse.json(leadership)
  } catch (error) {
    console.error("Error fetching leadership:", error)
    return NextResponse.json({ error: "Failed to fetch leadership profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, role, title, bio, photo_url } = await request.json()

    console.log("[v0] Creating leadership profile:", {
      name,
      role,
      title,
      bio,
      photoUrlLength: photo_url?.length,
    })

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 })
    }

    // Get the highest display_order and add 1
    const maxOrder = await sql`
      SELECT COALESCE(MAX(display_order), 0) as max_order 
      FROM leadership_profiles
    `
    const nextOrder = (maxOrder[0]?.max_order || 0) + 1

    const result = await sql`
      INSERT INTO leadership_profiles 
      (name, role, title, bio, photo_url, display_order, status) 
      VALUES (${name}, ${role}, ${title || null}, ${bio || null}, ${photo_url || null}, ${nextOrder}, 'active') 
      RETURNING id
    `

    console.log("[v0] Leadership profile created successfully:", result[0].id)

    return NextResponse.json({
      success: true,
      leader: { id: result[0].id },
    })
  } catch (error) {
    console.error("[v0] Error creating leadership profile:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: "Failed to create leadership profile" }, { status: 500 })
  }
}
