import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { membershipQueries } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const membership = await membershipQueries.findByUserId(session.user.id)

    if (!membership) {
      return NextResponse.json({ error: "No membership found" }, { status: 404 })
    }

    return NextResponse.json({
      id: membership.id,
      status: membership.status,
      membership_type: membership.membership_type,
      membership_number: membership.membership_number,
      application_date: membership.created_at,
      approval_date: membership.approval_date,
    })
  } catch (error) {
    console.error("Error fetching membership:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
