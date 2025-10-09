/**
 * Email Service using Gmail SMTP
 *
 * Configuration required:
 * - SMTP_HOST: Gmail SMTP server (smtp.gmail.com)
 * - SMTP_PORT: Port number (587 for TLS)
 * - SMTP_USER: Your Gmail address
 * - SMTP_PASSWORD: Your Gmail app password (not regular password)
 */

import nodemailer from "nodemailer"

interface EmailOptions {
  to: string | string[]
  subject: string
  message: string
}

interface EmailResponse {
  success: boolean
  sent?: number
  failed?: number
  errors?: string[]
  error?: string
}

export class MailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    try {
      const host = process.env.SMTP_HOST
      const port = Number.parseInt(process.env.SMTP_PORT || "587")
      const user = process.env.SMTP_USER
      const pass = process.env.SMTP_PASSWORD

      if (!host || !user || !pass) {
        console.warn("[MailService] SMTP credentials not configured")
        return
      }

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      })

      console.log("[MailService] Email service initialized")
    } catch (error) {
      console.error("[MailService] Failed to initialize:", error)
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      if (!this.transporter) {
        throw new Error("Email service not configured. Please add SMTP credentials.")
      }

      const recipients = Array.isArray(options.to) ? options.to : [options.to]

      const info = await this.transporter.sendMail({
        from: `"ACUP" <${process.env.SMTP_USER}>`,
        to: recipients.join(", "),
        subject: options.subject,
        text: options.message,
        html: options.message.replace(/\n/g, "<br>"),
      })

      console.log("[MailService] Email sent:", info.messageId)

      return {
        success: true,
        sent: recipients.length,
        failed: 0,
      }
    } catch (error) {
      console.error("[MailService] Error sending email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  async sendBulkEmail(
    recipients: Array<{ email: string; name: string }>,
    subject: string,
    message: string,
  ): Promise<EmailResponse> {
    const results = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const recipient of recipients) {
      const personalizedMessage = message.replace(/\{name\}/g, recipient.name)
      const result = await this.sendEmail({
        to: recipient.email,
        subject,
        message: personalizedMessage,
      })

      if (result.success) {
        results.sent++
      } else {
        results.failed++
        results.errors.push(`${recipient.email}: ${result.error}`)
      }
    }

    results.success = results.failed === 0
    return results
  }
}

export const mailService = new MailService()
