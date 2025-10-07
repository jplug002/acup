import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
