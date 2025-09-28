import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, content, excerpt, author_id, category, tags, featured_image, status, published_at, created_at, updated_at
      FROM articles 
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC
    `
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
