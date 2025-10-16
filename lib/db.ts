import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Database utility functions
export class DatabaseError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

export const userQueries = {
  async create(userData: {
    email: string
    password_hash: string
    name: string
    phone?: string
    country?: string
    city?: string
    date_of_birth?: string
    occupation?: string
    education?: string
    interests?: string
  }) {
    try {
      const nameParts = userData.name.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      const result = await sql`
        INSERT INTO users (
          first_name, last_name, email, password_hash, phone, country, city, 
          date_of_birth, occupation, education, interests, role, created_at, updated_at
        )
        VALUES (
          ${firstName}, ${lastName}, ${userData.email}, ${userData.password_hash}, 
          ${userData.phone || null}, ${userData.country || null}, ${userData.city || null},
          ${userData.date_of_birth ? new Date(userData.date_of_birth) : null},
          ${userData.occupation || null}, ${userData.education || null}, 
          ${userData.interests || null}, 'USER', NOW(), NOW()
        )
        RETURNING *
      `

      return result[0]
    } catch (error) {
      console.error("[v0] Database error creating user:", error)
      throw new DatabaseError("Failed to create user", error)
    }
  },

  async findByEmail(email: string) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("[v0] Database error finding user by email:", error)
      throw new DatabaseError("Failed to find user by email", error)
    }
  },

  async findById(id: string) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE id = ${id}
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("[v0] Database error finding user by ID:", error)
      throw new DatabaseError("Failed to find user by ID", error)
    }
  },

  async update(
    id: string,
    updates: Partial<{
      name: string
      phone: string
      country: string
      city: string
      date_of_birth: string
      occupation: string
      education: string
      interests: string
    }>,
  ) {
    try {
      const setParts = []
      const values = []

      if (updates.name !== undefined) {
        const nameParts = updates.name.trim().split(" ")
        setParts.push("first_name = $" + (values.length + 1))
        values.push(nameParts[0] || "")
        setParts.push("last_name = $" + (values.length + 1))
        values.push(nameParts.slice(1).join(" ") || "")
      }
      if (updates.phone !== undefined) {
        setParts.push("phone = $" + (values.length + 1))
        values.push(updates.phone)
      }
      if (updates.country !== undefined) {
        setParts.push("country = $" + (values.length + 1))
        values.push(updates.country)
      }
      if (updates.city !== undefined) {
        setParts.push("city = $" + (values.length + 1))
        values.push(updates.city)
      }
      if (updates.date_of_birth !== undefined) {
        setParts.push("date_of_birth = $" + (values.length + 1))
        values.push(new Date(updates.date_of_birth))
      }
      if (updates.occupation !== undefined) {
        setParts.push("occupation = $" + (values.length + 1))
        values.push(updates.occupation)
      }
      if (updates.education !== undefined) {
        setParts.push("education = $" + (values.length + 1))
        values.push(updates.education)
      }
      if (updates.interests !== undefined) {
        setParts.push("interests = $" + (values.length + 1))
        values.push(updates.interests)
      }

      if (setParts.length === 0) return null

      setParts.push("updated_at = NOW()")
      values.push(id)

      const result = await sql`
        UPDATE users 
        SET ${sql.unsafe(setParts.join(", "))}
        WHERE id = $${values.length}
        RETURNING *
      `

      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new DatabaseError("Failed to update user", error)
    }
  },
}

export const branchQueries = {
  async getAll() {
    try {
      const result = await sql`
        SELECT * FROM branches ORDER BY created_at DESC
      `
      return result
    } catch (error) {
      throw new DatabaseError("Failed to fetch branches", error)
    }
  },

  async create(branchData: {
    name: string
    country: string
    city: string
    address?: string
    contact_email?: string
    contact_phone?: string
    description?: string
    established_date?: string
  }) {
    try {
      const result = await sql`
        INSERT INTO branches (
          name, country, city, address, contact_email, contact_phone, 
          description, established_date, status, created_at, updated_at
        )
        VALUES (
          ${branchData.name}, ${branchData.country}, ${branchData.city},
          ${branchData.address || null}, ${branchData.contact_email || null}, 
          ${branchData.contact_phone || null}, ${branchData.description || null},
          ${branchData.established_date ? new Date(branchData.established_date) : null},
          'ACTIVE', NOW(), NOW()
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      throw new DatabaseError("Failed to create branch", error)
    }
  },

  async update(
    id: string,
    updates: Partial<{
      name: string
      country: string
      city: string
      address: string
      contact_email: string
      contact_phone: string
      description: string
      established_date: string
      status: string
    }>,
  ) {
    try {
      const setParts = []
      const values = []

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = $${values.length + 1}`)
          values.push(key === "established_date" ? new Date(value) : value)
        }
      })

      if (setParts.length === 0) return null

      setParts.push("updated_at = NOW()")
      values.push(id)

      const result = await sql`
        UPDATE branches 
        SET ${sql.unsafe(setParts.join(", "))}
        WHERE id = $${values.length}
        RETURNING *
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new DatabaseError("Failed to update branch", error)
    }
  },

  async delete(id: string) {
    try {
      await sql`DELETE FROM branches WHERE id = ${id}`
      return true
    } catch (error) {
      throw new DatabaseError("Failed to delete branch", error)
    }
  },
}

export const ideologyQueries = {
  async getAll() {
    try {
      const result = await sql`
        SELECT * FROM ideologies ORDER BY priority ASC, created_at DESC
      `
      return result
    } catch (error) {
      throw new DatabaseError("Failed to fetch ideologies", error)
    }
  },

  async create(ideologyData: {
    title: string
    description: string
    category?: string
    priority?: number
  }) {
    try {
      const result = await sql`
        INSERT INTO ideologies (title, description, category, priority, status, created_at, updated_at)
        VALUES (
          ${ideologyData.title}, ${ideologyData.description}, 
          ${ideologyData.category || null}, ${ideologyData.priority || 0},
          'ACTIVE', NOW(), NOW()
        )
        RETURNING *
      `

      const ideology = result[0]

      await sql`
        INSERT INTO downloads (
          title, description, file_url, file_name, file_type, 
          category, ideology_id, status, created_at, updated_at
        )
        VALUES (
          ${ideologyData.title}, 
          ${ideologyData.description},
          ${`/downloads/${ideology.id}-${ideologyData.title.toLowerCase().replace(/\s+/g, "-")}.pdf`},
          ${`${ideologyData.title.toLowerCase().replace(/\s+/g, "-")}.pdf`},
          'PDF',
          ${ideologyData.category || "ideology"},
          ${ideology.id},
          'published',
          NOW(),
          NOW()
        )
      `

      return ideology
    } catch (error) {
      throw new DatabaseError("Failed to create ideology", error)
    }
  },

  async update(
    id: string,
    updates: Partial<{
      title: string
      description: string
      category: string
      priority: number
      status: string
    }>,
  ) {
    try {
      const setParts = []
      const values = []

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = $${values.length + 1}`)
          values.push(value)
        }
      })

      if (setParts.length === 0) return null

      setParts.push("updated_at = NOW()")
      values.push(id)

      const result = await sql`
        UPDATE ideologies 
        SET ${sql.unsafe(setParts.join(", "))}
        WHERE id = $${values.length}
        RETURNING *
      `

      if (updates.title || updates.description) {
        const ideology = result[0]
        await sql`
          UPDATE downloads
          SET 
            title = ${updates.title || ideology.title},
            description = ${updates.description || ideology.description},
            file_url = ${updates.title ? `/downloads/${ideology.id}-${updates.title.toLowerCase().replace(/\s+/g, "-")}.pdf` : sql`file_url`},
            file_name = ${updates.title ? `${updates.title.toLowerCase().replace(/\s+/g, "-")}.pdf` : sql`file_name`},
            category = ${updates.category || sql`category`},
            updated_at = NOW()
          WHERE ideology_id = ${id}
        `
      }

      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new DatabaseError("Failed to update ideology", error)
    }
  },

  async delete(id: string) {
    try {
      await sql`DELETE FROM downloads WHERE ideology_id = ${id}`
      await sql`DELETE FROM ideologies WHERE id = ${id}`
      return true
    } catch (error) {
      throw new DatabaseError("Failed to delete ideology", error)
    }
  },
}

export const eventQueries = {
  async getAll() {
    try {
      const result = await sql`
        SELECT * FROM events ORDER BY event_date DESC
      `
      return result
    } catch (error) {
      throw new DatabaseError("Failed to fetch events", error)
    }
  },

  async create(eventData: {
    title: string
    description: string
    event_date: string
    end_date?: string
    location?: string
    event_type?: string
    max_attendees?: number
    registration_required?: boolean
  }) {
    try {
      const result = await sql`
        INSERT INTO events (
          title, description, event_date, end_date, location, event_type,
          max_attendees, registration_required, status, created_at, updated_at
        )
        VALUES (
          ${eventData.title}, ${eventData.description}, ${new Date(eventData.event_date)},
          ${eventData.end_date ? new Date(eventData.end_date) : null}, ${eventData.location || null},
          ${eventData.event_type || "GENERAL"}, ${eventData.max_attendees || null},
          ${eventData.registration_required || false}, 'UPCOMING', NOW(), NOW()
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      throw new DatabaseError("Failed to create event", error)
    }
  },

  async update(
    id: string,
    updates: Partial<{
      title: string
      description: string
      event_date: string
      end_date: string
      location: string
      event_type: string
      max_attendees: number
      registration_required: boolean
      status: string
    }>,
  ) {
    try {
      const setParts = []
      const values = []

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = $${values.length + 1}`)
          if (key === "event_date" || key === "end_date") {
            values.push(new Date(value))
          } else {
            values.push(value)
          }
        }
      })

      if (setParts.length === 0) return null

      setParts.push("updated_at = NOW()")
      values.push(id)

      const result = await sql`
        UPDATE events 
        SET ${sql.unsafe(setParts.join(", "))}
        WHERE id = $${values.length}
        RETURNING *
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new DatabaseError("Failed to update event", error)
    }
  },

  async delete(id: string) {
    try {
      await sql`DELETE FROM events WHERE id = ${id}`
      return true
    } catch (error) {
      throw new DatabaseError("Failed to delete event", error)
    }
  },
}

export const articleQueries = {
  async getAll() {
    try {
      const result = await sql`
        SELECT a.*, u.first_name || ' ' || u.last_name as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        ORDER BY a.created_at DESC
      `
      return result
    } catch (error) {
      throw new DatabaseError("Failed to fetch articles", error)
    }
  },

  async create(articleData: {
    title: string
    content: string
    excerpt?: string
    author_id: string
    category?: string
    tags?: string[]
    featured_image?: string
    status?: string
  }) {
    try {
      const publishedAt = articleData.status === "published" ? new Date() : null

      const result = await sql`
        INSERT INTO articles (
          title, content, excerpt, author_id, category, tags, featured_image,
          status, published_at, created_at, updated_at
        )
        VALUES (
          ${articleData.title}, ${articleData.content}, ${articleData.excerpt || null},
          ${articleData.author_id}, ${articleData.category || null}, 
          ${JSON.stringify(articleData.tags || [])}, ${articleData.featured_image || null},
          ${articleData.status || "DRAFT"}, ${publishedAt}, NOW(), NOW()
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      throw new DatabaseError("Failed to create article", error)
    }
  },

  async update(
    id: string,
    updates: Partial<{
      title: string
      content: string
      excerpt: string
      category: string
      tags: string[]
      featured_image: string
      status: string
    }>,
  ) {
    try {
      const setParts = []
      const values = []

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = $${values.length + 1}`)
          if (key === "tags") {
            values.push(JSON.stringify(value))
          } else {
            values.push(value)
          }
        }
      })

      if (updates.status === "published") {
        setParts.push("published_at = NOW()")
      }

      if (setParts.length === 0) return null

      setParts.push("updated_at = NOW()")
      values.push(id)

      const result = await sql`
        UPDATE articles 
        SET ${sql.unsafe(setParts.join(", "))}
        WHERE id = $${values.length}
        RETURNING *
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new DatabaseError("Failed to update article", error)
    }
  },

  async delete(id: string) {
    try {
      await sql`DELETE FROM articles WHERE id = ${id}`
      return true
    } catch (error) {
      throw new DatabaseError("Failed to delete article", error)
    }
  },
}

export const membershipQueries = {
  async create(membershipData: {
    user_id: string
    membership_type?: string
    notes?: string
  }) {
    try {
      const result = await sql`
        INSERT INTO memberships (user_id, membership_type, status, notes, created_at, updated_at)
        VALUES (
          ${membershipData.user_id}, ${membershipData.membership_type || "STANDARD"},
          'PENDING', ${membershipData.notes || null}, NOW(), NOW()
        )
        RETURNING *
      `

      return result[0]
    } catch (error) {
      console.error("[v0] Database error creating membership:", error)
      throw new DatabaseError("Failed to create membership", error)
    }
  },

  async findByUserId(userId: string) {
    try {
      const result = await sql`
        SELECT * FROM memberships WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1
      `

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("[v0] Database error finding membership:", error)
      throw new DatabaseError("Failed to find membership by user ID", error)
    }
  },

  async updateStatus(id: string, status: string, notes?: string) {
    try {
      const approvalDate = status === "approved" ? new Date() : null

      const result = await sql`
        UPDATE memberships 
        SET status = ${status}, notes = ${notes || null}, approval_date = ${approvalDate}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new DatabaseError("Failed to update membership status", error)
    }
  },
}

export const downloadQueries = {
  async getAll() {
    try {
      const result = await sql`
        SELECT d.*, i.title as ideology_title
        FROM downloads d
        LEFT JOIN ideologies i ON d.ideology_id = i.id
        WHERE d.status = 'published'
        ORDER BY d.created_at DESC
      `
      return result
    } catch (error) {
      throw new DatabaseError("Failed to fetch downloads", error)
    }
  },

  async getByIdeologyId(ideologyId: string) {
    try {
      const result = await sql`
        SELECT * FROM downloads 
        WHERE ideology_id = ${ideologyId} AND status = 'published'
        ORDER BY created_at DESC
      `
      return result
    } catch (error) {
      throw new DatabaseError("Failed to fetch downloads for ideology", error)
    }
  },

  async incrementDownloadCount(id: number) {
    try {
      await sql`
        UPDATE downloads 
        SET download_count = download_count + 1
        WHERE id = ${id}
      `
      return true
    } catch (error) {
      throw new DatabaseError("Failed to increment download count", error)
    }
  },
}
