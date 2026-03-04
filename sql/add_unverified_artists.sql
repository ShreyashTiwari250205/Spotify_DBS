-- =============================================
-- Spotify DBS — Add Unverified Artists + Albums + Songs
-- Run this in Supabase SQL Editor
-- =============================================

-- 3 new unverified artists
INSERT INTO artist (artist_name, genre, country, verified_status) VALUES
('Drift Theory', 'Lo-Fi', 'USA', FALSE),
('Neon Fable', 'Synthwave', 'France', FALSE),
('Rust & Bloom', 'Folk', 'Ireland', FALSE);

-- 1 album per unverified artist (assume IDs 6, 7, 8 for the new artists)
-- Adjust IDs if your artist_id sequence is different
INSERT INTO album (title, release_date, artist_id) VALUES
('Quiet Signals', '2025-02-01', 6),
('Chrome Dreams', '2025-01-15', 7),
('Hollow Wood', '2025-02-20', 8);

-- 5 songs per album (assume album IDs 16, 17, 18)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
-- Drift Theory — Quiet Signals
('Slow Current', 198, '2025-02-01', 16),
('Paper Clouds', 215, '2025-02-01', 16),
('Low Tide', 182, '2025-02-01', 16),
('Warm Static', 224, '2025-02-01', 16),
('Drift Away', 207, '2025-02-01', 16),
-- Neon Fable — Chrome Dreams
('Pixel Sunset', 196, '2025-01-15', 17),
('Retrograde', 233, '2025-01-15', 17),
('Neon Rain', 188, '2025-01-15', 17),
('Cyber Bloom', 219, '2025-01-15', 17),
('Electric Dusk', 201, '2025-01-15', 17),
-- Rust & Bloom — Hollow Wood
('Morning Frost', 210, '2025-02-20', 18),
('River Stone', 192, '2025-02-20', 18),
('Open Field', 238, '2025-02-20', 18),
('Iron Bells', 185, '2025-02-20', 18),
('Last Light', 226, '2025-02-20', 18);

-- Performs entries (all Lead, no features for new artists)
-- Adjust song_id range if needed (assumes 126-140)
INSERT INTO performs (artist_id, song_id, role) VALUES
(6, 126, 'Lead'), (6, 127, 'Lead'), (6, 128, 'Lead'), (6, 129, 'Lead'), (6, 130, 'Lead'),
(7, 131, 'Lead'), (7, 132, 'Lead'), (7, 133, 'Lead'), (7, 134, 'Lead'), (7, 135, 'Lead'),
(8, 136, 'Lead'), (8, 137, 'Lead'), (8, 138, 'Lead'), (8, 139, 'Lead'), (8, 140, 'Lead');
