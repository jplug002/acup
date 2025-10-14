import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateMembershipNumber } from "@/lib/membership"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile with membership info
    const profile = await sql`
      SELECT 
        u.id, u.first_name, u.last_name, u.email, u.image, u.role, u.status, u.created_at,
        up.*,
        m.membership_type, m.status as membership_status, m.joined_date, m.notes as membership_notes
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN memberships m ON u.id = m.user_id
      WHERE u.id = ${session.user.id}
    `

    if (profile.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userProfile = profile[0]

    if (userProfile.membership_number && userProfile.membership_number.startsWith("ACUP-")) {
      // Check if we have all required fields to generate new membership number
      if (userProfile.country && userProfile.date_of_birth && userProfile.gender) {
        const newMembershipNumber = generateMembershipNumber(
          userProfile.id,
          userProfile.first_name,
          userProfile.country,
          userProfile.date_of_birth,
          userProfile.gender,
          userProfile.created_at,
        )

        // Update the membership number in the database
        await sql`
          UPDATE user_profiles 
          SET membership_number = ${newMembershipNumber}, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${session.user.id}
        `

        // Update the profile object to return the new membership number
        userProfile.membership_number = newMembershipNumber
      }
    }

    return NextResponse.json({ profile: userProfile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const userData = await sql`
      SELECT id, first_name, created_at FROM users WHERE id = ${session.user.id}
    `

    if (userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userData[0]

    // Check if profile exists
    const existingProfile = await sql`
      SELECT id, membership_number FROM user_profiles WHERE user_id = ${session.user.id}
    `

    if (existingProfile.length > 0) {
      let membershipNumber = existingProfile[0].membership_number

      const isOldFormat = membershipNumber && membershipNumber.startsWith("ACUP-")
      if ((!membershipNumber || isOldFormat) && data.country && data.date_of_birth && data.gender) {
        membershipNumber = generateMembershipNumber(
          user.id,
          user.first_name,
          data.country,
          data.date_of_birth,
          data.gender,
          user.created_at,
        )
      }

      // Update existing profile
      const updatedProfile = await sql`
        UPDATE user_profiles SET
          bio = ${data.bio || null},
          profile_picture = ${data.profile_picture || null},
          date_of_birth = ${data.date_of_birth || null},
          gender = ${data.gender || null},
          phone = ${data.phone || null},
          address = ${data.address || null},
          city = ${data.city || null},
          state = ${data.state || null},
          country = ${data.country || null},
          postal_code = ${data.postal_code || null},
          occupation = ${data.occupation || null},
          employer = ${data.employer || null},
          education_level = ${data.education_level || null},
          political_experience = ${data.political_experience || null},
          languages_spoken = ${data.languages_spoken || "{}"},
          interests = ${data.interests || "{}"},
          skills = ${data.skills || "{}"},
          emergency_contact_name = ${data.emergency_contact_name || null},
          emergency_contact_phone = ${data.emergency_contact_phone || null},
          emergency_contact_relationship = ${data.emergency_contact_relationship || null},
          sponsor_name = ${data.sponsor_name || null},
          branch_preference = ${data.branch_preference || null},
          volunteer_interests = ${data.volunteer_interests || "{}"},
          social_media_links = ${JSON.stringify(data.social_media_links || {})},
          preferred_communication = ${data.preferred_communication || null},
          newsletter_subscription = ${data.newsletter_subscription !== undefined ? data.newsletter_subscription : true},
          privacy_settings = ${JSON.stringify(data.privacy_settings || {})},
          membership_number = ${membershipNumber || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${session.user.id}
        RETURNING *
      `

      return NextResponse.json({ profile: updatedProfile[0] })
    } else {
      let membershipNumber = null
      if (data.country && data.date_of_birth && data.gender) {
        membershipNumber = generateMembershipNumber(
          user.id,
          user.first_name,
          data.country,
          data.date_of_birth,
          data.gender,
          user.created_at,
        )
      }

      // Create new profile
      const newProfile = await sql`
        INSERT INTO user_profiles (
          user_id, bio, profile_picture, date_of_birth, gender, phone, address, city, state, country,
          postal_code, occupation, employer, education_level, political_experience, languages_spoken,
          interests, skills, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
          sponsor_name, branch_preference, volunteer_interests, social_media_links, preferred_communication,
          newsletter_subscription, privacy_settings, membership_number
        ) VALUES (
          ${session.user.id}, ${data.bio || null}, ${data.profile_picture || null}, ${data.date_of_birth || null},
          ${data.gender || null}, ${data.phone || null}, ${data.address || null}, ${data.city || null},
          ${data.state || null}, ${data.country || null}, ${data.postal_code || null}, ${data.occupation || null},
          ${data.employer || null}, ${data.education_level || null}, ${data.political_experience || null},
          ${data.languages_spoken || "{}"}, ${data.interests || "{}"}, ${data.skills || "{}"},
          ${data.emergency_contact_name || null}, ${data.emergency_contact_phone || null},
          ${data.emergency_contact_relationship || null}, ${data.sponsor_name || null},
          ${data.branch_preference || null}, ${data.volunteer_interests || "{}"}, 
          ${JSON.stringify(data.social_media_links || {})}, ${data.preferred_communication || null},
          ${data.newsletter_subscription !== undefined ? data.newsletter_subscription : true},
          ${JSON.stringify(data.privacy_settings || {})}, ${membershipNumber}
        )
        RETURNING *
      `

      return NextResponse.json({ profile: newProfile[0] })
    }
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
