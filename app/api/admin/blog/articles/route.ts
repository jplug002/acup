import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
    const session = await getServerSession(authOptions)

    console.log("[v0] Session data:", session)

    if (!session || !session.user) {
      console.log("[v0] No session found - user not authenticated")
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    const { title, slug, content, excerpt, featured_image, status } = await request.json()

    console.log("[v0] Creating article with data:", { title, slug, status, authorId: session.user.id })

    if (!title || !content) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    const authorId = Number.parseInt(session.user.id)

    console.log("[v0] Using author ID:", authorId)

    const userCheck = await sql`SELECT id FROM users WHERE id = ${authorId}`

    if (userCheck.length === 0) {
      console.log("[v0] User not found in database:", authorId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const publishedAt = status === "published" ? new Date().toISOString() : null

    console.log("[v0] Inserting article into database...")

    const result = await sql(
      `INSERT INTO blog_articles 
       (title, slug, content, excerpt, featured_image, author_id, status, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [title, finalSlug, content, excerpt || null, featured_image || null, authorId, status, publishedAt],
    )

    console.log("[v0] Article created successfully:", result[0].id)

    return NextResponse.json({
      success: true,
      article: { id: result[0].id, slug: finalSlug },
    })
  } catch (error: any) {
    console.error("[v0] Error creating article:", error)
    console.error("[v0] Error details:", error.message)
    console.error("[v0] Error stack:", error.stack)

    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error.message,
        hint: "Check console logs for more details",
      },
      { status: 500 },
    )
  }
}
