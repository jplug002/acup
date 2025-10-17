import { type NextRequest, NextResponse } from "next/server"
import { verifyResetToken, markTokenAsUsed } from "@/lib/password-reset"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Verify token
    const userId = await verifyResetToken(token)

    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${userId}
    `

    // Mark token as used
    await markTokenAsUsed(token)

    // Invalidate all sessions for this user (security best practice)
    await sql`
      DELETE FROM sessions WHERE user_id = ${userId}
    `

    return NextResponse.json({
      message: "Password reset successful. Please log in with your new password.",
    })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 })
  }
}
