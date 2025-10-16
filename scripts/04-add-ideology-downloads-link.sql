-- Add ideology_id column to downloads table to link downloads with ideologies
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ideology_id UUID REFERENCES ideologies(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_downloads_ideology_id ON downloads(ideology_id);
