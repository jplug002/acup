import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("[v0] Fetching article details for ID:", id)

    const result = await sql`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.content,
        a.excerpt,
        a.category,
        a.tags,
        a.featured_image,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at,
        a.views_count,
        a.likes_count,
        a.author_id,
        COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("[v0] Article found:", result[0].title)
    return NextResponse.json({ article: result[0] })
  } catch (error) {
    console.error("[v0] Error fetching article:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status } = await request.json()

    console.log("[v0] Updating article status:", { id, status })

    if (!["draft", "published", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const publishedAt = status === "published" ? new Date().toISOString() : null

    await sql`UPDATE articles SET status = ${status}, published_at = ${publishedAt} WHERE id = ${id}`

    console.log("[v0] Article status updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating article:", error)
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("[v0] Deleting article with ID:", id)

    const existingArticle = await sql`SELECT id, title FROM articles WHERE id = ${id}`

    if (existingArticle.length === 0) {
      console.log("[v0] Article not found:", id)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("[v0] Found article to delete:", existingArticle[0].title)

    await sql`DELETE FROM article_comments WHERE article_id = ${id}`
    await sql`DELETE FROM article_likes WHERE article_id = ${id}`

    await sql`DELETE FROM articles WHERE id = ${id}`

    console.log("[v0] Article deleted successfully")
    return NextResponse.json({
      success: true,
      message: "Article and related data deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting article:", error)
    return NextResponse.json(
      {
        error: "Failed to delete article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { title, content, excerpt, category, tags, featured_image, status } = await request.json()

    console.log("[v0] Updating article:", { id, title, status })

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100)

    const publishedAt = status === "published" ? new Date().toISOString() : null

    const result = await sql`
      UPDATE articles SET
        title = ${title},
        content = ${content},
        excerpt = ${excerpt || null},
        category = ${category || null},
        tags = ${tags || []},
        featured_image = ${featured_image || null},
        status = ${status || "draft"},
        slug = ${slug},
        published_at = ${publishedAt},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("[v0] Article updated successfully")
    return NextResponse.json({ success: true, article: result[0] })
  } catch (error) {
    console.error("[v0] Error updating article:", error)
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
