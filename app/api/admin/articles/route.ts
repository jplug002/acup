import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, content, excerpt, author_id, category, tags, featured_image, status, published_at, created_at, updated_at
      FROM articles 
      ORDER BY created_at DESC
    `
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, author_id, category, tags, featured_image, status } = body

    const result = await sql`
      INSERT INTO articles (title, content, excerpt, author_id, category, tags, featured_image, status, created_at, updated_at)
      VALUES (${title}, ${content}, ${excerpt || null}, ${author_id || null}, ${category || null}, ${tags || []}, ${featured_image || null}, ${status || "draft"}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
