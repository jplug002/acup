-- Create article_likes table for tracking user likes on articles
CREATE TABLE IF NOT EXISTS article_likes (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON article_likes(user_id);
