-- =============================================
-- Spotify DBS — Triggers & Advanced Constraints
-- Run this in Supabase SQL Editor AFTER seed data
-- =============================================

-- ══════════════════════════════════════════════
-- PART 1: Schema Additions (new columns)
-- ══════════════════════════════════════════════

-- Add play_count to song table
ALTER TABLE song ADD COLUMN IF NOT EXISTS play_count INT DEFAULT 0;

-- Add monthly_listeners to artist table
ALTER TABLE artist ADD COLUMN IF NOT EXISTS monthly_listeners INT DEFAULT 0;

-- Initialize play_count from existing listening_history
UPDATE song SET play_count = sub.cnt
FROM (
    SELECT song_id, COUNT(*) AS cnt
    FROM listening_history
    GROUP BY song_id
) AS sub
WHERE song.song_id = sub.song_id;

-- Initialize monthly_listeners from last 30 days of history
UPDATE artist SET monthly_listeners = sub.cnt
FROM (
    SELECT p.artist_id, COUNT(DISTINCT lh.user_id) AS cnt
    FROM listening_history lh
    JOIN performs p ON lh.song_id = p.song_id AND p.role = 'Lead'
    WHERE lh.listened_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.artist_id
) AS sub
WHERE artist.artist_id = sub.artist_id;

-- ══════════════════════════════════════════════
-- PART 2: Triggers
-- ══════════════════════════════════════════════

-- ── Trigger 1: Auto-increment play_count ─────
CREATE OR REPLACE FUNCTION fn_increment_play_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE song
    SET play_count = play_count + 1
    WHERE song_id = NEW.song_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_play_count ON listening_history;
CREATE TRIGGER trg_increment_play_count
    AFTER INSERT ON listening_history
    FOR EACH ROW
    EXECUTE FUNCTION fn_increment_play_count();

-- ── Trigger 2: Auto-update monthly_listeners ─
CREATE OR REPLACE FUNCTION fn_update_monthly_listeners()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE artist SET monthly_listeners = sub.cnt
    FROM (
        SELECT p.artist_id, COUNT(DISTINCT lh.user_id) AS cnt
        FROM listening_history lh
        JOIN performs p ON lh.song_id = p.song_id AND p.role = 'Lead'
        WHERE lh.listened_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY p.artist_id
    ) AS sub
    WHERE artist.artist_id = sub.artist_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_monthly_listeners ON listening_history;
CREATE TRIGGER trg_update_monthly_listeners
    AFTER INSERT ON listening_history
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_monthly_listeners();

-- ── Trigger 3: Default subscription status ───
CREATE OR REPLACE FUNCTION fn_default_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status IS NULL THEN
        NEW.payment_status := 'Pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_default_subscription_status ON subscription;
CREATE TRIGGER trg_default_subscription_status
    BEFORE INSERT ON subscription
    FOR EACH ROW
    EXECUTE FUNCTION fn_default_subscription_status();

-- ══════════════════════════════════════════════
-- PART 3: Advanced CHECK Constraints
-- ══════════════════════════════════════════════

-- Email format validation (RFC-like regex)
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_email_format;
ALTER TABLE users ADD CONSTRAINT chk_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Minimum age: 13 years
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_min_age;
ALTER TABLE users ADD CONSTRAINT chk_min_age
    CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '13 years');

-- User name must be at least 2 characters
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_name_length;
ALTER TABLE users ADD CONSTRAINT chk_name_length
    CHECK (LENGTH(TRIM(name)) >= 2);

-- Song duration: 10 seconds to 1 hour
ALTER TABLE song DROP CONSTRAINT IF EXISTS song_duration_seconds_check;
ALTER TABLE song DROP CONSTRAINT IF EXISTS chk_song_duration_range;
ALTER TABLE song ADD CONSTRAINT chk_song_duration_range
    CHECK (duration_seconds BETWEEN 10 AND 3600);

-- Song play_count cannot be negative
ALTER TABLE song DROP CONSTRAINT IF EXISTS chk_play_count_non_negative;
ALTER TABLE song ADD CONSTRAINT chk_play_count_non_negative
    CHECK (play_count >= 0);

-- Artist name must be at least 2 characters
ALTER TABLE artist DROP CONSTRAINT IF EXISTS chk_artist_name_length;
ALTER TABLE artist ADD CONSTRAINT chk_artist_name_length
    CHECK (LENGTH(TRIM(artist_name)) >= 2);

-- Artist monthly_listeners cannot be negative
ALTER TABLE artist DROP CONSTRAINT IF EXISTS chk_monthly_listeners_non_negative;
ALTER TABLE artist ADD CONSTRAINT chk_monthly_listeners_non_negative
    CHECK (monthly_listeners >= 0);

-- Album release date not more than 1 year in the future
ALTER TABLE album DROP CONSTRAINT IF EXISTS chk_album_release_date;
ALTER TABLE album ADD CONSTRAINT chk_album_release_date
    CHECK (release_date <= CURRENT_DATE + INTERVAL '1 year');

-- Subscription start_date not in the future
ALTER TABLE subscription DROP CONSTRAINT IF EXISTS chk_sub_start_not_future;
ALTER TABLE subscription ADD CONSTRAINT chk_sub_start_not_future
    CHECK (start_date <= CURRENT_DATE);

-- Subscription duration must be at least 1 day
ALTER TABLE subscription DROP CONSTRAINT IF EXISTS chk_sub_min_duration;
ALTER TABLE subscription ADD CONSTRAINT chk_sub_min_duration
    CHECK (end_date >= start_date + INTERVAL '1 day');

-- Playlist name must not be empty
ALTER TABLE playlist DROP CONSTRAINT IF EXISTS chk_playlist_name_nonempty;
ALTER TABLE playlist ADD CONSTRAINT chk_playlist_name_nonempty
    CHECK (LENGTH(TRIM(playlist_name)) >= 1);

-- ══════════════════════════════════════════════
-- Verification queries (run to confirm)
-- ══════════════════════════════════════════════

-- Check play counts populated
-- SELECT song_id, title, play_count FROM song WHERE play_count > 0 ORDER BY play_count DESC LIMIT 10;

-- Check monthly listeners populated
-- SELECT artist_id, artist_name, monthly_listeners FROM artist ORDER BY monthly_listeners DESC;

-- Test constraint: should FAIL
-- INSERT INTO users (name, email, date_of_birth, country) VALUES ('X', 'bad', '2020-01-01', 'Test');
