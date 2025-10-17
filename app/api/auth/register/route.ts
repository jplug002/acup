import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { mailService } from "@/lib/services/mail.service"

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

    try {
      await mailService.sendEmail({
        to: email,
        subject: "Welcome to ACUP - Africa Continental Unity Party",
        message: `Dear ${name},

Welcome to the Africa Continental Unity Party (ACUP)!

We are thrilled to have you join our movement towards building a unified, democratic, and prosperous Africa. Your registration marks the beginning of an exciting journey where your voice and participation will help shape the future of our continent.

As a member of ACUP, you now have access to:
- Our comprehensive ideology and policy documents
- Updates on events and initiatives across Africa
- Opportunities to engage with fellow members and leaders
- Resources to support democratic participation in your community

Thank you for believing in our vision of a united Africa. Together, we will build democratic institutions, foster economic empowerment, and create lasting positive change.

Best regards,
The ACUP Team

---
This is an automated message. Please do not reply to this email.`,
      })
      console.log("[Registration] Welcome email sent to:", email)
    } catch (emailError) {
      // Log error but don't fail registration if email fails
      console.error("[Registration] Failed to send welcome email:", emailError)
    }

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
