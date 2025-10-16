-- Add ideology_id column to downloads table to link downloads with ideologies
ALTER TABLE downloads 
ADD COLUMN IF NOT EXISTS ideology_id INTEGER REFERENCES ideologies(id) ON DELETE CASCADE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_downloads_ideology_id ON downloads(ideology_id);

-- Update existing downloads to set ideology_id based on title matching (if any exist)
UPDATE downloads d
SET ideology_id = i.id
FROM ideologies i
WHERE d.title = i.title
AND d.ideology_id IS NULL;
