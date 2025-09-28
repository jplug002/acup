-- Create downloads table for ideology documents
CREATE TABLE IF NOT EXISTS downloads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50),
    file_type VARCHAR(50),
    category VARCHAR(100) DEFAULT 'ideology',
    download_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample ideology documents
INSERT INTO downloads (title, description, file_url, file_name, file_type, category) VALUES
('ACUP Manifesto 2024', 'Our comprehensive political manifesto outlining our vision for Africa', '/downloads/acup-manifesto-2024.pdf', 'acup-manifesto-2024.pdf', 'PDF', 'ideology'),
('Democratic Governance Framework', 'Detailed framework for implementing democratic governance across Africa', '/downloads/democratic-governance-framework.pdf', 'democratic-governance-framework.pdf', 'PDF', 'ideology'),
('Pan-African Unity Policy Paper', 'Policy recommendations for strengthening continental cooperation', '/downloads/pan-african-unity-policy.pdf', 'pan-african-unity-policy.pdf', 'PDF', 'ideology'),
('Economic Empowerment Strategy', 'Strategic plan for inclusive economic development', '/downloads/economic-empowerment-strategy.pdf', 'economic-empowerment-strategy.pdf', 'PDF', 'ideology');
