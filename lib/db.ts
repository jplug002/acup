import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

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

// User operations
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
      const result = await sql`
        INSERT INTO users (email, password_hash, name, phone, country, city, date_of_birth, occupation, education, interests)
        VALUES (${userData.email}, ${userData.password_hash}, ${userData.name}, ${userData.phone || null}, 
                ${userData.country || null}, ${userData.city || null}, ${userData.date_of_birth || null}, 
                ${userData.occupation || null}, ${userData.education || null}, ${userData.interests || null})
        RETURNING id, email, name, phone, country, city, date_of_birth, occupation, education, interests, role, created_at
      `
      return result[0]
    } catch (error) {
      throw new DatabaseError("Failed to create user", error)
    }
  },

  async findByEmail(email: string) {
    try {
      const result = await sql`
        SELECT id, email, password_hash, name, phone, country, city, date_of_birth, occupation, education, interests, role, email_verified, created_at
        FROM users 
        WHERE email = ${email}
      `
      return result[0] || null
    } catch (error) {
      throw new DatabaseError("Failed to find user by email", error)
    }
  },

  async findById(id: string) {
    try {
      const result = await sql`
        SELECT id, email, name, phone, country, city, date_of_birth, occupation, education, interests, role, email_verified, created_at
        FROM users 
        WHERE id = ${id}
      `
      return result[0] || null
    } catch (error) {
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
      const setClause = Object.entries(updates)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key} = $${key}`)
        .join(", ")

      if (!setClause) return null

      const result = await sql`
        UPDATE users 
        SET ${sql.unsafe(setClause)}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, email, name, phone, country, city, date_of_birth, occupation, education, interests, role, created_at, updated_at
      `
      return result[0] || null
    } catch (error) {
      throw new DatabaseError("Failed to update user", error)
    }
  },
}

// Branch operations
export const branchQueries = {
  async getAll() {
    try {
      return await sql`
        SELECT * FROM branches 
        ORDER BY created_at DESC
      `
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
        INSERT INTO branches (name, country, city, address, contact_email, contact_phone, description, established_date)
        VALUES (${branchData.name}, ${branchData.country}, ${branchData.city}, ${branchData.address || null},
                ${branchData.contact_email || null}, ${branchData.contact_phone || null}, 
                ${branchData.description || null}, ${branchData.established_date || null})
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
      const result = await sql`
        UPDATE branches 
        SET ${sql.unsafe(
          Object.entries(updates)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(", "),
        )}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] || null
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

// Ideology operations
export const ideologyQueries = {
  async getAll() {
    try {
      return await sql`
        SELECT * FROM ideologies 
        ORDER BY priority ASC, created_at DESC
      `
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
        INSERT INTO ideologies (title, description, category, priority)
        VALUES (${ideologyData.title}, ${ideologyData.description}, 
                ${ideologyData.category || null}, ${ideologyData.priority || 0})
        RETURNING *
      `
      return result[0]
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
      const result = await sql`
        UPDATE ideologies 
        SET ${sql.unsafe(
          Object.entries(updates)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(", "),
        )}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      throw new DatabaseError("Failed to update ideology", error)
    }
  },

  async delete(id: string) {
    try {
      await sql`DELETE FROM ideologies WHERE id = ${id}`
      return true
    } catch (error) {
      throw new DatabaseError("Failed to delete ideology", error)
    }
  },
}

// Event operations
export const eventQueries = {
  async getAll() {
    try {
      return await sql`
        SELECT * FROM events 
        ORDER BY event_date DESC
      `
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
        INSERT INTO events (title, description, event_date, end_date, location, event_type, max_attendees, registration_required)
        VALUES (${eventData.title}, ${eventData.description}, ${eventData.event_date}, 
                ${eventData.end_date || null}, ${eventData.location || null}, 
                ${eventData.event_type || "general"}, ${eventData.max_attendees || null}, 
                ${eventData.registration_required || false})
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
      const result = await sql`
        UPDATE events 
        SET ${sql.unsafe(
          Object.entries(updates)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(", "),
        )}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] || null
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

// Article operations
export const articleQueries = {
  async getAll() {
    try {
      return await sql`
        SELECT a.*, u.name as author_name 
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        ORDER BY a.created_at DESC
      `
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
      const result = await sql`
        INSERT INTO articles (title, content, excerpt, author_id, category, tags, featured_image, status, published_at)
        VALUES (${articleData.title}, ${articleData.content}, ${articleData.excerpt || null}, 
                ${articleData.author_id}, ${articleData.category || null}, 
                ${articleData.tags || []}, ${articleData.featured_image || null}, 
                ${articleData.status || "draft"}, 
                ${articleData.status === "published" ? "NOW()" : null})
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
      const publishedAt = updates.status === "published" ? ", published_at = NOW()" : ""
      const result = await sql`
        UPDATE articles 
        SET ${sql.unsafe(
          Object.entries(updates)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(", "),
        )}, 
            updated_at = NOW() ${sql.unsafe(publishedAt)}
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] || null
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

// Membership operations
export const membershipQueries = {
  async create(membershipData: {
    user_id: string
    membership_type?: string
    notes?: string
  }) {
    try {
      // Generate membership number
      const membershipNumber = `ACUP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      const result = await sql`
        INSERT INTO memberships (user_id, membership_type, membership_number, notes)
        VALUES (${membershipData.user_id}, ${membershipData.membership_type || "standard"}, 
                ${membershipNumber}, ${membershipData.notes || null})
        RETURNING *
      `
      return result[0]
    } catch (error) {
      throw new DatabaseError("Failed to create membership", error)
    }
  },

  async findByUserId(userId: string) {
    try {
      const result = await sql`
        SELECT m.*, u.name as user_name, u.email as user_email
        FROM memberships m
        JOIN users u ON m.user_id = u.id
        WHERE m.user_id = ${userId}
        ORDER BY m.created_at DESC
        LIMIT 1
      `
      return result[0] || null
    } catch (error) {
      throw new DatabaseError("Failed to find membership by user ID", error)
    }
  },

  async updateStatus(id: string, status: string, notes?: string) {
    try {
      const approvalDate = status === "approved" ? ", approval_date = NOW()" : ""
      const result = await sql`
        UPDATE memberships 
        SET status = ${status}, notes = ${notes || null}, updated_at = NOW() ${sql.unsafe(approvalDate)}
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] || null
    } catch (error) {
      throw new DatabaseError("Failed to update membership status", error)
    }
  },
}
