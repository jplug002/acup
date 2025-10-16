-- Create leadership profiles table
CREATE TABLE IF NOT EXISTS leadership_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    photo_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leadership_status ON leadership_profiles(status);
CREATE INDEX IF NOT EXISTS idx_leadership_order ON leadership_profiles(display_order);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_leadership_profiles_updated_at BEFORE UPDATE ON leadership_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample leadership profiles
INSERT INTO leadership_profiles (name, role, title, bio, display_order, status) VALUES
('Party President', 'Chief Executive Officer', 'President', 'Leading the vision for African continental unity through democratic governance and progressive policies.', 1, 'active'),
('Vice President', 'Deputy Leader', 'Vice President', 'Supporting strategic initiatives and coordinating regional development programs across Africa.', 2, 'active'),
('Secretary General', 'Operations Director', 'Secretary', 'Managing party operations and ensuring effective communication across all continental branches.', 3, 'active')
ON CONFLICT DO NOTHING;
