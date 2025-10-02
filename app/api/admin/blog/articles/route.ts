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
        a.id,
        a.title,
        a.slug,
        a.status,
        a.published_at,
        a.created_at,
        a.views_count,
        a.likes_count,
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

    const { title, slug, content, excerpt, featured_image, status, category, tags } = body

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

    const session = await getServerSession(authOptions)
    console.log("[v0] Session check:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    })

    if (!session || !session.user) {
      console.log("[v0] Authentication failed - no valid session")
      return NextResponse.json(
        {
          error: "Unauthorized - Please log in to create articles",
          hint: "Make sure you're logged in with a valid account",
        },
        { status: 401 },
      )
    }

    const finalSlug =
      slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    console.log("[v0] Generated slug:", finalSlug)

    const existingSlug = await sql`SELECT id FROM articles WHERE slug = ${finalSlug}`
    if (existingSlug.length > 0) {
      console.log("[v0] Slug already exists:", finalSlug)
      return NextResponse.json(
        {
          error: "An article with this URL slug already exists",
          slug: finalSlug,
          hint: "Please use a different title or manually set a unique slug",
        },
        { status: 409 },
      )
    }

    const authorId = session.user.id

    console.log("[v0] Using author ID:", authorId)

    const userCheck = await sql`SELECT id, first_name, last_name, email FROM users WHERE id::text = ${authorId}`

    if (userCheck.length === 0) {
      console.log("[v0] User not found in database:", authorId)
      return NextResponse.json(
        {
          error: "User account not found in database",
          userId: authorId,
          hint: "Your account may need to be set up. Please contact an administrator.",
        },
        { status: 404 },
      )
    }

    console.log("[v0] User verified:", {
      id: userCheck[0].id,
      name: `${userCheck[0].first_name} ${userCheck[0].last_name}`,
      email: userCheck[0].email,
    })

    const publishedAt = status === "published" ? new Date().toISOString() : null

    console.log("[v0] Inserting article into database with params:", {
      title,
      slug: finalSlug,
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
       (title, slug, content, excerpt, featured_image, author_id, status, published_at, category, tags) 
       VALUES ($1, $2, $3, $4, $5, $6::uuid, $7, $8, $9, $10) 
       RETURNING id, slug, title, status`,
      [
        title,
        finalSlug,
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
      errorHint = "Your user account may not be properly set up"
    } else if (error.message?.includes("null value")) {
      errorMessage = "Missing required database field"
      errorHint = "Some required information is missing"
    } else if (error.message?.includes("column") && error.message?.includes("does not exist")) {
      errorMessage = "Database schema mismatch"
      errorHint = "Run the migration script to add missing columns"
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
