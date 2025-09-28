import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const ideologies = await sql`
      SELECT * FROM ideologies 
      ORDER BY created_at DESC
    `
    return NextResponse.json(ideologies)
  } catch (error) {
    console.error("Error fetching ideologies:", error)
    return NextResponse.json({ error: "Failed to fetch ideologies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Received ideology data:", body)

    const { title, content } = body

    if (!title || !content) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO ideologies (title, content, status, created_at, updated_at)
      VALUES (${title}, ${content}, 'ACTIVE', NOW(), NOW())
      RETURNING *
    `

    console.log("[v0] Ideology created successfully:", result[0])
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Detailed error creating ideology:", {
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: "Failed to create ideology",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
