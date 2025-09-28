-- Create user_profiles table to store extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    membership_number VARCHAR(50) UNIQUE,
    bio TEXT,
    profile_picture TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    occupation VARCHAR(100),
    employer VARCHAR(100),
    education_level VARCHAR(50),
    political_experience TEXT,
    languages_spoken TEXT[],
    interests TEXT[],
    skills TEXT[],
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    sponsor_name VARCHAR(100),
    sponsor_id INTEGER REFERENCES users(id),
    branch_preference VARCHAR(100),
    volunteer_interests TEXT[],
    social_media_links JSONB,
    preferred_communication VARCHAR(50),
    newsletter_subscription BOOLEAN DEFAULT true,
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_membership_number ON user_profiles(membership_number);

-- Generate membership numbers automatically
CREATE OR REPLACE FUNCTION generate_membership_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.membership_number IS NULL THEN
        NEW.membership_number := 'ACUP-' || LPAD(NEW.user_id::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_membership_number
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_membership_number();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
