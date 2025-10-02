import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const articleQuery = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.content,
        a.excerpt,
        a.featured_image,
        a.published_at,
        a.views_count,
        a.likes_count,
        a.category,
        a.tags,
        u.first_name || ' ' || u.last_name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id::text = u.id::text
      WHERE a.slug = $1 AND a.status = 'published'
    `

    const articles = await sql(articleQuery, [slug])

    if (articles.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const article = articles[0]

    // Increment view count
    await sql("UPDATE articles SET views_count = views_count + 1 WHERE id = $1", [article.id])

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
