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
      const host = request.headers.get("host")
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.PUBLIC_URL ||
        (host ? `${protocol}://${host}` : "http://localhost:3000")

      const resetLink = `${baseUrl}/auth/reset-password?token=${token}`

      console.log("[v0] Password reset - Base URL:", baseUrl)
      console.log("[v0] Password reset - Full link:", resetLink)

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
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
           Header 
          <tr>
            <td style="background-color: #1e40af; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ACUP</h1>
            </td>
          </tr>
          
           Content 
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 20px;">Reset Your Password</h2>
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                You requested to reset your password for your ACUP account. Click the button below to create a new password.
              </p>
              
               Button 
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #1e40af; word-break: break-all; margin: 10px 0 20px 0; font-size: 14px;">
                <a href="${resetLink}" style="color: #1e40af;">${resetLink}</a>
              </p>
              
              <p style="color: #999999; line-height: 1.6; margin: 30px 0 0 0; font-size: 13px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
              </p>
            </td>
          </tr>
          
           Footer 
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
              <p style="color: #999999; margin: 0; font-size: 12px;">
                Best regards,<br>ACUP Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
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
