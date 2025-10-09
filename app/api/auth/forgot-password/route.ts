import { type NextRequest, NextResponse } from "next/server"
import { createPasswordResetToken } from "@/lib/password-reset"

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(email)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (3 requests per hour)
    rateLimitMap.set(email, { count: 1, resetTime: now + 60 * 60 * 1000 })
    return true
  }

  if (limit.count >= 3) {
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check rate limit
    if (!checkRateLimit(email)) {
      return NextResponse.json({ error: "Too many reset requests. Please try again later." }, { status: 429 })
    }

    // Generate reset token
    const token = await createPasswordResetToken(email)

    // Always return success (don't reveal if email exists)
    // In production, send email with reset link here
    if (token) {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`

      console.log("[v0] Password reset link:", resetLink)
      // TODO: Send email with resetLink
      // await sendPasswordResetEmail(email, resetLink)
    }

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 })
  }
}
