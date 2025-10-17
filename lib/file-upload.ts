import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export interface UploadResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
}

/**
 * Saves a base64 encoded file to the public/uploads directory
 * @param base64Data - The base64 encoded file data (with or without data URI prefix)
 * @param originalFileName - The original filename with extension
 * @param subfolder - Optional subfolder within uploads (e.g., 'ideologies', 'articles')
 * @returns UploadResult with file path or error
 */
export async function saveBase64File(
  base64Data: string,
  originalFileName: string,
  subfolder = "",
): Promise<UploadResult> {
  try {
    // Remove data URI prefix if present (e.g., "data:application/pdf;base64,")
    const base64Content = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64Content, "base64")

    // Generate unique filename to prevent conflicts
    const timestamp = Date.now()
    const fileExtension = originalFileName.split(".").pop() || "pdf"
    const sanitizedName = originalFileName
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-z0-9]/gi, "-") // Replace special chars with dash
      .toLowerCase()
      .substring(0, 50) // Limit length

    const uniqueFileName = `${sanitizedName}-${timestamp}.${fileExtension}`

    // Determine upload directory
    const uploadDir = subfolder
      ? join(process.cwd(), "public", "uploads", subfolder)
      : join(process.cwd(), "public", "uploads")

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Full file path
    const filePath = join(uploadDir, uniqueFileName)

    // Write file to disk
    await writeFile(filePath, fileBuffer)

    // Return public URL path
    const publicPath = subfolder ? `/uploads/${subfolder}/${uniqueFileName}` : `/uploads/${uniqueFileName}`

    console.log("[v0] File saved successfully:", publicPath)

    return {
      success: true,
      filePath: publicPath,
      fileName: uniqueFileName,
    }
  } catch (error) {
    console.error("[v0] Error saving file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Gets the file size in a human-readable format
 * @param base64Data - The base64 encoded file data
 * @returns File size string (e.g., "2.5 MB" or "150 KB")
 */
export function getBase64FileSize(base64Data: string): string {
  try {
    // Remove data URI prefix if present
    const base64Content = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data

    // Calculate size in bytes (base64 is ~33% larger than original)
    const fileSizeBytes = Math.round((base64Content.length * 3) / 4)
    const fileSizeKB = fileSizeBytes / 1024

    if (fileSizeKB > 1024) {
      return `${(fileSizeKB / 1024).toFixed(2)} MB`
    }
    return `${Math.round(fileSizeKB)} KB`
  } catch (error) {
    console.error("[v0] Error calculating file size:", error)
    return "Unknown"
  }
}

/**
 * Gets the MIME type from file extension
 * @param fileName - The filename with extension
 * @returns MIME type string
 */
export function getMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
  }

  return mimeTypes[extension || ""] || "application/octet-stream"
}
