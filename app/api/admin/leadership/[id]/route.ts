import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await sql`DELETE FROM leadership_profiles WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting leadership profile:", error)
    return NextResponse.json({ error: "Failed to delete leadership profile" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { name, role, title, bio, photo_url, display_order, status } = await request.json()

    const result = await sql`
      UPDATE leadership_profiles 
      SET 
        name = COALESCE(${name}, name),
        role = COALESCE(${role}, role),
        title = COALESCE(${title}, title),
        bio = COALESCE(${bio}, bio),
        photo_url = COALESCE(${photo_url}, photo_url),
        display_order = COALESCE(${display_order}, display_order),
        status = COALESCE(${status}, status)
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ success: true, leader: result[0] })
  } catch (error) {
    console.error("Error updating leadership profile:", error)
    return NextResponse.json({ error: "Failed to update leadership profile" }, { status: 500 })
  }
}
