-- =============================================
-- Add artist_id column to users table
-- Link user accounts to artist profiles
-- Run in Supabase SQL Editor
-- =============================================

-- Add artist_id FK to users (nullable — only artist accounts have this)
ALTER TABLE users ADD COLUMN IF NOT EXISTS artist_id INT REFERENCES artist(artist_id) ON DELETE SET NULL;

-- Create user accounts for 2 unverified artists
-- Assumes Drift Theory = artist_id 6, Neon Fable = artist_id 7
-- Adjust if your IDs differ!

INSERT INTO users (name, email, date_of_birth, country, artist_id) VALUES
('Drift Theory', 'drift@spotify.dbs', '1998-05-15', 'USA', 6),
('Neon Fable', 'neon@spotify.dbs', '1995-11-22', 'France', 7);
