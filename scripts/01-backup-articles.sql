-- Backup existing articles data before migration
-- This creates backup tables to preserve any existing data

-- Backup blog_articles table
CREATE TABLE IF NOT EXISTS blog_articles_backup AS 
SELECT * FROM blog_articles;

-- Backup articles table
CREATE TABLE IF NOT EXISTS articles_backup AS 
SELECT * FROM articles;

-- Backup related tables
CREATE TABLE IF NOT EXISTS blog_comments_backup AS 
SELECT * FROM blog_comments;

CREATE TABLE IF NOT EXISTS article_likes_backup AS 
SELECT * FROM article_likes;

CREATE TABLE IF NOT EXISTS article_categories_backup AS 
SELECT * FROM article_categories;

-- Verify backups
SELECT 'blog_articles_backup' as table_name, COUNT(*) as row_count FROM blog_articles_backup
UNION ALL
SELECT 'articles_backup', COUNT(*) FROM articles_backup
UNION ALL
SELECT 'blog_comments_backup', COUNT(*) FROM blog_comments_backup
UNION ALL
SELECT 'article_likes_backup', COUNT(*) FROM article_likes_backup
UNION ALL
SELECT 'article_categories_backup', COUNT(*) FROM article_categories_backup;
