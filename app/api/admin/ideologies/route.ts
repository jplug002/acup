import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { saveBase64File, getBase64FileSize, getMimeType } from "@/lib/file-upload"

const sql = neon(process.env.DATABASE_URL!)

export const runtime = "nodejs"
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("[v0] Fetching ideologies...")

    const ideologies = await sql`
      SELECT * FROM ideologies 
      ORDER BY created_at DESC
    `

    console.log("[v0] Fetched ideologies:", ideologies.length)
    return NextResponse.json(ideologies)
  } catch (error) {
    console.error("[v0] Error fetching ideologies:", error)
    return NextResponse.json(
      { error: "Failed to fetch ideologies", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Ideology POST request received")

    const bodyText = await request.text()
    const contentLength = bodyText.length

    console.log("[v0] Request body size:", contentLength, "bytes")

    const maxSize = 20 * 1024 * 1024 // 20MB limit

    if (contentLength > maxSize) {
      console.log("[v0] Request too large:", contentLength)
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 413 })
    }

    let body
    try {
      body = JSON.parse(bodyText)
    } catch (parseError) {
      console.error("[v0] Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    console.log("[v0] Received ideology data:", { title: body.title, hasFile: !!body.file })

    const { title, content, file, fileName } = body

    if (!title || !content) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    if (file) {
      const base64Content = file.includes(",") ? file.split(",")[1] : file
      const fileSizeBytes = Math.round((base64Content.length * 3) / 4)
      console.log("[v0] File size:", fileSizeBytes, "bytes")

      if (fileSizeBytes > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 413 })
      }
    }

    const result = await sql`
      INSERT INTO ideologies (title, content, status, created_at, updated_at)
      VALUES (${title}, ${content}, 'ACTIVE', NOW(), NOW())
      RETURNING *
    `

    const ideology = result[0]
    console.log("[v0] Ideology created successfully:", ideology.id)

    if (file && fileName) {
      try {
        console.log("[v0] Processing file upload:", fileName)

        const uploadResult = await saveBase64File(file, fileName, "ideologies")

        if (!uploadResult.success) {
          console.error("[v0] File upload failed:", uploadResult.error)
          return NextResponse.json(
            {
              error: "Failed to upload document",
              details: uploadResult.error,
            },
            { status: 500 },
          )
        }

        const fileSize = getBase64FileSize(file)
        const fileType = getMimeType(fileName)

        console.log("[v0] File saved to:", uploadResult.filePath)

        const downloadResult = await sql`
          INSERT INTO downloads (
            ideology_id,
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
            ${ideology.id},
            ${title},
            ${`Download the ${title} document`},
            ${uploadResult.filePath},
            ${uploadResult.fileName},
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

        console.log("[v0] Download entry created:", downloadResult[0].id)
      } catch (downloadError) {
        console.error("[v0] Error creating download entry:", downloadError)
        // Don't fail the whole request if download entry fails
        console.log("[v0] Continuing despite download entry error")
      }
    }

    return NextResponse.json(ideology, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating ideology:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: "Failed to create ideology",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
