import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[v0] Missing credentials")
          return null
        }

        try {
          console.log("[v0] Attempting to find user:", credentials.email)

          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `

          if (users.length === 0) {
            console.log("[v0] User not found")
            return null
          }

          const user = users[0]
          console.log("[v0] User found, checking password")

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            console.log("[v0] Invalid password")
            return null
          }

          console.log("[v0] Password valid, returning user data")

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.first_name + " " + user.last_name,
            role: user.role || "USER",
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  phone?: string
  country?: string
  city?: string
  date_of_birth?: string
  occupation?: string
  education?: string
  interests?: string
}) {
  try {
    console.log("[v0] Creating user with data:", { ...userData, password: "[REDACTED]" })
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const nameParts = userData.name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const result = await sql`
      INSERT INTO users (
        first_name, last_name, email, password_hash, role, status, created_at, updated_at
      )
      VALUES (
        ${firstName}, ${lastName}, ${userData.email}, ${hashedPassword}, 
        'USER', 'active', NOW(), NOW()
      )
      RETURNING *
    `

    console.log("[v0] User created successfully:", result[0].id)
    return result[0]
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("[v0] Error getting user by email:", error)
    throw error
  }
}

export async function getUserById(id: string) {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id}
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("[v0] Error getting user by ID:", error)
    throw error
  }
}
