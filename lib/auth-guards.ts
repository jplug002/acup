import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { NextResponse } from "next/server"

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
  }

  return null // No error, user is authenticated admin
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
  }

  return session
}
