-- Create new articles table with clean structure
-- Inspired by leadership_profiles table for consistency

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT, -- TEXT type to support base64 images like leadership photo_url
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100),
    tags TEXT[], -- Array of tags
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    display_order INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_category ON articles(category);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at_trigger
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_articles_updated_at();
