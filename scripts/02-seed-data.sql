-- Adding sample data for development and testing
-- Insert sample branches
INSERT INTO branches (name, country, city, address, contact_email, contact_phone, description, established_date) VALUES
('ACUP Ghana', 'Ghana', 'Accra', '123 Independence Avenue, Accra', 'ghana@acup.org', '+233-20-123-4567', 'The Ghana branch of ACUP, working towards African unity and development.', '2020-01-15'),
('ACUP South Africa', 'South Africa', 'Cape Town', '456 Nelson Mandela Boulevard, Cape Town', 'southafrica@acup.org', '+27-21-987-6543', 'South African chapter promoting Pan-African ideals and economic cooperation.', '2019-06-20'),
('ACUP Nigeria', 'Nigeria', 'Lagos', '789 Victoria Island, Lagos', 'nigeria@acup.org', '+234-1-555-0123', 'Nigerian branch focusing on youth empowerment and continental integration.', '2020-03-10'),
('ACUP Kenya', 'Kenya', 'Nairobi', '321 Uhuru Highway, Nairobi', 'kenya@acup.org', '+254-20-456-7890', 'Kenyan chapter advocating for East African unity and development.', '2020-08-05');

-- Insert sample ideologies
INSERT INTO ideologies (title, description, category, priority) VALUES
('African Unity', 'Promoting political and economic integration across the African continent to create a stronger, unified Africa.', 'Political', 1),
('Economic Empowerment', 'Fostering economic development through intra-African trade, industrialization, and resource management.', 'Economic', 2),
('Cultural Renaissance', 'Celebrating and preserving African cultures, languages, and traditions while promoting cultural exchange.', 'Cultural', 3),
('Youth Leadership', 'Empowering young Africans to take leadership roles in politics, business, and social development.', 'Social', 4),
('Environmental Sustainability', 'Promoting sustainable development practices and environmental conservation across Africa.', 'Environmental', 5),
('Education for All', 'Ensuring quality education access for all Africans and promoting knowledge sharing across the continent.', 'Educational', 6);

-- Insert sample events
INSERT INTO events (title, description, event_date, end_date, location, event_type, max_attendees, registration_required) VALUES
('Pan-African Unity Summit 2024', 'Annual summit bringing together African leaders and youth to discuss continental unity and development strategies.', '2024-07-15 09:00:00+00', '2024-07-17 18:00:00+00', 'Addis Ababa, Ethiopia', 'conference', 500, true),
('Youth Leadership Workshop', 'Interactive workshop focused on developing leadership skills among young African professionals.', '2024-05-20 10:00:00+00', '2024-05-20 16:00:00+00', 'Lagos, Nigeria', 'workshop', 100, true),
('Economic Integration Forum', 'Forum discussing strategies for enhancing intra-African trade and economic cooperation.', '2024-06-10 14:00:00+00', '2024-06-11 17:00:00+00', 'Cape Town, South Africa', 'conference', 200, true),
('Cultural Heritage Festival', 'Celebration of African cultures, arts, and traditions from across the continent.', '2024-08-25 12:00:00+00', '2024-08-25 20:00:00+00', 'Accra, Ghana', 'general', 1000, false);

-- Insert sample admin user
INSERT INTO users (email, password_hash, name, phone, country, city, occupation, role, email_verified) VALUES
('admin@acup.org', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'ACUP Administrator', '+1-555-0100', 'Ghana', 'Accra', 'Political Organizer', 'admin', true);

-- Insert sample articles
INSERT INTO articles (title, content, excerpt, author_id, category, tags, status, published_at) VALUES
('The Future of African Unity', 'Africa stands at a crossroads. With 54 diverse nations, each with its own rich history, culture, and challenges, the dream of a united Africa has never been more relevant...', 'Exploring the path towards greater African integration and unity in the 21st century.', (SELECT id FROM users WHERE email = 'admin@acup.org'), 'Politics', ARRAY['unity', 'politics', 'africa'], 'published', NOW() - INTERVAL '7 days'),
('Youth Empowerment in Modern Africa', 'The youth of Africa represent the continent''s greatest asset. With over 60% of Africa''s population under the age of 25, young people are not just the future—they are the present...', 'How young Africans are driving change and innovation across the continent.', (SELECT id FROM users WHERE email = 'admin@acup.org'), 'Social', ARRAY['youth', 'empowerment', 'development'], 'published', NOW() - INTERVAL '3 days'),
('Economic Integration: The African Continental Free Trade Area', 'The African Continental Free Trade Area (AfCFTA) represents a historic milestone in Africa''s journey towards economic integration...', 'Understanding the impact and potential of the AfCFTA on African economies.', (SELECT id FROM users WHERE email = 'admin@acup.org'), 'Economics', ARRAY['trade', 'economics', 'integration'], 'published', NOW() - INTERVAL '1 day');
