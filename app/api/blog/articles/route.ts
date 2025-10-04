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
        COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name,
        a.category,
        bc.id as category_id,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.color as category_color
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN blog_categories bc ON LOWER(a.category) = LOWER(bc.slug) OR LOWER(a.category) = LOWER(bc.name)
      WHERE a.status = 'published'
    `

    const params: any[] = []
    let paramIndex = 1

    if (category) {
      query += ` AND (LOWER(a.category) = LOWER($${paramIndex}) OR LOWER(bc.slug) = LOWER($${paramIndex}))`
      params.push(category)
      paramIndex++
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.content ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += `
      ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    console.log("[v0] Fetching articles with query:", query)
    console.log("[v0] Query params:", params)

    const results = await sql(query, params)

    console.log("[v0] Found articles:", results.length)

    const articles = results.map((row: any) => {
      // Create category object from blog_categories if matched, otherwise from article category string
      const categories = []
      if (row.category) {
        categories.push({
          id: row.category_id || 0,
          name: row.category_name || row.category,
          slug: row.category_slug || row.category.toLowerCase().replace(/\s+/g, "-"),
          color: row.category_color || "#3B82F6", // Default blue color
        })
      }

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        featured_image: row.featured_image,
        published_at: row.published_at,
        views_count: row.views_count,
        likes_count: row.likes_count,
        author_name: row.author_name,
        categories: categories,
      }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("[v0] Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
