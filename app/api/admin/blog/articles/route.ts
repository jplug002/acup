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
        a.id,
        a.title,
        a.status,
        a.published_at,
        a.created_at,
        a.excerpt,
        a.category,
        COALESCE(u.first_name || ' ' || u.last_name, 'Unknown Author') as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id::text = u.id::text
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (search) {
      query += ` AND a.title ILIKE $${paramIndex}`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      query += ` AND a.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY a.created_at DESC`

    const articles = await sql(query, params)

    return NextResponse.json({ articles })
  } catch (error: any) {
    console.error("[v0] Error fetching admin articles:", error)
    console.error("[v0] Error message:", error.message)
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting article creation...")

    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { title, content, excerpt, featured_image, status, category, tags, author_id } = body

    if (!title || !content) {
      console.log("[v0] Missing required fields - title or content")
      return NextResponse.json(
        {
          error: "Title and content are required",
          received: { title: !!title, content: !!content },
        },
        { status: 400 },
      )
    }

    // Use provided author_id or default to a system user
    const authorId = author_id || "00000000-0000-0000-0000-000000000000"

    console.log("[v0] Using author ID:", authorId)

    const publishedAt = status === "published" ? new Date().toISOString() : null

    console.log("[v0] Inserting article into database with params:", {
      title,
      contentLength: content.length,
      excerpt: excerpt?.substring(0, 50) + "...",
      featured_image: featured_image || "none",
      category: category || "none",
      tags: tags || [],
      authorId,
      status,
      publishedAt,
    })

    const result = await sql(
      `INSERT INTO articles 
       (title, content, excerpt, featured_image, author_id, status, published_at, category, tags) 
       VALUES ($1, $2, $3, $4, $5::uuid, $6, $7, $8, $9) 
       RETURNING id, title, status`,
      [
        title,
        content,
        excerpt || null,
        featured_image || null,
        authorId,
        status || "draft",
        publishedAt,
        category || null,
        tags || [],
      ],
    )

    console.log("[v0] Article created successfully:", result[0])

    return NextResponse.json({
      success: true,
      article: result[0],
      message: `Article "${result[0].title}" ${status === "published" ? "published" : "saved as draft"} successfully`,
    })
  } catch (error: any) {
    console.error("[v0] Error creating article:", error)
    console.error("[v0] Error name:", error.name)
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error stack:", error.stack)

    let errorMessage = "Failed to create article"
    let errorHint = "Check the console logs for more details"

    if (error.message?.includes("duplicate key")) {
      errorMessage = "An article with this slug already exists"
      errorHint = "Try using a different title or slug"
    } else if (error.message?.includes("foreign key")) {
      errorMessage = "Database relationship error"
      errorHint = "The author_id may not exist in the users table"
    } else if (error.message?.includes("null value")) {
      errorMessage = "Missing required database field"
      errorHint = "Some required information is missing"
    } else if (error.message?.includes("column") && error.message?.includes("does not exist")) {
      errorMessage = "Database schema mismatch"
      errorHint = "The database schema needs to be updated. Run the migration scripts."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        hint: errorHint,
        type: error.name,
      },
      { status: 500 },
    )
  }
}
