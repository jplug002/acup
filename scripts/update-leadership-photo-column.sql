-- Update photo_url column to TEXT type to support base64 encoded images
ALTER TABLE leadership_profiles 
ALTER COLUMN photo_url TYPE TEXT;
