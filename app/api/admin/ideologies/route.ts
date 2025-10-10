import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { saveBase64File, getBase64FileSize, getMimeType } from "@/lib/file-upload"

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
    console.log("[v0] Received ideology data:", { title: body.title, hasFile: !!body.file })

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
        console.log("[v0] Processing file upload:", fileName)

        // Save file to public/uploads/ideologies folder
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

        // Get file metadata
        const fileSize = getBase64FileSize(file)
        const fileType = getMimeType(fileName)

        console.log("[v0] File saved to:", uploadResult.filePath)

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

        console.log("[v0] Download entry created:", downloadResult[0])
      } catch (downloadError) {
        console.error("[v0] Error creating download entry:", downloadError)
        // Return error since file upload is part of the request
        return NextResponse.json(
          {
            error: "Failed to save document",
            details: downloadError instanceof Error ? downloadError.message : "Unknown error",
          },
          { status: 500 },
        )
      }
    } else {
      console.log("[v0] No file uploaded with ideology")
    }

    return NextResponse.json(ideology, { status: 201 })
  } catch (error) {
    console.error("[v0] Detailed error creating ideology:", {
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
