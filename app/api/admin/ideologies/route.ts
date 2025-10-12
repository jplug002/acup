import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import formidable from "formidable"
import { readFile } from "fs/promises"

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

async function parseFormData(request: NextRequest): Promise<{
  fields: formidable.Fields
  files: formidable.Files
}> {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    keepExtensions: true,
  })

  // Convert NextRequest to Node.js IncomingMessage format
  const arrayBuffer = await request.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    // Create a mock request object that formidable can parse
    const mockReq = {
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      url: request.url,
    } as any

    // Parse the buffer directly
    form.parse(mockReq, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ fields, files })
    })

    // Write the buffer to formidable
    mockReq.emit = () => {}
    mockReq.on = (event: string, callback: any) => {
      if (event === "data") {
        callback(buffer)
      } else if (event === "end") {
        callback()
      }
    }
  })
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

    const { fields, files } = await parseFormData(request)

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title
    const content = Array.isArray(fields.content) ? fields.content[0] : fields.content
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category
    const fileArray = Array.isArray(files.file) ? files.file : files.file ? [files.file] : []
    const file = fileArray[0]

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
        console.log("[v0] Uploading file to Vercel Blob:", file.originalFilename, "Size:", file.size, "bytes")

        // Read the file from the temporary location
        const fileBuffer = await readFile(file.filepath)
        const fileName = file.originalFilename || "document.pdf"
        const blobPath = `ideologies/${ideology.id}/${fileName}`

        console.log("[v0] Blob path:", blobPath)

        // Upload to Vercel Blob
        const blob = await put(blobPath, fileBuffer, {
          access: "public",
          contentType: file.mimetype || "application/octet-stream",
        })

        blobUrl = blob.url
        console.log("[v0] File uploaded successfully to Blob:", blob.url)

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
            ${fileName},
            ${file.mimetype || "application/octet-stream"},
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
        console.error("[v0] Error uploading file:", uploadError)
        return NextResponse.json(
          {
            error: "Failed to upload document",
            details: uploadError instanceof Error ? uploadError.message : "Unknown error",
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
