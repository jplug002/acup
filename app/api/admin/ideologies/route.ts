import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { saveBase64File, getBase64FileSize, getMimeType } from "@/lib/file-upload"

const sql = neon(process.env.DATABASE_URL!)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "15mb",
    },
  },
}

export const runtime = "nodejs"
export const maxDuration = 60 // 60 seconds timeout
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const ideologies = await sql`
      SELECT 
        i.*,
        d.id as download_id,
        d.file_url,
        d.file_name,
        d.file_type,
        d.file_size,
        d.download_count
      FROM ideologies i
      LEFT JOIN downloads d ON d.ideology_id = i.id AND d.status = 'published'
      ORDER BY i.created_at DESC
    `
    return NextResponse.json(ideologies)
  } catch (error) {
    console.error("[v0] Error fetching ideologies:", error)
    return NextResponse.json({ error: "Failed to fetch ideologies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length")
    const maxSize = 15 * 1024 * 1024 // 15MB limit

    if (contentLength && Number.parseInt(contentLength) > maxSize) {
      console.log("[v0] Request too large:", contentLength)
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 413 })
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[v0] Error parsing request body:", parseError)
      return NextResponse.json(
        { error: "Request too large or invalid. Please use a file smaller than 10MB." },
        { status: 413 },
      )
    }

    console.log("[v0] Received ideology data:", { title: body.title, hasFile: !!body.file })

    const { title, content, file, fileName } = body

    if (!title || !content) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    if (file) {
      const fileSize = getBase64FileSize(file)
      console.log("[v0] File size:", fileSize)

      const base64Content = file.includes(",") ? file.split(",")[1] : file
      const fileSizeBytes = Math.round((base64Content.length * 3) / 4)

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
    console.log("[v0] Ideology created successfully:", ideology)

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

        console.log("[v0] Download entry created:", downloadResult[0])
      } catch (downloadError) {
        console.error("[v0] Error creating download entry:", downloadError)
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

    if (error instanceof Error) {
      if (error.message.includes("payload") || error.message.includes("body")) {
        return NextResponse.json({ error: "Request too large. Please use a smaller file (max 10MB)." }, { status: 413 })
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create ideology",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
