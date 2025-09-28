-- Creating all required tables for the ACUP application
-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS membership_applications CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS ideologies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ideologies table
CREATE TABLE ideologies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches table
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Nigeria',
    contact_info TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create memberships table
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    membership_type VARCHAR(100) DEFAULT 'REGULAR',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create membership_applications table
CREATE TABLE membership_applications (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    occupation VARCHAR(255),
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    application_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
-- Insert admin user
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@acup.org', '$2b$10$example.hash.here', 'Admin', 'User', 'ADMIN');

-- Insert sample ideologies
INSERT INTO ideologies (title, content) VALUES
('Unity and Progress', 'Our core belief in bringing together all Africans for collective progress and development.'),
('Pan-Africanism', 'Promoting solidarity and cooperation among African nations and peoples worldwide.'),
('Economic Empowerment', 'Fostering economic growth and self-reliance across African communities.');

-- Insert sample branches
INSERT INTO branches (name, location, country) VALUES
('Lagos Branch', 'Lagos, Nigeria', 'Nigeria'),
('Abuja Branch', 'Abuja, Nigeria', 'Nigeria'),
('Accra Branch', 'Accra, Ghana', 'Ghana');

-- Insert sample events
INSERT INTO events (title, event_date, location, description) VALUES
('Annual Unity Conference', '2024-12-15 10:00:00', 'Lagos Convention Center', 'Our flagship annual conference bringing together members from across Africa.'),
('Youth Leadership Summit', '2024-11-20 09:00:00', 'Abuja International Center', 'Empowering the next generation of African leaders.'),
('Economic Development Forum', '2024-10-30 14:00:00', 'Accra Business District', 'Discussing strategies for African economic growth.');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_branches_country ON branches(country);
CREATE INDEX idx_membership_applications_status ON membership_applications(status);
