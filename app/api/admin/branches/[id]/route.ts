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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, address, city, country, contact_email, contact_phone, established_date, status } = body

    const result = await sql`
      UPDATE branches SET
        name = ${name},
        description = ${description},
        address = ${address},
        city = ${city},
        country = ${country},
        contact_email = ${contact_email},
        contact_phone = ${contact_phone},
        established_date = ${established_date},
        status = ${status || "active"},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating branch:", error)
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 })
  }
}
