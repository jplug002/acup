import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const sql = neon(process.env.DATABASE_URL!)

export const runtime = "nodejs"
export const maxDuration = 60
export const dynamic = "force-dynamic"

async function saveUploadedFile(
  file: File,
): Promise<{ success: boolean; filePath?: string; fileName?: string; error?: string }> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}-${sanitizedName}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "ideologies")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Return public URL path
    const publicPath = `/uploads/ideologies/${fileName}`
    console.log("[v0] File saved successfully:", publicPath)

    return {
      success: true,
      filePath: publicPath,
      fileName: file.name,
    }
  } catch (error) {
    console.error("[v0] Error saving file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

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

    if (file && file.size > 0) {
      try {
        console.log("[v0] Processing file upload:", file.name, "Size:", file.size, "bytes")

        const uploadResult = await saveUploadedFile(file)

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

        // Get file type from file object
        const fileType = file.type || "application/octet-stream"

        console.log("[v0] File saved to:", uploadResult.filePath)

        // Create download entry
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
