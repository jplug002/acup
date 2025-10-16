-- Optional: Seed some sample data for testing

-- Insert sample categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('News', 'news', 'Latest news and updates', '#3B82F6'),
('Events', 'events', 'Upcoming and past events', '#10B981'),
('Policy', 'policy', 'Policy discussions and proposals', '#8B5CF6'),
('Community', 'community', 'Community stories and highlights', '#F59E0B');

-- Insert sample article (optional - remove if not needed)
-- Note: Make sure you have a valid user_id in your users table
-- INSERT INTO articles (title, slug, excerpt, content, category, status, published_at) VALUES
-- ('Welcome to Our Blog', 'welcome-to-our-blog', 'This is our first blog post', 'Welcome to our new blog platform!', 'News', 'published', CURRENT_TIMESTAMP);
