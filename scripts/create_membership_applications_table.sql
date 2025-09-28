-- Create a comprehensive membership_applications table to store all form data
CREATE TABLE IF NOT EXISTS membership_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
    
    -- Address Information
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    region VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Professional Information
    profession VARCHAR(255) NOT NULL,
    education VARCHAR(50) NOT NULL CHECK (education IN ('high-school', 'diploma', 'bachelor', 'master', 'doctorate', 'other')),
    professional_experience TEXT,
    key_skills TEXT,
    languages_spoken TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(50) NOT NULL,
    
    -- Political and Leadership Experience
    political_experience TEXT,
    leadership_roles TEXT,
    community_involvement TEXT,
    
    -- Motivation and Expectations
    motivation TEXT NOT NULL,
    expectations TEXT,
    volunteer_status BOOLEAN DEFAULT FALSE,
    
    -- Application Status
    application_status VARCHAR(50) DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_membership_applications_user_id ON membership_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON membership_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_membership_applications_created_at ON membership_applications(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_membership_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_membership_applications_updated_at
    BEFORE UPDATE ON membership_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_membership_applications_updated_at();
