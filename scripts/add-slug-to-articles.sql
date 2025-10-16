-- Add slug column to articles table for SEO-friendly URLs
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Add views and likes counters (optional, for future use)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
