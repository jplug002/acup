-- Optional: Restore data from backup tables
-- Only run this if you want to migrate existing data

-- Restore articles from blog_articles_backup (if it has data)
-- Note: This assumes author_id mapping is correct
-- You may need to adjust the mapping based on your user table structure

-- INSERT INTO articles (
--     title, slug, excerpt, content, featured_image, 
--     author_id, category, status, views_count, likes_count,
--     published_at, created_at, updated_at
-- )
-- SELECT 
--     title, 
--     slug, 
--     excerpt, 
--     content, 
--     featured_image,
--     author_id, -- May need to map from old integer IDs to new IDs
--     'News' as category, -- Default category if not specified
--     status,
--     COALESCE(views_count, 0),
--     COALESCE(likes_count, 0),
--     published_at,
--     created_at,
--     updated_at
-- FROM blog_articles_backup
-- WHERE title IS NOT NULL;

-- Restore from articles_backup (if it has data)
-- Note: This table used UUID for author_id, may need conversion

-- After restoration, update the sequences
-- SELECT setval('articles_id_seq', (SELECT MAX(id) FROM articles));
