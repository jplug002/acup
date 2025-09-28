-- Add a notes column to the existing memberships table for admin comments
ALTER TABLE memberships 
ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES membership_applications(id);

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_memberships_application_id ON memberships(application_id);

-- Add comments to clarify table purposes
COMMENT ON TABLE membership_applications IS 'Stores detailed membership application data from the registration form';
COMMENT ON TABLE memberships IS 'Stores approved membership records with membership numbers and status';
