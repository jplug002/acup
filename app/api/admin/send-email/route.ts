/**
 * Admin Email API Route
 * POST /api/admin/send-email
 *
 * Sends emails to individual users or all users
 *
 * Request body:
 * - recipients: string[] (array of email addresses) or "all"
 * - subject: string
 * - message: string
 */

import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { mailService } from "@/lib/services/mail.service"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, subject, message } = body

    // Validate required fields
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 })
    }

    // If sending to all users, fetch all user emails from database
    if (recipients === "all") {
      const users = await sql`
        SELECT u.email, u.first_name, u.last_name
        FROM users u
        WHERE u.status = 'active' AND u.email IS NOT NULL
      `

      if (users.length === 0) {
        return NextResponse.json({ error: "No active users found" }, { status: 404 })
      }

      // Send bulk email
      const result = await mailService.sendBulkEmail(
        users.map((u) => ({
          email: u.email,
          name: `${u.first_name} ${u.last_name}`.trim() || "Member",
        })),
        subject,
        message,
      )

      return NextResponse.json({
        success: result.success,
        sent: result.sent,
        failed: result.failed,
        errors: result.errors,
        message: `Email sent to ${result.sent} users${result.failed > 0 ? `, ${result.failed} failed` : ""}`,
      })
    }

    // Send to specific recipients
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients must be an array of email addresses or 'all'" }, { status: 400 })
    }

    // Fetch user details for personalization
    const users = await sql`
      SELECT u.email, u.first_name, u.last_name
      FROM users u
      WHERE u.email = ANY(${recipients})
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "No valid users found for the provided email addresses" }, { status: 404 })
    }

    // Send emails
    const result = await mailService.sendBulkEmail(
      users.map((u) => ({
        email: u.email,
        name: `${u.first_name} ${u.last_name}`.trim() || "Member",
      })),
      subject,
      message,
    )

    return NextResponse.json({
      success: result.success,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors,
      message: `Email sent to ${result.sent} users${result.failed > 0 ? `, ${result.failed} failed` : ""}`,
    })
  } catch (error) {
    console.error("[Admin Email API] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    )
  }
}
