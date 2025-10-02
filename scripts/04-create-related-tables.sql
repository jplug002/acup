-- Create related tables for articles with proper foreign keys

-- Categories table
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE article_comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table
CREATE TABLE article_likes (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id) -- Prevent duplicate likes
);

-- Create indexes
CREATE INDEX idx_article_comments_article ON article_comments(article_id);
CREATE INDEX idx_article_comments_user ON article_comments(user_id);
CREATE INDEX idx_article_likes_article ON article_likes(article_id);
CREATE INDEX idx_article_likes_user ON article_likes(user_id);

-- Create trigger for comments updated_at
CREATE OR REPLACE FUNCTION update_article_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER article_comments_updated_at_trigger
    BEFORE UPDATE ON article_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_article_comments_updated_at();
