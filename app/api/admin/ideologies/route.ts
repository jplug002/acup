import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const ideologies = await sql`
      SELECT * FROM ideologies 
      ORDER BY created_at DESC
    `
    return NextResponse.json(ideologies)
  } catch (error) {
    console.error("Error fetching ideologies:", error)
    return NextResponse.json({ error: "Failed to fetch ideologies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Received ideology data:", body)

    const { title, content, file, fileName } = body

    if (!title || !content) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO ideologies (title, content, status, created_at, updated_at)
      VALUES (${title}, ${content}, 'ACTIVE', NOW(), NOW())
      RETURNING *
    `

    const ideology = result[0]
    console.log("[v0] Ideology created successfully:", ideology)

    if (file && fileName) {
      try {
        // Get file extension and type
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "pdf"
        const fileType = fileExtension === "pdf" ? "application/pdf" : "application/msword"

        // Calculate approximate file size from base64
        const fileSizeBytes = Math.round((file.length * 3) / 4)
        const fileSizeKB = Math.round(fileSizeBytes / 1024)
        const fileSize = fileSizeKB > 1024 ? `${(fileSizeKB / 1024).toFixed(2)} MB` : `${fileSizeKB} KB`

        const downloadResult = await sql`
          INSERT INTO downloads (
            title, 
            description, 
            file_url, 
            file_name, 
            file_type, 
            file_size, 
            category, 
            status, 
            download_count,
            created_at, 
            updated_at
          )
          VALUES (
            ${title},
            ${`Download the ${title} document`},
            ${file},
            ${fileName},
            ${fileType},
            ${fileSize},
            ${"ideology"},
            ${"published"},
            ${0},
            NOW(),
            NOW()
          )
          RETURNING *
        `

        console.log("[v0] Download entry created:", downloadResult[0])
      } catch (downloadError) {
        console.error("[v0] Error creating download entry:", downloadError)
        // Don't fail the whole request if download creation fails
      }
    } else {
      console.log("[v0] No file uploaded with ideology")
    }

    return NextResponse.json(ideology, { status: 201 })
  } catch (error) {
    console.error("[v0] Detailed error creating ideology:", {
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: "Failed to create ideology",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
