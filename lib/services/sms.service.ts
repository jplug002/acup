interface SMSOptions {
  to: string | string[]
  message: string
}

interface SMSResponse {
  success: boolean
  sent?: number
  failed?: number
  errors?: string[]
  error?: string
}

export class SMSService {
  private apiKey: string
  private username: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.AFRICASTALKING_API_KEY || ""
    this.username = process.env.AFRICASTALKING_USERNAME || "sandbox"
    this.baseUrl =
      this.username === "sandbox"
        ? "https://api.sandbox.africastalking.com/version1"
        : "https://api.africastalking.com/version1"
  }

  async sendSMS(options: SMSOptions): Promise<SMSResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("Africa's Talking API key not configured")
      }

      const recipients = Array.isArray(options.to) ? options.to.join(",") : options.to
      const phoneNumbers = recipients.split(",")

      for (const phone of phoneNumbers) {
        if (!phone.trim().startsWith("+")) {
          throw new Error(`Invalid phone number: ${phone}. Must include country code`)
        }
      }

      const response = await fetch(`${this.baseUrl}/messaging`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apiKey: this.apiKey,
          Accept: "application/json",
        },
        body: new URLSearchParams({
          username: this.username,
          to: recipients,
          message: options.message,
          from: "ACUP",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send SMS")
      }

      const smsResults = data.SMSMessageData?.Recipients || []
      const sent = smsResults.filter((r: any) => r.status === "Success").length
      const failed = smsResults.filter((r: any) => r.status !== "Success").length
      const errors = smsResults.filter((r: any) => r.status !== "Success").map((r: any) => `${r.number}: ${r.status}`)

      console.log("[SMSService] SMS sent:", { sent, failed })

      return {
        success: failed === 0,
        sent,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      }
    } catch (error) {
      console.error("[SMSService] Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send SMS",
      }
    }
  }

  async sendBulkSMS(recipients: Array<{ phone: string; name: string }>, message: string): Promise<SMSResponse> {
    const results = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const recipient of recipients) {
      const personalizedMessage = message.replace(/\{name\}/g, recipient.name)
      const result = await this.sendSMS({
        to: recipient.phone,
        message: personalizedMessage,
      })

      if (result.success) {
        results.sent++
      } else {
        results.failed++
        results.errors.push(`${recipient.phone}: ${result.error}`)
      }
    }

    results.success = results.failed === 0
    return results
  }
}

const smsServiceInstance = new SMSService()
export { smsServiceInstance as smsService }
