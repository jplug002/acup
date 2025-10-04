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
      LEFT JOIN users u ON a.author_id = u.id
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

    try {
      console.log("[v0] Checking if articles table exists...")
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'articles'
        );
      `
      console.log("[v0] Articles table exists:", tableCheck[0].exists)

      if (!tableCheck[0].exists) {
        return NextResponse.json(
          {
            error: "Articles table does not exist",
            hint: "Please run the migration scripts: 01-backup-articles.sql through 05-seed-sample-data.sql",
          },
          { status: 500 },
        )
      }

      console.log("[v0] Checking articles table structure...")
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'articles'
        ORDER BY ordinal_position;
      `
      console.log("[v0] Articles table columns:", columns)
    } catch (checkError: any) {
      console.error("[v0] Error checking table:", checkError.message)
    }

    const authorId = author_id || 1

    console.log("[v0] Using author ID:", authorId)

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100) // Limit length

    console.log("[v0] Generated slug:", slug)

    const publishedAt = status === "published" ? new Date().toISOString() : null

    console.log("[v0] Preparing to insert article with params:", {
      title,
      slug,
      contentLength: content.length,
      excerpt: excerpt?.substring(0, 50) + "...",
      featured_image: featured_image || "none",
      category: category || "none",
      tags: tags || [],
      authorId,
      status,
      publishedAt,
    })

    const result = await sql`
      INSERT INTO articles 
      (title, slug, content, excerpt, featured_image, author_id, status, published_at, category, tags) 
      VALUES (
        ${title},
        ${slug},
        ${content}, 
        ${excerpt || null}, 
        ${featured_image || null}, 
        ${authorId}, 
        ${status || "draft"}, 
        ${publishedAt}, 
        ${category || null}, 
        ${tags || []}
      ) 
      RETURNING id, title, slug, status
    `

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
    console.error("[v0] Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))

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
    } else if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      errorMessage = "Articles table does not exist"
      errorHint = "Please run the migration scripts to create the articles table"
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
