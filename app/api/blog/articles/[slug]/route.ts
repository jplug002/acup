import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const articles = await sql`
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
        COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.slug = ${slug} AND a.status = 'published'
    `

    if (articles.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const article = articles[0]

    await sql`UPDATE articles SET views_count = views_count + 1 WHERE id = ${article.id}`

    const categoryColors: Record<string, string> = {
      Politics: "#3b82f6",
      "Pan-Africanism": "#10b981",
      Democracy: "#8b5cf6",
      News: "#ef4444",
      Analysis: "#f59e0b",
      Opinion: "#ec4899",
    }

    const categories = article.category
      ? [
          {
            id: 1,
            name: article.category,
            slug: article.category.toLowerCase().replace(/\s+/g, "-"),
            color: categoryColors[article.category] || "#6b7280",
          },
        ]
      : []

    return NextResponse.json({
      article: {
        ...article,
        categories,
      },
    })
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
