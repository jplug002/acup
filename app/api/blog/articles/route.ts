import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.published_at,
        a.views_count,
        a.likes_count,
        u.first_name || ' ' || u.last_name as author_name,
        a.category
      FROM articles a
      LEFT JOIN users u ON a.author_id::text = u.id::text
      WHERE a.status = 'published'
    `

    const params: any[] = []
    let paramIndex = 1

    if (category) {
      query += ` AND a.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.content ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += `
      ORDER BY a.published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const articles = await sql(query, params)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
