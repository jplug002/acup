import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Starting to fetch articles...")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let results

    if (category && search) {
      // Both category and search filters
      results = await sql`
        SELECT 
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          a.featured_image,
          a.published_at,
          a.views_count,
          a.likes_count,
          a.category,
          COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
          AND LOWER(a.category) = LOWER(${category})
          AND (a.title ILIKE ${`%${search}%`} OR a.content ILIKE ${`%${search}%`})
        ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (category) {
      // Only category filter
      results = await sql`
        SELECT 
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          a.featured_image,
          a.published_at,
          a.views_count,
          a.likes_count,
          a.category,
          COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
          AND LOWER(a.category) = LOWER(${category})
        ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search) {
      // Only search filter
      results = await sql`
        SELECT 
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          a.featured_image,
          a.published_at,
          a.views_count,
          a.likes_count,
          a.category,
          COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
          AND (a.title ILIKE ${`%${search}%`} OR a.content ILIKE ${`%${search}%`})
        ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      // No filters
      results = await sql`
        SELECT 
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          a.featured_image,
          a.published_at,
          a.views_count,
          a.likes_count,
          a.category,
          COALESCE(u.first_name || ' ' || u.last_name, 'ACUP Admin') as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    console.log("[v0] Found articles:", results.length)

    const articles = results.map((row: any) => {
      const categories = []
      if (row.category) {
        // Generate a simple slug from the category name
        const slug = row.category
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")

        // Assign colors based on category name for consistency
        const colorMap: { [key: string]: string } = {
          politics: "#3B82F6",
          news: "#10B981",
          opinion: "#F59E0B",
          analysis: "#8B5CF6",
          events: "#EF4444",
          default: "#6B7280",
        }
        const color = colorMap[slug] || colorMap.default

        categories.push({
          id: 0, // No ID since we're not using blog_categories table
          name: row.category,
          slug: slug,
          color: color,
        })
      }

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        featured_image: row.featured_image,
        published_at: row.published_at,
        views_count: row.views_count || 0,
        likes_count: row.likes_count || 0,
        author_name: row.author_name,
        categories: categories,
      }
    })

    console.log("[v0] Returning articles:", articles.length)
    return NextResponse.json({ articles })
  } catch (error) {
    console.error("[v0] Error fetching articles:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
