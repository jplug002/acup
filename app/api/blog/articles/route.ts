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
        ba.id,
        ba.title,
        ba.slug,
        ba.excerpt,
        ba.featured_image,
        ba.published_at,
        ba.views_count,
        ba.likes_count,
        u.first_name || ' ' || u.last_name as author_name,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', bc.id,
              'name', bc.name,
              'slug', bc.slug,
              'color', bc.color
            )
          ) FILTER (WHERE bc.id IS NOT NULL), 
          '[]'
        ) as categories
      FROM blog_articles ba
      LEFT JOIN users u ON ba.author_id = u.id
      LEFT JOIN article_categories ac ON ba.id = ac.article_id
      LEFT JOIN blog_categories bc ON ac.category_id = bc.id
      WHERE ba.status = 'published'
    `

    const params: any[] = []
    let paramIndex = 1

    if (category) {
      query += ` AND bc.slug = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (search) {
      query += ` AND (ba.title ILIKE $${paramIndex} OR ba.content ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += `
      GROUP BY ba.id, u.first_name, u.last_name
      ORDER BY ba.published_at DESC
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
