-- Add missing columns to articles table for blog functionality
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Update existing articles to have slugs if they don't
UPDATE articles 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9 -]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;
