-- =============================================
-- Spotify DBS — Seed Data (Part 2: Performs, Users, etc.)
-- Run AFTER seed.sql (Part 1)
-- =============================================

-- ── Performs ──────────────────────────────────
-- LP pattern: 6 solo (Lead), 3 single-feature, 1 multi-feature (2 Featured)
-- EP pattern: 3 solo (Lead), 2 single-feature
-- All collaborations among the 5 core artists only

-- Album 1: Stellar Dreams (Nova Ray LP) — songs 1-10
INSERT INTO performs (artist_id, song_id, role) VALUES
(1,1,'Lead'),(1,2,'Lead'),(1,3,'Lead'),(1,4,'Lead'),(1,5,'Lead'),(1,6,'Lead'),
(1,7,'Lead'),(2,7,'Featured'),
(1,8,'Lead'),(3,8,'Featured'),
(1,9,'Lead'),(4,9,'Featured'),
(1,10,'Lead'),(5,10,'Featured'),(2,10,'Featured');

-- Album 2: Neon Horizons (Nova Ray LP) — songs 11-20
INSERT INTO performs (artist_id, song_id, role) VALUES
(1,11,'Lead'),(1,12,'Lead'),(1,13,'Lead'),(1,14,'Lead'),(1,15,'Lead'),(1,16,'Lead'),
(1,17,'Lead'),(3,17,'Featured'),
(1,18,'Lead'),(4,18,'Featured'),
(1,19,'Lead'),(5,19,'Featured'),
(1,20,'Lead'),(2,20,'Featured'),(4,20,'Featured');

-- Album 3: Midnight Sun EP (Nova Ray EP) — songs 21-25
INSERT INTO performs (artist_id, song_id, role) VALUES
(1,21,'Lead'),(1,22,'Lead'),(1,23,'Lead'),
(1,24,'Lead'),(3,24,'Featured'),
(1,25,'Lead'),(5,25,'Featured');

-- Album 4: Shadows & Light (Eclipse LP) — songs 26-35
INSERT INTO performs (artist_id, song_id, role) VALUES
(2,26,'Lead'),(2,27,'Lead'),(2,28,'Lead'),(2,29,'Lead'),(2,30,'Lead'),(2,31,'Lead'),
(2,32,'Lead'),(1,32,'Featured'),
(2,33,'Lead'),(3,33,'Featured'),
(2,34,'Lead'),(4,34,'Featured'),
(2,35,'Lead'),(5,35,'Featured'),(1,35,'Featured');

-- Album 5: Velvet Nights (Eclipse LP) — songs 36-45
INSERT INTO performs (artist_id, song_id, role) VALUES
(2,36,'Lead'),(2,37,'Lead'),(2,38,'Lead'),(2,39,'Lead'),(2,40,'Lead'),(2,41,'Lead'),
(2,42,'Lead'),(3,42,'Featured'),
(2,43,'Lead'),(4,43,'Featured'),
(2,44,'Lead'),(5,44,'Featured'),
(2,45,'Lead'),(1,45,'Featured'),(3,45,'Featured');

-- Album 6: Golden Hour EP (Eclipse EP) — songs 46-50
INSERT INTO performs (artist_id, song_id, role) VALUES
(2,46,'Lead'),(2,47,'Lead'),(2,48,'Lead'),
(2,49,'Lead'),(1,49,'Featured'),
(2,50,'Lead'),(4,50,'Featured');

-- Album 7: Concrete Jungle (Vortex LP) — songs 51-60
INSERT INTO performs (artist_id, song_id, role) VALUES
(3,51,'Lead'),(3,52,'Lead'),(3,53,'Lead'),(3,54,'Lead'),(3,55,'Lead'),(3,56,'Lead'),
(3,57,'Lead'),(1,57,'Featured'),
(3,58,'Lead'),(2,58,'Featured'),
(3,59,'Lead'),(4,59,'Featured'),
(3,60,'Lead'),(5,60,'Featured'),(1,60,'Featured');

-- Album 8: Street Symphonies (Vortex LP) — songs 61-70
INSERT INTO performs (artist_id, song_id, role) VALUES
(3,61,'Lead'),(3,62,'Lead'),(3,63,'Lead'),(3,64,'Lead'),(3,65,'Lead'),(3,66,'Lead'),
(3,67,'Lead'),(2,67,'Featured'),
(3,68,'Lead'),(4,68,'Featured'),
(3,69,'Lead'),(5,69,'Featured'),
(3,70,'Lead'),(1,70,'Featured'),(2,70,'Featured');

-- Album 9: Raw Cuts EP (Vortex EP) — songs 71-75
INSERT INTO performs (artist_id, song_id, role) VALUES
(3,71,'Lead'),(3,72,'Lead'),(3,73,'Lead'),
(3,74,'Lead'),(4,74,'Featured'),
(3,75,'Lead'),(5,75,'Featured');

-- Album 10: Wildflower (Luna Skye LP) — songs 76-85
INSERT INTO performs (artist_id, song_id, role) VALUES
(4,76,'Lead'),(4,77,'Lead'),(4,78,'Lead'),(4,79,'Lead'),(4,80,'Lead'),(4,81,'Lead'),
(4,82,'Lead'),(1,82,'Featured'),
(4,83,'Lead'),(2,83,'Featured'),
(4,84,'Lead'),(3,84,'Featured'),
(4,85,'Lead'),(5,85,'Featured'),(1,85,'Featured');

-- Album 11: Coastal Reverie (Luna Skye LP) — songs 86-95
INSERT INTO performs (artist_id, song_id, role) VALUES
(4,86,'Lead'),(4,87,'Lead'),(4,88,'Lead'),(4,89,'Lead'),(4,90,'Lead'),(4,91,'Lead'),
(4,92,'Lead'),(2,92,'Featured'),
(4,93,'Lead'),(3,93,'Featured'),
(4,94,'Lead'),(5,94,'Featured'),
(4,95,'Lead'),(1,95,'Featured'),(3,95,'Featured');

-- Album 12: Amber Glow EP (Luna Skye EP) — songs 96-100
INSERT INTO performs (artist_id, song_id, role) VALUES
(4,96,'Lead'),(4,97,'Lead'),(4,98,'Lead'),
(4,99,'Lead'),(2,99,'Featured'),
(4,100,'Lead'),(5,100,'Featured');

-- Album 13: Digital Frontier (Atlas LP) — songs 101-110
INSERT INTO performs (artist_id, song_id, role) VALUES
(5,101,'Lead'),(5,102,'Lead'),(5,103,'Lead'),(5,104,'Lead'),(5,105,'Lead'),(5,106,'Lead'),
(5,107,'Lead'),(1,107,'Featured'),
(5,108,'Lead'),(2,108,'Featured'),
(5,109,'Lead'),(3,109,'Featured'),
(5,110,'Lead'),(4,110,'Featured'),(1,110,'Featured');

-- Album 14: Pulse Wave (Atlas LP) — songs 111-120
INSERT INTO performs (artist_id, song_id, role) VALUES
(5,111,'Lead'),(5,112,'Lead'),(5,113,'Lead'),(5,114,'Lead'),(5,115,'Lead'),(5,116,'Lead'),
(5,117,'Lead'),(2,117,'Featured'),
(5,118,'Lead'),(3,118,'Featured'),
(5,119,'Lead'),(4,119,'Featured'),
(5,120,'Lead'),(1,120,'Featured'),(3,120,'Featured');

-- Album 15: Circuit EP (Atlas EP) — songs 121-125
INSERT INTO performs (artist_id, song_id, role) VALUES
(5,121,'Lead'),(5,122,'Lead'),(5,123,'Lead'),
(5,124,'Lead'),(1,124,'Featured'),
(5,125,'Lead'),(4,125,'Featured');

-- ── Users (15) ───────────────────────────────
INSERT INTO users (name, email, date_of_birth, country) VALUES
('Demo User', 'demo@spotify.dbs', '2000-05-15', 'India'),
('Shreyas M', 'shreyas@spotify.dbs', '2003-01-01', 'India'),
('Admin Panel', 'admin@spotify.dbs', '1999-06-20', 'India'),
('Arjun Patel', 'arjun@example.com', '2001-03-12', 'India'),
('Priya Sharma', 'priya@example.com', '2002-07-08', 'India'),
('Liam Chen', 'liam@example.com', '2000-11-25', 'Singapore'),
('Sarah Johnson', 'sarah@example.com', '1999-09-03', 'USA'),
('Kai Tanaka', 'kai@example.com', '2001-04-17', 'Japan'),
('Emma Wilson', 'emma@example.com', '2002-12-30', 'UK'),
('Raj Kumar', 'raj@example.com', '2000-08-14', 'India'),
('Mia Rodriguez', 'mia@example.com', '2001-06-22', 'Mexico'),
('Noah Kim', 'noah@example.com', '2003-02-09', 'South Korea'),
('Zara Ali', 'zara@example.com', '2002-10-11', 'UAE'),
('Lucas Weber', 'lucas@example.com', '2001-01-28', 'Germany'),
('Aisha Mensah', 'aisha@example.com', '2000-05-19', 'Ghana');

-- ── Subscriptions (10) ──────────────────────
INSERT INTO subscription (user_id, start_date, end_date, plan_type, payment_status) VALUES
(1, '2025-01-01', '2026-01-01', 'Premium', 'Paid'),
(2, '2025-02-01', '2026-02-01', 'Premium', 'Paid'),
(3, '2025-01-15', '2026-01-15', 'Family', 'Paid'),
(4, '2024-06-01', '2025-06-01', 'Premium', 'Paid'),
(5, '2025-03-01', '2026-03-01', 'Family', 'Pending'),
(6, '2024-01-01', '2025-01-01', 'Premium', 'Paid'),
(7, '2025-01-01', '2026-01-01', 'Premium', 'Failed'),
(8, '2025-02-15', '2026-02-15', 'Family', 'Paid'),
(10, '2025-01-01', '2026-01-01', 'Premium', 'Paid'),
(12, '2024-11-01', '2025-11-01', 'Family', 'Paid');

-- ── Playlists (8) ────────────────────────────
INSERT INTO playlist (playlist_name, created_date, user_id) VALUES
('My Favorites', '2025-01-15 10:30:00', 1),
('Workout Beats', '2025-02-01 14:00:00', 1),
('Chill Vibes', '2025-01-20 09:00:00', 2),
('Late Night Drive', '2025-02-10 22:30:00', 2),
('Top Hits 2024', '2024-12-31 23:59:00', 3),
('Road Trip Mix', '2025-01-05 08:15:00', 4),
('Study Session', '2025-02-20 16:45:00', 5),
('Party Playlist', '2025-01-28 20:00:00', 6);

-- ── Playlist Songs ───────────────────────────
INSERT INTO playlist_song (playlist_id, song_id, added_date) VALUES
(1,1,'2025-01-15 10:35:00'),(1,5,'2025-01-15 10:36:00'),(1,12,'2025-01-16 11:00:00'),
(1,28,'2025-01-17 09:20:00'),(1,45,'2025-01-18 15:30:00'),(1,67,'2025-01-20 12:00:00'),
(1,90,'2025-01-22 18:45:00'),(1,110,'2025-01-25 08:30:00'),
(2,51,'2025-02-01 14:05:00'),(2,52,'2025-02-01 14:06:00'),(2,55,'2025-02-01 14:07:00'),
(2,60,'2025-02-02 10:00:00'),(2,101,'2025-02-03 11:00:00'),
(3,76,'2025-01-20 09:05:00'),(3,78,'2025-01-20 09:06:00'),(3,80,'2025-01-21 10:00:00'),
(3,85,'2025-01-22 14:00:00'),(3,30,'2025-01-23 17:30:00'),
(4,3,'2025-02-10 22:35:00'),(4,15,'2025-02-10 22:36:00'),(4,42,'2025-02-11 01:00:00'),
(4,95,'2025-02-12 23:15:00'),
(5,1,'2024-12-31 23:59:30'),(5,11,'2024-12-31 23:59:31'),(5,26,'2024-12-31 23:59:32'),
(5,51,'2024-12-31 23:59:33'),(5,76,'2024-12-31 23:59:34'),(5,101,'2024-12-31 23:59:35'),
(6,7,'2025-01-05 08:20:00'),(6,33,'2025-01-05 08:21:00'),(6,58,'2025-01-05 08:22:00'),
(6,82,'2025-01-05 08:23:00'),(6,107,'2025-01-05 08:24:00'),
(7,4,'2025-02-20 16:50:00'),(7,29,'2025-02-20 16:51:00'),(7,54,'2025-02-20 16:52:00'),
(7,79,'2025-02-20 16:53:00'),(7,104,'2025-02-20 16:54:00'),
(8,10,'2025-01-28 20:05:00'),(8,35,'2025-01-28 20:06:00'),(8,60,'2025-01-28 20:07:00'),
(8,85,'2025-01-28 20:08:00'),(8,110,'2025-01-28 20:09:00');

-- ── Likes ────────────────────────────────────
INSERT INTO likes (user_id, song_id, liked_date) VALUES
-- User 1 (Demo)
(1,1,'2025-02-15 12:00:00'),(1,3,'2025-02-15 12:01:00'),(1,5,'2025-02-15 12:02:00'),
(1,7,'2025-02-15 12:03:00'),(1,10,'2025-02-15 12:04:00'),(1,12,'2025-02-15 12:05:00'),
(1,15,'2025-02-15 12:06:00'),(1,20,'2025-02-15 12:07:00'),(1,28,'2025-02-15 12:08:00'),
(1,33,'2025-02-15 12:09:00'),(1,45,'2025-02-15 12:10:00'),(1,51,'2025-02-15 12:11:00'),
(1,55,'2025-02-15 12:12:00'),(1,60,'2025-02-15 12:13:00'),(1,67,'2025-02-15 12:14:00'),
(1,72,'2025-02-15 12:15:00'),(1,78,'2025-02-15 12:16:00'),(1,80,'2025-02-15 12:17:00'),
(1,85,'2025-02-15 12:18:00'),(1,90,'2025-02-15 12:19:00'),(1,95,'2025-02-15 12:20:00'),
(1,100,'2025-02-15 12:21:00'),(1,105,'2025-02-15 12:22:00'),(1,110,'2025-02-15 12:23:00'),
(1,115,'2025-02-15 12:24:00'),(1,120,'2025-02-15 12:25:00'),(1,125,'2025-02-15 12:26:00'),
-- User 2
(2,2,'2025-02-10 18:30:00'),(2,8,'2025-02-10 18:31:00'),(2,14,'2025-02-10 18:32:00'),
(2,22,'2025-02-10 18:33:00'),(2,30,'2025-02-10 18:34:00'),(2,38,'2025-02-10 18:35:00'),
(2,51,'2025-02-10 18:36:00'),(2,55,'2025-02-10 18:37:00'),(2,62,'2025-02-10 18:38:00'),
(2,70,'2025-02-10 18:39:00'),(2,76,'2025-02-10 18:40:00'),(2,84,'2025-02-10 18:41:00'),
(2,90,'2025-02-10 18:42:00'),(2,98,'2025-02-10 18:43:00'),(2,108,'2025-02-10 18:44:00'),
(2,118,'2025-02-10 18:45:00'),
-- Users 4-15
(4,5,'2025-02-04 10:00:00'),(4,18,'2025-02-05 10:00:00'),(4,31,'2025-02-06 10:00:00'),
(4,44,'2025-02-07 10:00:00'),(4,57,'2025-02-08 10:00:00'),(4,70,'2025-02-09 10:00:00'),
(5,12,'2025-02-05 10:00:00'),(5,25,'2025-02-06 10:00:00'),(5,38,'2025-02-07 10:00:00'),
(5,51,'2025-02-08 10:00:00'),(5,64,'2025-02-09 10:00:00'),(5,77,'2025-02-10 10:00:00'),
(6,8,'2025-02-06 10:00:00'),(6,21,'2025-02-07 10:00:00'),(6,34,'2025-02-08 10:00:00'),
(6,47,'2025-02-09 10:00:00'),(6,60,'2025-02-10 10:00:00'),(6,73,'2025-02-11 10:00:00'),
(7,15,'2025-02-07 10:00:00'),(7,28,'2025-02-08 10:00:00'),(7,41,'2025-02-09 10:00:00'),
(7,54,'2025-02-10 10:00:00'),(7,67,'2025-02-11 10:00:00'),(7,80,'2025-02-12 10:00:00'),
(8,3,'2025-02-08 10:00:00'),(8,16,'2025-02-09 10:00:00'),(8,29,'2025-02-10 10:00:00'),
(8,42,'2025-02-11 10:00:00'),(8,55,'2025-02-12 10:00:00'),(8,68,'2025-02-13 10:00:00'),
(9,10,'2025-02-09 10:00:00'),(9,23,'2025-02-10 10:00:00'),(9,36,'2025-02-11 10:00:00'),
(9,49,'2025-02-12 10:00:00'),(9,62,'2025-02-13 10:00:00'),(9,75,'2025-02-14 10:00:00'),
(10,7,'2025-02-10 10:00:00'),(10,20,'2025-02-11 10:00:00'),(10,33,'2025-02-12 10:00:00'),
(10,46,'2025-02-13 10:00:00'),(10,59,'2025-02-14 10:00:00'),(10,72,'2025-02-15 10:00:00'),
(11,14,'2025-02-11 10:00:00'),(11,27,'2025-02-12 10:00:00'),(11,40,'2025-02-13 10:00:00'),
(11,53,'2025-02-14 10:00:00'),(11,66,'2025-02-15 10:00:00'),(11,79,'2025-02-16 10:00:00'),
(12,1,'2025-02-12 10:00:00'),(12,14,'2025-02-13 10:00:00'),(12,27,'2025-02-14 10:00:00'),
(12,40,'2025-02-15 10:00:00'),(12,53,'2025-02-16 10:00:00'),(12,66,'2025-02-17 10:00:00');
