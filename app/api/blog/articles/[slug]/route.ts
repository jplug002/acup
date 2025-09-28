import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Get article with categories
    const articleQuery = `
      SELECT 
        ba.id,
        ba.title,
        ba.slug,
        ba.content,
        ba.excerpt,
        ba.featured_image,
        ba.published_at,
        ba.views_count,
        ba.likes_count,
        u.first_name || ' ' || u.last_name as author_name,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', bc.id,
              'name', bc.name,
              'slug', bc.slug,
              'color', bc.color
            )
          ) FILTER (WHERE bc.id IS NOT NULL), 
          '[]'
        ) as categories
      FROM blog_articles ba
      LEFT JOIN users u ON ba.author_id = u.id
      LEFT JOIN article_categories ac ON ba.id = ac.article_id
      LEFT JOIN blog_categories bc ON ac.category_id = bc.id
      WHERE ba.slug = $1 AND ba.status = 'published'
      GROUP BY ba.id, u.first_name, u.last_name
    `

    const articles = await sql(articleQuery, [slug])

    if (articles.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const article = articles[0]

    // Increment view count
    await sql("UPDATE blog_articles SET views_count = views_count + 1 WHERE id = $1", [article.id])

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
