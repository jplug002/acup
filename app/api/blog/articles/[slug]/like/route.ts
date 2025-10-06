import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to like articles" }, { status: 401 })
    }

    const { slug } = params
    const userId = Number.parseInt(session.user.id)

    const articleResult = await sql`
      SELECT id FROM articles WHERE slug = ${slug}
    `

    if (articleResult.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const articleId = articleResult[0].id

    // Check if user already liked this article
    const existingLike = await sql`
      SELECT id FROM article_likes 
      WHERE article_id = ${articleId} AND user_id = ${userId}
    `

    if (existingLike.length > 0) {
      // Unlike
      await sql`
        DELETE FROM article_likes 
        WHERE article_id = ${articleId} AND user_id = ${userId}
      `
      await sql`
        UPDATE articles 
        SET likes_count = GREATEST(likes_count - 1, 0) 
        WHERE id = ${articleId}
      `
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await sql`
        INSERT INTO article_likes (article_id, user_id) 
        VALUES (${articleId}, ${userId})
      `
      await sql`
        UPDATE articles 
        SET likes_count = likes_count + 1 
        WHERE id = ${articleId}
      `
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("[v0] Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ liked: false })
    }

    const { slug } = params
    const userId = Number.parseInt(session.user.id)

    const articleResult = await sql`
      SELECT id FROM articles WHERE slug = ${slug}
    `

    if (articleResult.length === 0) {
      return NextResponse.json({ liked: false })
    }

    const articleId = articleResult[0].id

    const existingLike = await sql`
      SELECT id FROM article_likes 
      WHERE article_id = ${articleId} AND user_id = ${userId}
    `

    return NextResponse.json({ liked: existingLike.length > 0 })
  } catch (error) {
    console.error("[v0] Error checking like status:", error)
    return NextResponse.json({ liked: false })
  }
}
