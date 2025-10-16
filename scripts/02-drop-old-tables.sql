-- Drop old article-related tables and their dependencies
-- This cleans up the conflicting table structures

-- Drop dependent tables first (foreign key constraints)
DROP TABLE IF EXISTS article_categories CASCADE;
DROP TABLE IF EXISTS article_likes CASCADE;
DROP TABLE IF EXISTS blog_comments CASCADE;

-- Drop the main article tables
DROP TABLE IF EXISTS blog_articles CASCADE;
DROP TABLE IF EXISTS articles CASCADE;

-- Drop blog_categories if it exists (we'll recreate if needed)
DROP TABLE IF EXISTS blog_categories CASCADE;

-- Verify tables are dropped
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('articles', 'blog_articles', 'article_likes', 'article_categories', 'blog_comments', 'blog_categories');
