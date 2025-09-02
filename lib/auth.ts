import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { userQueries, membershipQueries } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await userQueries.findByEmail(credentials.email)

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isPasswordValid) {
          return null
        }

        const membership = await membershipQueries.findByUserId(user.id)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          membershipStatus: membership?.status || "none",
          membershipNumber: membership?.membership_number || null,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.membershipStatus = user.membershipStatus
        token.membershipNumber = user.membershipNumber
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.membershipStatus = token.membershipStatus
        session.user.membershipNumber = token.membershipNumber
      }
      return session
    },
  },
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
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  const newUser = await userQueries.create({
    name: userData.name,
    email: userData.email,
    password_hash: hashedPassword,
    phone: userData.phone,
    country: userData.country,
    city: userData.city,
    date_of_birth: userData.date_of_birth,
    occupation: userData.occupation,
    education: userData.education,
    interests: userData.interests,
  })

  return newUser
}

export async function getUserByEmail(email: string) {
  return await userQueries.findByEmail(email)
}

export async function getUserById(id: string) {
  return await userQueries.findById(id)
}
