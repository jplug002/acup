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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      title,
      description,
      event_date,
      end_date,
      location,
      event_type,
      max_attendees,
      registration_required,
      status,
    } = body

    const result = await sql`
      UPDATE events SET
        title = ${title},
        description = ${description},
        event_date = ${event_date},
        end_date = ${end_date},
        location = ${location},
        event_type = ${event_type},
        max_attendees = ${max_attendees},
        registration_required = ${registration_required},
        status = ${status || "active"},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}
