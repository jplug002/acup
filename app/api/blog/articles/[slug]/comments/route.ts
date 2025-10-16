import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const comments = await sql`
      SELECT 
        ac.id,
        ac.content,
        ac.created_at,
        u.first_name || ' ' || u.last_name as user_name
      FROM article_comments ac
      JOIN articles a ON ac.article_id = a.id
      JOIN users u ON ac.user_id = u.id
      WHERE a.slug = ${slug} AND ac.status = 'approved'
      ORDER BY ac.created_at DESC
    `

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("[v0] Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to comment" }, { status: 401 })
    }

    const { slug } = params
    const { content } = await request.json()
    const userId = Number.parseInt(session.user.id)

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const articleResult = await sql`
      SELECT id FROM articles WHERE slug = ${slug}
    `

    if (articleResult.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const articleId = articleResult[0].id

    await sql`
      INSERT INTO article_comments (article_id, user_id, content, status) 
      VALUES (${articleId}, ${userId}, ${content.trim()}, 'approved')
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
