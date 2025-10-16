import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await sql`
      DELETE FROM events 
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { title, description, event_date, location, status } = await request.json()

    const result = await sql`
      UPDATE events SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        event_date = COALESCE(${event_date}, event_date),
        location = COALESCE(${location}, location),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, event: result[0] })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}
