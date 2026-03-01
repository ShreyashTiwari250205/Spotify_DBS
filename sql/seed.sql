-- =============================================
-- Spotify DBS — Seed Data (Part 1: Artists, Albums, Songs)
-- BITS Pilani — DBMS Project, Semester 6
-- Run AFTER schema.sql
-- =============================================

-- ── Artists (5) ──────────────────────────────
INSERT INTO artist (artist_name, genre, country, verified_status) VALUES
('Nova Ray', 'Pop', 'USA', TRUE),
('Eclipse', 'R&B', 'UK', TRUE),
('Vortex', 'Hip-Hop', 'Canada', TRUE),
('Luna Skye', 'Indie', 'Australia', TRUE),
('Atlas', 'Electronic', 'Germany', TRUE);

-- ── Albums (15) ──────────────────────────────
-- Nova Ray: 2 LPs + 1 EP
INSERT INTO album (title, release_date, artist_id) VALUES
('Stellar Dreams', '2024-03-15', 1),
('Neon Horizons', '2024-09-20', 1),
('Midnight Sun EP', '2025-01-10', 1),
-- Eclipse: 2 LPs + 1 EP
('Shadows & Light', '2024-01-22', 2),
('Velvet Nights', '2024-07-14', 2),
('Golden Hour EP', '2025-02-28', 2),
-- Vortex: 2 LPs + 1 EP
('Concrete Jungle', '2023-11-05', 3),
('Street Symphonies', '2024-06-18', 3),
('Raw Cuts EP', '2025-03-01', 3),
-- Luna Skye: 2 LPs + 1 EP
('Wildflower', '2024-02-14', 4),
('Coastal Reverie', '2024-08-30', 4),
('Amber Glow EP', '2025-01-20', 4),
-- Atlas: 2 LPs + 1 EP
('Digital Frontier', '2024-04-10', 5),
('Pulse Wave', '2024-10-05', 5),
('Circuit EP', '2025-02-15', 5);

-- ── Songs (125 total) ────────────────────────
-- Album 1: Stellar Dreams (Nova Ray LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Fading Dreams', 204, '2024-03-15', 1),
('Broken Roads', 190, '2024-03-15', 1),
('Golden Ruins', 268, '2024-03-15', 1),
('Crystal Waves', 212, '2024-03-15', 1),
('Silent Fire', 195, '2024-03-15', 1),
('Hollow Stars', 234, '2024-03-15', 1),
('Electric Rain', 187, '2024-03-15', 1),
('Neon Pulse', 221, '2024-03-15', 1),
('Lost Horizon', 243, '2024-03-15', 1),
('Velvet Echoes', 256, '2024-03-15', 1);

-- Album 2: Neon Horizons (Nova Ray LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Midnight Glow', 198, '2024-09-20', 2),
('Rising Tides', 215, '2024-09-20', 2),
('Phantom Heart', 232, '2024-09-20', 2),
('Crimson Skies', 201, '2024-09-20', 2),
('Infinite Storm', 189, '2024-09-20', 2),
('Shattered Dawn', 247, '2024-09-20', 2),
('Cosmic Whisper', 176, '2024-09-20', 2),
('Radiant Bloom', 210, '2024-09-20', 2),
('Fleeting Orbit', 228, '2024-09-20', 2),
('Wild Signal', 195, '2024-09-20', 2);

-- Album 3: Midnight Sun EP (Nova Ray EP, 5 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Solar Flare', 183, '2025-01-10', 3),
('Dusk Runner', 197, '2025-01-10', 3),
('Frozen Light', 211, '2025-01-10', 3),
('Aurora Chase', 224, '2025-01-10', 3),
('Twilight Fade', 188, '2025-01-10', 3);

-- Album 4: Shadows & Light (Eclipse LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Burning Echoes', 219, '2024-01-22', 4),
('Distant Fire', 205, '2024-01-22', 4),
('Silver Rain', 238, '2024-01-22', 4),
('Hollow Lights', 192, '2024-01-22', 4),
('Velvet Heart', 217, '2024-01-22', 4),
('Shadow Bloom', 244, '2024-01-22', 4),
('Neon Ocean', 186, '2024-01-22', 4),
('Crystal Storm', 229, '2024-01-22', 4),
('Lost Dawn', 201, '2024-01-22', 4),
('Frozen Ruins', 253, '2024-01-22', 4);

-- Album 5: Velvet Nights (Eclipse LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Golden Horizon', 208, '2024-07-14', 5),
('Fading Mirror', 195, '2024-07-14', 5),
('Electric Pulse', 232, '2024-07-14', 5),
('Silent Whisper', 181, '2024-07-14', 5),
('Broken Orbit', 226, '2024-07-14', 5),
('Crimson Tide', 240, '2024-07-14', 5),
('Phantom Skies', 199, '2024-07-14', 5),
('Radiant Haze', 214, '2024-07-14', 5),
('Infinite Bloom', 237, '2024-07-14', 5),
('Wild Echoes', 191, '2024-07-14', 5);

-- Album 6: Golden Hour EP (Eclipse EP, 5 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Amber Waves', 186, '2025-02-28', 6),
('Copper Sun', 203, '2025-02-28', 6),
('Bronze Horizon', 218, '2025-02-28', 6),
('Gold Rush', 194, '2025-02-28', 6),
('Gilded Dreams', 207, '2025-02-28', 6);

-- Album 7: Concrete Jungle (Vortex LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Street Lights', 225, '2023-11-05', 7),
('Midnight Run', 198, '2023-11-05', 7),
('Concrete Heart', 241, '2023-11-05', 7),
('Urban Echo', 186, '2023-11-05', 7),
('Neon Alley', 213, '2023-11-05', 7),
('Block Party', 247, '2023-11-05', 7),
('Grind Mode', 192, '2023-11-05', 7),
('City Pulse', 228, '2023-11-05', 7),
('Corner Store', 205, '2023-11-05', 7),
('Skyline View', 260, '2023-11-05', 7);

-- Album 8: Street Symphonies (Vortex LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Bass Drop', 189, '2024-06-18', 8),
('Flow State', 216, '2024-06-18', 8),
('Cold Nights', 234, '2024-06-18', 8),
('Real Talk', 197, '2024-06-18', 8),
('Crown Royal', 221, '2024-06-18', 8),
('Paper Trail', 243, '2024-06-18', 8),
('Heavy Rotation', 185, '2024-06-18', 8),
('Night Shift', 230, '2024-06-18', 8),
('Loud Silence', 208, '2024-06-18', 8),
('Final Round', 252, '2024-06-18', 8);

-- Album 9: Raw Cuts EP (Vortex EP, 5 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Raw Energy', 195, '2025-03-01', 9),
('Uncut Gems', 210, '2025-03-01', 9),
('Pure Grit', 183, '2025-03-01', 9),
('Rough Diamond', 226, '2025-03-01', 9),
('No Filter', 198, '2025-03-01', 9);

-- Album 10: Wildflower (Luna Skye LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Petal Rain', 212, '2024-02-14', 10),
('Garden Path', 195, '2024-02-14', 10),
('Sunlit Meadow', 238, '2024-02-14', 10),
('Ivy Wall', 184, '2024-02-14', 10),
('Daisy Chain', 221, '2024-02-14', 10),
('Moss & Stone', 246, '2024-02-14', 10),
('Firefly Night', 189, '2024-02-14', 10),
('Willow Creek', 227, '2024-02-14', 10),
('Thorn & Rose', 203, '2024-02-14', 10),
('Bloom Season', 258, '2024-02-14', 10);

-- Album 11: Coastal Reverie (Luna Skye LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Ocean Breeze', 201, '2024-08-30', 11),
('Salt & Sand', 218, '2024-08-30', 11),
('Tidal Pool', 235, '2024-08-30', 11),
('Driftwood', 190, '2024-08-30', 11),
('Sea Glass', 224, '2024-08-30', 11),
('Lighthouse', 241, '2024-08-30', 11),
('Harbor Fog', 187, '2024-08-30', 11),
('Coral Reef', 232, '2024-08-30', 11),
('Sunset Pier', 206, '2024-08-30', 11),
('Wave Rider', 249, '2024-08-30', 11);

-- Album 12: Amber Glow EP (Luna Skye EP, 5 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Honey Light', 194, '2025-01-20', 12),
('Warm Ember', 211, '2025-01-20', 12),
('Candle Flame', 183, '2025-01-20', 12),
('Fireside', 228, '2025-01-20', 12),
('Lantern Walk', 197, '2025-01-20', 12);

-- Album 13: Digital Frontier (Atlas LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Binary Star', 220, '2024-04-10', 13),
('Pixel Storm', 198, '2024-04-10', 13),
('Data Stream', 243, '2024-04-10', 13),
('Cyber Pulse', 187, '2024-04-10', 13),
('Quantum Leap', 215, '2024-04-10', 13),
('Matrix Rain', 248, '2024-04-10', 13),
('Glitch Wave', 192, '2024-04-10', 13),
('Code Runner', 231, '2024-04-10', 13),
('Byte Crush', 205, '2024-04-10', 13),
('System Override', 262, '2024-04-10', 13);

-- Album 14: Pulse Wave (Atlas LP, 10 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Synth Drive', 196, '2024-10-05', 14),
('Waveform', 219, '2024-10-05', 14),
('Frequency Shift', 237, '2024-10-05', 14),
('Bass Circuit', 183, '2024-10-05', 14),
('Echo Chamber', 225, '2024-10-05', 14),
('Voltage Drop', 244, '2024-10-05', 14),
('Signal Lost', 191, '2024-10-05', 14),
('Amplitude', 228, '2024-10-05', 14),
('Phase Lock', 207, '2024-10-05', 14),
('Resonance Peak', 255, '2024-10-05', 14);

-- Album 15: Circuit EP (Atlas EP, 5 songs)
INSERT INTO song (title, duration_seconds, release_date, album_id) VALUES
('Spark Plug', 188, '2025-02-15', 15),
('Wire Mesh', 214, '2025-02-15', 15),
('Transistor', 196, '2025-02-15', 15),
('Capacitor Hum', 223, '2025-02-15', 15),
('Ground Zero', 201, '2025-02-15', 15);
