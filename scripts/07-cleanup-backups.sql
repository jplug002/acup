-- Optional: Clean up backup tables after successful migration
-- Only run this after verifying the migration was successful

-- DROP TABLE IF EXISTS blog_articles_backup;
-- DROP TABLE IF EXISTS articles_backup;
-- DROP TABLE IF EXISTS blog_comments_backup;
-- DROP TABLE IF EXISTS article_likes_backup;
-- DROP TABLE IF EXISTS article_categories_backup;

-- Verify cleanup
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name LIKE '%backup%';
