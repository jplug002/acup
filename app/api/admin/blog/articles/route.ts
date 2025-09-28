import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    let query = `
      SELECT 
        ba.id,
        ba.title,
        ba.slug,
        ba.status,
        ba.published_at,
        ba.created_at,
        ba.views_count,
        ba.likes_count,
        u.first_name || ' ' || u.last_name as author_name
      FROM blog_articles ba
      LEFT JOIN users u ON ba.author_id = u.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (search) {
      query += ` AND ba.title ILIKE $${paramIndex}`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      query += ` AND ba.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY ba.created_at DESC`

    const articles = await sql(query, params)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching admin articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, content, excerpt, featured_image, status } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    // For now, we'll use a default author ID (1)
    const authorId = 1

    const publishedAt = status === "published" ? new Date().toISOString() : null

    const result = await sql(
      `INSERT INTO blog_articles 
       (title, slug, content, excerpt, featured_image, author_id, status, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [title, finalSlug, content, excerpt, featured_image, authorId, status, publishedAt],
    )

    return NextResponse.json({
      success: true,
      article: { id: result[0].id, slug: finalSlug },
    })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
