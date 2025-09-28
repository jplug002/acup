import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const downloads = await sql`
      SELECT * FROM downloads 
      ORDER BY created_at DESC
    `

    return NextResponse.json(downloads)
  } catch (error) {
    console.error("Error fetching downloads:", error)
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, file_url, file_name, file_size, file_type, category, status } = body

    const result = await sql`
      INSERT INTO downloads (title, description, file_url, file_name, file_size, file_type, category, status)
      VALUES (${title}, ${description}, ${file_url}, ${file_name}, ${file_size}, ${file_type}, ${category || "ideology"}, ${status || "published"})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating download:", error)
    return NextResponse.json({ error: "Failed to create download" }, { status: 500 })
  }
}
