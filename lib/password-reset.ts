import crypto from "crypto"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Generate a cryptographically secure random token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Hash the token for secure storage
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

// Create a password reset request
export async function createPasswordResetToken(email: string): Promise<string | null> {
  try {
    // Find user by email
    const users = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      // Don't reveal if email exists or not (security best practice)
      return null
    }

    const userId = users[0].id

    // Generate token
    const token = generateResetToken()
    const tokenHash = hashToken(token)

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Invalidate any existing unused tokens for this user
    await sql`
      UPDATE password_resets 
      SET used = TRUE 
      WHERE user_id = ${userId} AND used = FALSE
    `

    // Store hashed token
    await sql`
      INSERT INTO password_resets (user_id, token_hash, expires_at)
      VALUES (${userId}, ${tokenHash}, ${expiresAt})
    `

    return token
  } catch (error) {
    console.error("[v0] Error creating password reset token:", error)
    return null
  }
}

// Verify reset token and return user ID if valid
export async function verifyResetToken(token: string): Promise<number | null> {
  try {
    const tokenHash = hashToken(token)

    const results = await sql`
      SELECT user_id, expires_at, used 
      FROM password_resets 
      WHERE token_hash = ${tokenHash}
    `

    if (results.length === 0) {
      return null
    }

    const resetRequest = results[0]

    // Check if token is expired
    if (new Date() > new Date(resetRequest.expires_at)) {
      return null
    }

    // Check if token has been used
    if (resetRequest.used) {
      return null
    }

    return resetRequest.user_id
  } catch (error) {
    console.error("[v0] Error verifying reset token:", error)
    return null
  }
}

// Mark token as used after successful password reset
export async function markTokenAsUsed(token: string): Promise<void> {
  try {
    const tokenHash = hashToken(token)

    await sql`
      UPDATE password_resets 
      SET used = TRUE 
      WHERE token_hash = ${tokenHash}
    `
  } catch (error) {
    console.error("[v0] Error marking token as used:", error)
  }
}

// Clean up expired tokens (can be run periodically)
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await sql`
      DELETE FROM password_resets 
      WHERE expires_at < NOW() OR used = TRUE
    `
  } catch (error) {
    console.error("[v0] Error cleaning up expired tokens:", error)
  }
}
