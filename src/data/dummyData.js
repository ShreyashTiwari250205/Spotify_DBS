// ========================================
// DUMMY DATA — Spotify DBS Project
// Mirrors the relational schema exactly.
// Replace with Supabase queries later.
// ========================================

// ── Artists ──────────────────────────────
export const artists = [
    { artist_id: 1, artist_name: 'Nova Ray', genre: 'Pop', country: 'USA', verified_status: true, image: 'https://picsum.photos/seed/nova/400/400', monthly_listeners: 4820000 },
    { artist_id: 2, artist_name: 'Eclipse', genre: 'R&B', country: 'UK', verified_status: true, image: 'https://picsum.photos/seed/eclipse/400/400', monthly_listeners: 3150000 },
    { artist_id: 3, artist_name: 'Vortex', genre: 'Hip-Hop', country: 'Canada', verified_status: true, image: 'https://picsum.photos/seed/vortex/400/400', monthly_listeners: 5600000 },
    { artist_id: 4, artist_name: 'Luna Skye', genre: 'Indie', country: 'Australia', verified_status: true, image: 'https://picsum.photos/seed/luna/400/400', monthly_listeners: 2730000 },
    { artist_id: 5, artist_name: 'Atlas', genre: 'Electronic', country: 'Germany', verified_status: true, image: 'https://picsum.photos/seed/atlas/400/400', monthly_listeners: 3980000 },
];

// ── Albums ────────────────────────────────
// Each artist: 2 LPs (10 songs) + 1 EP (5 songs) = 25 songs each
export const albums = [
    // Nova Ray
    { album_id: 1, title: 'Stellar Dreams', release_date: '2024-03-15', artist_id: 1, type: 'LP', cover: 'https://picsum.photos/seed/stellar/300/300' },
    { album_id: 2, title: 'Neon Horizons', release_date: '2024-09-20', artist_id: 1, type: 'LP', cover: 'https://picsum.photos/seed/neon/300/300' },
    { album_id: 3, title: 'Midnight Sun EP', release_date: '2025-01-10', artist_id: 1, type: 'EP', cover: 'https://picsum.photos/seed/midnight/300/300' },
    // Eclipse
    { album_id: 4, title: 'Shadows & Light', release_date: '2024-01-22', artist_id: 2, type: 'LP', cover: 'https://picsum.photos/seed/shadows/300/300' },
    { album_id: 5, title: 'Velvet Nights', release_date: '2024-07-14', artist_id: 2, type: 'LP', cover: 'https://picsum.photos/seed/velvet/300/300' },
    { album_id: 6, title: 'Golden Hour EP', release_date: '2025-02-28', artist_id: 2, type: 'EP', cover: 'https://picsum.photos/seed/golden/300/300' },
    // Vortex
    { album_id: 7, title: 'Concrete Jungle', release_date: '2023-11-05', artist_id: 3, type: 'LP', cover: 'https://picsum.photos/seed/concrete/300/300' },
    { album_id: 8, title: 'Street Symphonies', release_date: '2024-06-18', artist_id: 3, type: 'LP', cover: 'https://picsum.photos/seed/street/300/300' },
    { album_id: 9, title: 'Raw Cuts EP', release_date: '2025-03-01', artist_id: 3, type: 'EP', cover: 'https://picsum.photos/seed/rawcuts/300/300' },
    // Luna Skye
    { album_id: 10, title: 'Wildflower', release_date: '2024-02-14', artist_id: 4, type: 'LP', cover: 'https://picsum.photos/seed/wildflower/300/300' },
    { album_id: 11, title: 'Coastal Reverie', release_date: '2024-08-30', artist_id: 4, type: 'LP', cover: 'https://picsum.photos/seed/coastal/300/300' },
    { album_id: 12, title: 'Amber Glow EP', release_date: '2025-01-20', artist_id: 4, type: 'EP', cover: 'https://picsum.photos/seed/amber/300/300' },
    // Atlas
    { album_id: 13, title: 'Digital Frontier', release_date: '2024-04-10', artist_id: 5, type: 'LP', cover: 'https://picsum.photos/seed/digital/300/300' },
    { album_id: 14, title: 'Pulse Wave', release_date: '2024-10-05', artist_id: 5, type: 'LP', cover: 'https://picsum.photos/seed/pulse/300/300' },
    { album_id: 15, title: 'Circuit EP', release_date: '2025-02-15', artist_id: 5, type: 'EP', cover: 'https://picsum.photos/seed/circuit/300/300' },
];

// ── Helper to generate songs ──────────────
function generateAlbumSongs(albumId, albumTitle, artistId, startId, count) {
    const adjectives = ['Burning', 'Fading', 'Electric', 'Silent', 'Broken', 'Crystal', 'Hollow', 'Golden', 'Frozen', 'Velvet', 'Neon', 'Lost', 'Wild', 'Crimson', 'Shadow', 'Midnight', 'Rising', 'Falling', 'Distant', 'Infinite', 'Shattered', 'Phantom', 'Radiant', 'Fleeting', 'Cosmic'];
    const nouns = ['Echoes', 'Dreams', 'Fire', 'Rain', 'Lights', 'Waves', 'Heart', 'Skies', 'Roads', 'Stars', 'Flames', 'Ocean', 'Storm', 'Dawn', 'Dusk', 'Ruins', 'Horizon', 'Mirror', 'Pulse', 'Whisper', 'Orbit', 'Signal', 'Bloom', 'Tide', 'Haze'];
    const songs = [];
    for (let i = 0; i < count; i++) {
        const adj = adjectives[(startId + i * 3) % adjectives.length];
        const noun = nouns[(startId + i * 7) % nouns.length];
        songs.push({
            song_id: startId + i,
            title: `${adj} ${noun}`,
            duration_seconds: 180 + Math.floor(Math.random() * 120),
            release_date: albums.find(a => a.album_id === albumId).release_date,
            album_id: albumId,
        });
    }
    return songs;
}

// Generate all 125 songs
export const songs = [];
let songId = 1;
for (const album of albums) {
    const count = album.type === 'LP' ? 10 : 5;
    songs.push(...generateAlbumSongs(album.album_id, album.title, album.artist_id, songId, count));
    songId += count;
}

// ── Performs (Artist ↔ Song, M:N) ─────────
// LP: 6 solo, 3 single-feature, 1 multi-feature (2 featured)
// EP: 3 solo, 2 single-feature
function getOtherArtists(artistId) {
    return [1, 2, 3, 4, 5].filter(id => id !== artistId);
}

export const performs = [];
for (const album of albums) {
    const albumSongs = songs.filter(s => s.album_id === album.album_id);
    const mainArtist = album.artist_id;
    const others = getOtherArtists(mainArtist);

    if (album.type === 'LP') {
        // 6 solo (indices 0-5)
        for (let i = 0; i < 6; i++) {
            performs.push({ artist_id: mainArtist, song_id: albumSongs[i].song_id, role: 'Lead' });
        }
        // 3 single-feature (indices 6-8)
        for (let i = 6; i < 9; i++) {
            performs.push({ artist_id: mainArtist, song_id: albumSongs[i].song_id, role: 'Lead' });
            performs.push({ artist_id: others[(i - 6) % others.length], song_id: albumSongs[i].song_id, role: 'Featured' });
        }
        // 1 multi-feature (index 9)
        performs.push({ artist_id: mainArtist, song_id: albumSongs[9].song_id, role: 'Lead' });
        performs.push({ artist_id: others[3 % others.length], song_id: albumSongs[9].song_id, role: 'Featured' });
        performs.push({ artist_id: others[(3 + 1) % others.length], song_id: albumSongs[9].song_id, role: 'Featured' });
    } else {
        // EP: 3 solo (indices 0-2)
        for (let i = 0; i < 3; i++) {
            performs.push({ artist_id: mainArtist, song_id: albumSongs[i].song_id, role: 'Lead' });
        }
        // 2 single-feature (indices 3-4)
        for (let i = 3; i < 5; i++) {
            performs.push({ artist_id: mainArtist, song_id: albumSongs[i].song_id, role: 'Lead' });
            performs.push({ artist_id: others[(i - 3 + 2) % others.length], song_id: albumSongs[i].song_id, role: 'Featured' });
        }
    }
}

// ── Users ─────────────────────────────────
export const users = [
    // 3 demo accounts
    { user_id: 1, name: 'Demo User', email: 'demo@spotify.dbs', date_of_birth: '2000-05-15', country: 'India', password: 'demo123' },
    { user_id: 2, name: 'Shreyas M', email: 'shreyas@spotify.dbs', date_of_birth: '2003-01-01', country: 'India', password: 'demo123' },
    { user_id: 3, name: 'Admin Panel', email: 'admin@spotify.dbs', date_of_birth: '1999-06-20', country: 'India', password: 'admin123' },
    // Regular users
    { user_id: 4, name: 'Arjun Patel', email: 'arjun@example.com', date_of_birth: '2001-03-12', country: 'India', password: 'pass123' },
    { user_id: 5, name: 'Priya Sharma', email: 'priya@example.com', date_of_birth: '2002-07-08', country: 'India', password: 'pass123' },
    { user_id: 6, name: 'Liam Chen', email: 'liam@example.com', date_of_birth: '2000-11-25', country: 'Singapore', password: 'pass123' },
    { user_id: 7, name: 'Sarah Johnson', email: 'sarah@example.com', date_of_birth: '1999-09-03', country: 'USA', password: 'pass123' },
    { user_id: 8, name: 'Kai Tanaka', email: 'kai@example.com', date_of_birth: '2001-04-17', country: 'Japan', password: 'pass123' },
    { user_id: 9, name: 'Emma Wilson', email: 'emma@example.com', date_of_birth: '2002-12-30', country: 'UK', password: 'pass123' },
    { user_id: 10, name: 'Raj Kumar', email: 'raj@example.com', date_of_birth: '2000-08-14', country: 'India', password: 'pass123' },
    { user_id: 11, name: 'Mia Rodriguez', email: 'mia@example.com', date_of_birth: '2001-06-22', country: 'Mexico', password: 'pass123' },
    { user_id: 12, name: 'Noah Kim', email: 'noah@example.com', date_of_birth: '2003-02-09', country: 'South Korea', password: 'pass123' },
    { user_id: 13, name: 'Zara Ali', email: 'zara@example.com', date_of_birth: '2002-10-11', country: 'UAE', password: 'pass123' },
    { user_id: 14, name: 'Lucas Weber', email: 'lucas@example.com', date_of_birth: '2001-01-28', country: 'Germany', password: 'pass123' },
    { user_id: 15, name: 'Aisha Mensah', email: 'aisha@example.com', date_of_birth: '2000-05-19', country: 'Ghana', password: 'pass123' },
];

// ── Subscriptions ─────────────────────────
export const subscriptions = [
    { subscription_id: 1, user_id: 1, start_date: '2025-01-01', end_date: '2026-01-01', plan_type: 'Premium', payment_status: 'Paid' },
    { subscription_id: 2, user_id: 2, start_date: '2025-02-01', end_date: '2026-02-01', plan_type: 'Premium', payment_status: 'Paid' },
    { subscription_id: 3, user_id: 3, start_date: '2025-01-15', end_date: '2026-01-15', plan_type: 'Family', payment_status: 'Paid' },
    { subscription_id: 4, user_id: 4, start_date: '2024-06-01', end_date: '2025-06-01', plan_type: 'Premium', payment_status: 'Paid' },
    { subscription_id: 5, user_id: 5, start_date: '2025-03-01', end_date: '2026-03-01', plan_type: 'Family', payment_status: 'Pending' },
    { subscription_id: 6, user_id: 6, start_date: '2024-01-01', end_date: '2025-01-01', plan_type: 'Premium', payment_status: 'Paid' },
    { subscription_id: 7, user_id: 7, start_date: '2025-01-01', end_date: '2026-01-01', plan_type: 'Premium', payment_status: 'Failed' },
    { subscription_id: 8, user_id: 8, start_date: '2025-02-15', end_date: '2026-02-15', plan_type: 'Family', payment_status: 'Paid' },
    { subscription_id: 9, user_id: 10, start_date: '2025-01-01', end_date: '2026-01-01', plan_type: 'Premium', payment_status: 'Paid' },
    { subscription_id: 10, user_id: 12, start_date: '2024-11-01', end_date: '2025-11-01', plan_type: 'Family', payment_status: 'Paid' },
];

// ── Playlists ─────────────────────────────
export const playlists = [
    { playlist_id: 1, playlist_name: 'My Favorites', created_date: '2025-01-15T10:30:00', user_id: 1 },
    { playlist_id: 2, playlist_name: 'Workout Beats', created_date: '2025-02-01T14:00:00', user_id: 1 },
    { playlist_id: 3, playlist_name: 'Chill Vibes', created_date: '2025-01-20T09:00:00', user_id: 2 },
    { playlist_id: 4, playlist_name: 'Late Night Drive', created_date: '2025-02-10T22:30:00', user_id: 2 },
    { playlist_id: 5, playlist_name: 'Top Hits 2024', created_date: '2024-12-31T23:59:00', user_id: 3 },
    { playlist_id: 6, playlist_name: 'Road Trip Mix', created_date: '2025-01-05T08:15:00', user_id: 4 },
    { playlist_id: 7, playlist_name: 'Study Session', created_date: '2025-02-20T16:45:00', user_id: 5 },
    { playlist_id: 8, playlist_name: 'Party Playlist', created_date: '2025-01-28T20:00:00', user_id: 6 },
];

// ── Playlist Songs ────────────────────────
export const playlistSongs = [
    // My Favorites (playlist 1)
    { playlist_id: 1, song_id: 1, added_date: '2025-01-15T10:35:00' },
    { playlist_id: 1, song_id: 5, added_date: '2025-01-15T10:36:00' },
    { playlist_id: 1, song_id: 12, added_date: '2025-01-16T11:00:00' },
    { playlist_id: 1, song_id: 28, added_date: '2025-01-17T09:20:00' },
    { playlist_id: 1, song_id: 45, added_date: '2025-01-18T15:30:00' },
    { playlist_id: 1, song_id: 67, added_date: '2025-01-20T12:00:00' },
    { playlist_id: 1, song_id: 90, added_date: '2025-01-22T18:45:00' },
    { playlist_id: 1, song_id: 110, added_date: '2025-01-25T08:30:00' },
    // Workout Beats (playlist 2)
    { playlist_id: 2, song_id: 51, added_date: '2025-02-01T14:05:00' },
    { playlist_id: 2, song_id: 52, added_date: '2025-02-01T14:06:00' },
    { playlist_id: 2, song_id: 55, added_date: '2025-02-01T14:07:00' },
    { playlist_id: 2, song_id: 60, added_date: '2025-02-02T10:00:00' },
    { playlist_id: 2, song_id: 101, added_date: '2025-02-03T11:00:00' },
    // Chill Vibes (playlist 3)
    { playlist_id: 3, song_id: 76, added_date: '2025-01-20T09:05:00' },
    { playlist_id: 3, song_id: 78, added_date: '2025-01-20T09:06:00' },
    { playlist_id: 3, song_id: 80, added_date: '2025-01-21T10:00:00' },
    { playlist_id: 3, song_id: 85, added_date: '2025-01-22T14:00:00' },
    { playlist_id: 3, song_id: 30, added_date: '2025-01-23T17:30:00' },
    // Late Night Drive (playlist 4)
    { playlist_id: 4, song_id: 3, added_date: '2025-02-10T22:35:00' },
    { playlist_id: 4, song_id: 15, added_date: '2025-02-10T22:36:00' },
    { playlist_id: 4, song_id: 42, added_date: '2025-02-11T01:00:00' },
    { playlist_id: 4, song_id: 95, added_date: '2025-02-12T23:15:00' },
    // Top Hits 2024 (playlist 5)
    { playlist_id: 5, song_id: 1, added_date: '2024-12-31T23:59:30' },
    { playlist_id: 5, song_id: 11, added_date: '2024-12-31T23:59:31' },
    { playlist_id: 5, song_id: 26, added_date: '2024-12-31T23:59:32' },
    { playlist_id: 5, song_id: 51, added_date: '2024-12-31T23:59:33' },
    { playlist_id: 5, song_id: 76, added_date: '2024-12-31T23:59:34' },
    { playlist_id: 5, song_id: 101, added_date: '2024-12-31T23:59:35' },
];

// ── Likes ─────────────────────────────────
export const likes = [];
// Simulate likes: demo users like many songs
const demoLikes = [1, 3, 5, 7, 10, 12, 15, 20, 28, 33, 45, 51, 55, 60, 67, 72, 78, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125];
for (const sid of demoLikes) {
    if (songs.find(s => s.song_id === sid)) {
        likes.push({ user_id: 1, song_id: sid, liked_date: '2025-02-15T12:00:00' });
    }
}
const user2Likes = [2, 8, 14, 22, 30, 38, 51, 55, 62, 70, 76, 84, 90, 98, 108, 118];
for (const sid of user2Likes) {
    if (songs.find(s => s.song_id === sid)) {
        likes.push({ user_id: 2, song_id: sid, liked_date: '2025-02-10T18:30:00' });
    }
}
// Other users like a few songs each
for (let uid = 4; uid <= 15; uid++) {
    for (let i = 0; i < 8; i++) {
        const sid = ((uid * 7 + i * 13) % 125) + 1;
        if (songs.find(s => s.song_id === sid) && !likes.find(l => l.user_id === uid && l.song_id === sid)) {
            likes.push({ user_id: uid, song_id: sid, liked_date: `2025-02-${String(Math.min(28, uid + i)).padStart(2, '0')}T10:00:00` });
        }
    }
}

// ── Listening History ─────────────────────
export const listeningHistory = [];
const devices = ['Mobile', 'Desktop', 'Tablet', 'Smart Speaker', 'Web'];
// Generate ~900 rows
for (let uid = 1; uid <= 15; uid++) {
    const listensCount = uid <= 3 ? 100 : 50;
    for (let i = 0; i < listensCount; i++) {
        // Skew toward popular songs (lower IDs)
        const popularity = Math.random();
        let sid;
        if (popularity < 0.4) sid = Math.floor(Math.random() * 25) + 1; // top 25 songs
        else if (popularity < 0.7) sid = Math.floor(Math.random() * 50) + 26;
        else sid = Math.floor(Math.random() * 50) + 76;

        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');

        listeningHistory.push({
            user_id: uid,
            song_id: Math.min(sid, 125),
            listened_at: `2025-02-${day}T${hour}:${min}:00`,
            device_type: devices[Math.floor(Math.random() * devices.length)],
        });
    }
}
