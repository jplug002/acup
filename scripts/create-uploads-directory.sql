-- SQL script to document the uploads directory structure
-- This is a documentation file - the actual directory is created by the Node.js code

-- Directory Structure:
-- public/
--   uploads/
--     ideologies/     -- Ideology documents (PDF, DOCX)
--     articles/       -- Article images and attachments
--     leadership/     -- Leadership profile photos
--     general/        -- Other uploads

-- The downloads table stores references to these files:
-- file_url: The public path (e.g., /uploads/ideologies/document-123.pdf)
-- file_name: The actual filename on disk
-- file_type: MIME type of the file
-- file_size: Human-readable size (e.g., "2.5 MB")

-- Note: Files are automatically organized into subfolders based on their category
