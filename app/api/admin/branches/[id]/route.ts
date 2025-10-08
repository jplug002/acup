import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await sql`
      DELETE FROM branches 
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Branch deleted successfully" })
  } catch (error) {
    console.error("Error deleting branch:", error)
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, location, country, contact_info, status } = await request.json()

    const result = await sql`
      UPDATE branches SET
        name = COALESCE(${name}, name),
        location = COALESCE(${location}, location),
        country = COALESCE(${country}, country),
        contact_info = COALESCE(${contact_info}, contact_info),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, branch: result[0] })
  } catch (error) {
    console.error("Error updating branch:", error)
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 })
  }
}
