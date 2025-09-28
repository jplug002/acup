import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const commentsQuery = `
      SELECT 
        bc.id,
        bc.content,
        bc.created_at,
        u.first_name || ' ' || u.last_name as user_name
      FROM blog_comments bc
      JOIN blog_articles ba ON bc.article_id = ba.id
      JOIN users u ON bc.user_id = u.id
      WHERE ba.slug = $1 AND bc.status = 'approved'
      ORDER BY bc.created_at DESC
    `

    const comments = await sql(commentsQuery, [slug])

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Get article ID
    const articleResult = await sql("SELECT id FROM blog_articles WHERE slug = $1", [slug])

    if (articleResult.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // For now, we'll use a default user ID (1) since we don't have auth context
    // In a real app, you'd get this from the session
    const userId = 1

    await sql(
      `INSERT INTO blog_comments (article_id, user_id, content, status) 
       VALUES ($1, $2, $3, 'approved')`,
      [articleResult[0].id, userId, content.trim()],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
