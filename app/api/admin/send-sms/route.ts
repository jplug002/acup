/**
 * Admin SMS API Route
 * POST /api/admin/send-sms
 *
 * Sends SMS to individual users or all users via Africa's Talking
 *
 * Request body:
 * - recipients: string[] (array of user IDs) or "all"
 * - message: string
 */

import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { smsService } from "@/lib/services/sms.service"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, message } = body

    // Validate required fields
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // If sending to all users, fetch all user phone numbers from database
    if (recipients === "all") {
      const users = await sql`
        SELECT u.id, u.first_name, u.last_name, up.phone
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.status = 'active' AND up.phone IS NOT NULL AND up.phone != ''
      `

      if (users.length === 0) {
        return NextResponse.json({ error: "No active users with phone numbers found" }, { status: 404 })
      }

      // Send bulk SMS
      const result = await smsService.sendBulkSMS(
        users.map((u) => ({
          phone: u.phone,
          name: `${u.first_name} ${u.last_name}`.trim() || "Member",
        })),
        message,
      )

      return NextResponse.json({
        success: result.success,
        sent: result.sent,
        failed: result.failed,
        errors: result.errors,
        message: `SMS sent to ${result.sent} users${result.failed > 0 ? `, ${result.failed} failed` : ""}`,
      })
    }

    // Send to specific recipients
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients must be an array of user IDs or 'all'" }, { status: 400 })
    }

    // Fetch user details and phone numbers
    const users = await sql`
      SELECT u.id, u.first_name, u.last_name, up.phone
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ANY(${recipients}) AND up.phone IS NOT NULL AND up.phone != ''
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No valid users with phone numbers found for the provided IDs" },
        { status: 404 },
      )
    }

    // Send SMS
    const result = await smsService.sendBulkSMS(
      users.map((u) => ({
        phone: u.phone,
        name: `${u.first_name} ${u.last_name}`.trim() || "Member",
      })),
      message,
    )

    return NextResponse.json({
      success: result.success,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors,
      message: `SMS sent to ${result.sent} users${result.failed > 0 ? `, ${result.failed} failed` : ""}`,
    })
  } catch (error) {
    console.error("[Admin SMS API] Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send SMS",
      },
      { status: 500 },
    )
  }
}
