-- =============================================
-- Spotify DBS — Schema (PostgreSQL / Supabase)
-- BITS Pilani — DBMS Project, Semester 6
-- =============================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS listening_history CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS playlist_song CASCADE;
DROP TABLE IF EXISTS playlist CASCADE;
DROP TABLE IF EXISTS subscription CASCADE;
DROP TABLE IF EXISTS performs CASCADE;
DROP TABLE IF EXISTS song CASCADE;
DROP TABLE IF EXISTS album CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS artist CASCADE;

-- ── 1. Artist ────────────────────────────────
CREATE TABLE artist (
    artist_id   SERIAL PRIMARY KEY,
    artist_name VARCHAR(150) UNIQUE NOT NULL,
    genre       VARCHAR(100) NOT NULL,
    country     VARCHAR(100) NOT NULL,
    verified_status BOOLEAN DEFAULT TRUE
);

-- ── 2. Album ─────────────────────────────────
-- Relationship: Artist (1) → (N) Album
-- Total participation from Album side (artist_id NOT NULL)
CREATE TABLE album (
    album_id    SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    release_date DATE NOT NULL,
    artist_id   INT NOT NULL REFERENCES artist(artist_id) ON DELETE CASCADE
);

-- ── 3. Song ──────────────────────────────────
-- Relationship: Album (1) → (N) Song
-- Total participation from Song side (album_id NOT NULL)
CREATE TABLE song (
    song_id          SERIAL PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    duration_seconds INT CHECK (duration_seconds > 0),
    release_date     DATE NOT NULL,
    album_id         INT NOT NULL REFERENCES album(album_id) ON DELETE CASCADE
);

-- ── 4. Performs (Associative Entity) ─────────
-- Resolves M:N between Artist and Song
-- Composite PK: (artist_id, song_id)
CREATE TABLE performs (
    artist_id INT REFERENCES artist(artist_id) ON DELETE CASCADE,
    song_id   INT REFERENCES song(song_id) ON DELETE CASCADE,
    role      VARCHAR(20) CHECK (role IN ('Lead', 'Featured')),
    PRIMARY KEY (artist_id, song_id)
);

-- ── 5. Users ─────────────────────────────────
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    auth_id       UUID,
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(200) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    country       VARCHAR(100) NOT NULL
);

-- ── 6. Subscription ──────────────────────────
-- Relationship: User (1) → (N) Subscription
CREATE TABLE subscription (
    subscription_id SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(user_id) ON DELETE CASCADE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL CHECK (end_date > start_date),
    plan_type       VARCHAR(50) CHECK (plan_type IN ('Premium', 'Family')),
    payment_status  VARCHAR(50) CHECK (payment_status IN ('Paid', 'Pending', 'Failed'))
);

-- ── 7. Playlist ──────────────────────────────
-- Relationship: User (1) → (N) Playlist
CREATE TABLE playlist (
    playlist_id   SERIAL PRIMARY KEY,
    playlist_name VARCHAR(200) NOT NULL,
    created_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id       INT REFERENCES users(user_id) ON DELETE CASCADE
);

-- ── 8. Playlist_Song ─────────────────────────
-- Resolves M:N between Playlist and Song
-- Composite PK: (playlist_id, song_id)
CREATE TABLE playlist_song (
    playlist_id INT REFERENCES playlist(playlist_id) ON DELETE CASCADE,
    song_id     INT REFERENCES song(song_id) ON DELETE CASCADE,
    added_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id)
);

-- ── 9. Likes ─────────────────────────────────
-- Resolves M:N between User and Song
-- Composite PK: (user_id, song_id)
CREATE TABLE likes (
    user_id    INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id    INT REFERENCES song(song_id) ON DELETE CASCADE,
    liked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, song_id)
);

-- ── 10. Listening History ────────────────────
-- Composite PK: (user_id, song_id, listened_at)
-- Drives analytics
CREATE TABLE listening_history (
    user_id     INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id     INT REFERENCES song(song_id) ON DELETE CASCADE,
    listened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_type VARCHAR(50),
    PRIMARY KEY (user_id, song_id, listened_at)
);
