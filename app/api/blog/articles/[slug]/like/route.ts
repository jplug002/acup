import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Get article ID
    const articleResult = await sql("SELECT id FROM blog_articles WHERE slug = $1", [slug])

    if (articleResult.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const articleId = articleResult[0].id
    // For now, we'll use a default user ID (1) since we don't have auth context
    const userId = 1

    // Check if user already liked this article
    const existingLike = await sql("SELECT id FROM article_likes WHERE article_id = $1 AND user_id = $2", [
      articleId,
      userId,
    ])

    if (existingLike.length > 0) {
      // Unlike
      await sql("DELETE FROM article_likes WHERE article_id = $1 AND user_id = $2", [articleId, userId])
      await sql("UPDATE blog_articles SET likes_count = likes_count - 1 WHERE id = $1", [articleId])
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await sql("INSERT INTO article_likes (article_id, user_id) VALUES ($1, $2)", [articleId, userId])
      await sql("UPDATE blog_articles SET likes_count = likes_count + 1 WHERE id = $1", [articleId])
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
