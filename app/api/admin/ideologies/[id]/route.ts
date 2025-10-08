import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await sql`
      DELETE FROM ideologies 
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Ideology deleted successfully" })
  } catch (error) {
    console.error("Error deleting ideology:", error)
    return NextResponse.json({ error: "Failed to delete ideology" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { title, content, status } = await request.json()

    const result = await sql`
      UPDATE ideologies SET
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Ideology not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, ideology: result[0] })
  } catch (error) {
    console.error("Error updating ideology:", error)
    return NextResponse.json({ error: "Failed to update ideology" }, { status: 500 })
  }
}
