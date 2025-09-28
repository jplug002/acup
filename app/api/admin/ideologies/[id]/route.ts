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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, category, priority, status } = body

    const result = await sql`
      UPDATE ideologies SET
        title = ${title},
        description = ${description},
        category = ${category},
        priority = ${priority},
        status = ${status || "active"},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating ideology:", error)
    return NextResponse.json({ error: "Failed to delete ideology" }, { status: 500 })
  }
}
