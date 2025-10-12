import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"

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

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("[v0] BLOB_READ_WRITE_TOKEN is not configured")
      return NextResponse.json(
        { error: "Blob storage is not configured. Please check environment variables." },
        { status: 500 },
      )
    }

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

    if (file && file.size > 0) {
      try {
        console.log("[v0] Uploading file to Vercel Blob:", file.name, "Size:", file.size, "bytes")
        console.log("[v0] File type:", file.type)

        const blobPath = `ideologies/${ideology.id}/${file.name}`
        console.log("[v0] Blob path:", blobPath)

        // Upload to Vercel Blob with organized path
        const blob = await put(blobPath, file, {
          access: "public",
        })

        console.log("[v0] File uploaded successfully to Blob:", blob.url)
        console.log("[v0] Blob details:", { url: blob.url, pathname: blob.pathname, size: blob.size })

        // Get file type from file object
        const fileType = file.type || "application/octet-stream"

        // Create download entry with Blob URL
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
            ${blob.url},
            ${file.name},
            ${fileType},
            ${file.size},
            ${"ideology"},
            ${"published"},
            ${0},
            NOW(),
            NOW()
          )
          RETURNING *
        `

        console.log("[v0] Download entry created:", downloadResult[0].id)
      } catch (uploadError) {
        console.error("[v0] Error uploading file or creating download entry:", uploadError)
        console.error("[v0] Upload error details:", {
          name: uploadError instanceof Error ? uploadError.name : "Unknown",
          message: uploadError instanceof Error ? uploadError.message : "Unknown error",
          stack: uploadError instanceof Error ? uploadError.stack : undefined,
        })
        // Return error if file upload fails
        return NextResponse.json(
          {
            error: "Failed to upload document",
            details: uploadError instanceof Error ? uploadError.message : "Unknown error",
          },
          { status: 500 },
        )
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
