import { type NextRequest, NextResponse } from "next/server"
import { createPasswordResetToken } from "@/lib/password-reset"
import { mailService } from "@/lib/services/mail.service"

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

    if (token) {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.PUBLIC_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`

      // Send password reset email
      const emailResult = await mailService.sendEmail({
        to: email,
        subject: "Reset Your ACUP Password",
        message: `Hello,

You requested to reset your password for your ACUP account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
ACUP Team`,
      })

      if (!emailResult.success) {
        console.error("[Password Reset] Failed to send email:", emailResult.error)
        // Don't reveal email sending failure to user for security
      }
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("[Password Reset] Error:", error)
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 })
  }
}
