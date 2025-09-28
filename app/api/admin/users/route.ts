import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT id, email, first_name, last_name, role, status, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password_hash, first_name, last_name, role } = body

    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role, status, created_at, updated_at)
      VALUES (${email}, ${password_hash}, ${first_name}, ${last_name}, ${role || "user"}, 'active', NOW(), NOW())
      RETURNING id, email, first_name, last_name, role, status, created_at, updated_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
