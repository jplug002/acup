import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, country, city, date_of_birth, occupation, education, interests } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const newUser = await createUser({
      name,
      email,
      password,
      phone,
      country,
      city,
      date_of_birth,
      occupation,
      education,
      interests,
    })

    const { password_hash: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      message: "User created successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
