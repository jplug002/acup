import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import { Buffer } from "buffer"

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

    const formData = await request.formData()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const file = formData.get("file") as File | null

    console.log("[v0] Received ideology data:", { title, category, hasFile: !!file })

    if (!title || !content) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    if (file && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 413 })
    }

    // Create ideology
    const result = await sql`
      INSERT INTO ideologies (title, content, status, created_at, updated_at)
      VALUES (${title}, ${content}, 'ACTIVE', NOW(), NOW())
      RETURNING *
    `

    const ideology = result[0]
    console.log("[v0] Ideology created successfully:", ideology.id)

    let blobUrl = null

    if (file && file.size > 0) {
      try {
        console.log("[v0] Starting file upload:", {
          name: file.name,
          size: file.size,
          type: file.type,
        })

        const timestamp = Date.now()
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const blobPath = `ideologies-${ideology.id}-${timestamp}-${sanitizedFileName}`

        console.log("[v0] Blob path:", blobPath)

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        console.log("[v0] File converted to buffer, size:", buffer.length)

        // Upload to Vercel Blob with explicit options
        console.log("[v0] Calling Vercel Blob put()...")
        const blob = await put(blobPath, buffer, {
          access: "public",
          contentType: file.type || "application/pdf",
        })

        blobUrl = blob.url
        console.log("[v0] File uploaded successfully:", blob.url)

        // Create download entry
        await sql`
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
            ${blob.url},
            ${file.name},
            ${file.type || "application/octet-stream"},
            ${file.size},
            ${"ideology"},
            ${"published"},
            ${0},
            NOW(),
            NOW()
          )
        `

        console.log("[v0] Download entry created")
      } catch (uploadError) {
        const errorMessage = uploadError instanceof Error ? uploadError.message : "Unknown error"
        const errorStack = uploadError instanceof Error ? uploadError.stack : undefined
        const errorName = uploadError instanceof Error ? uploadError.name : undefined

        console.error("[v0] BLOB UPLOAD FAILED:", {
          message: errorMessage,
          name: errorName,
          stack: errorStack,
          tokenConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
        })

        // Return detailed error to help debug
        return NextResponse.json(
          {
            error: "Failed to upload document to Blob storage",
            details: errorMessage,
            hint: !process.env.BLOB_READ_WRITE_TOKEN
              ? "BLOB_READ_WRITE_TOKEN environment variable is not configured"
              : "Check Vercel deployment logs for detailed error information",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      {
        ...ideology,
        fileUrl: blobUrl,
      },
      { status: 201 },
    )
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
