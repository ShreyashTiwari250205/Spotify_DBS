// ========================================
// API Service Layer — Spotify DBS
// Uses Supabase for all data operations.
// ========================================
import { supabase } from './supabaseClient';

// ── Auth ──────────────────────────────────
let currentUser = null;

export async function login(email, password) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (data) {
        currentUser = { ...data };
        localStorage.setItem('spotify_dbs_user', JSON.stringify(data));
        return { success: true, user: data };
    }
    return { success: false, error: 'Invalid email or password' };
}

export function logout() {
    currentUser = null;
    localStorage.removeItem('spotify_dbs_user');
}

export function getCurrentUser() {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('spotify_dbs_user');
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }
    return null;
}

// ── Artists ───────────────────────────────
export async function getArtists() {
    const { data } = await supabase.from('artist').select('*');
    return data || [];
}

export async function getArtistById(id) {
    const { data } = await supabase.from('artist').select('*').eq('artist_id', Number(id)).single();
    return data;
}

// ── Albums ────────────────────────────────
export async function getAlbums() {
    const { data } = await supabase.from('album').select('*');
    return data || [];
}

export async function getAlbumById(id) {
    const { data } = await supabase.from('album').select('*').eq('album_id', Number(id)).single();
    return data;
}

export async function getAlbumsByArtist(artistId) {
    const { data } = await supabase.from('album').select('*').eq('artist_id', Number(artistId));
    return data || [];
}

// ── Songs ─────────────────────────────────
export async function getSongs() {
    const { data } = await supabase.from('song').select('*');
    return data || [];
}

export async function getSongById(id) {
    const { data } = await supabase.from('song').select('*').eq('song_id', Number(id)).single();
    return data;
}

export async function getSongsByAlbum(albumId) {
    const { data } = await supabase.from('song').select('*').eq('album_id', Number(albumId));
    return data || [];
}

// ── Performs ──────────────────────────────
export async function getPerformsBySong(songId) {
    const { data } = await supabase.from('performs').select('*').eq('song_id', Number(songId));
    return data || [];
}

export async function getPerformsByArtist(artistId) {
    const { data } = await supabase.from('performs').select('*').eq('artist_id', Number(artistId));
    return data || [];
}

export async function getSongArtists(songId) {
    const { data } = await supabase
        .from('performs')
        .select('*, artist(*)')
        .eq('song_id', Number(songId));
    return (data || []).map(p => ({ ...p.artist, role: p.role }));
}

export async function getArtistSongs(artistId) {
    const { data } = await supabase
        .from('performs')
        .select('*, song(*)')
        .eq('artist_id', Number(artistId));
    return (data || []).map(p => ({ ...p.song, role: p.role })).filter(s => s.title);
}

// ── Users ─────────────────────────────────
export async function getUsers() {
    const { data } = await supabase.from('users').select('*');
    return data || [];
}

export async function getUserById(id) {
    const { data } = await supabase.from('users').select('*').eq('user_id', Number(id)).single();
    return data;
}

// ── Subscriptions ─────────────────────────
export async function getSubscriptions() {
    const { data } = await supabase.from('subscription').select('*');
    return data || [];
}

export async function getUserSubscription(userId) {
    const { data } = await supabase.from('subscription').select('*').eq('user_id', Number(userId)).single();
    return data;
}

// ── Playlists ─────────────────────────────
export async function getPlaylists() {
    const { data } = await supabase.from('playlist').select('*');
    return data || [];
}

export async function getPlaylistById(id) {
    const { data } = await supabase.from('playlist').select('*').eq('playlist_id', Number(id)).single();
    return data;
}

export async function getUserPlaylists(userId) {
    const { data } = await supabase.from('playlist').select('*').eq('user_id', Number(userId));
    return data || [];
}

export async function getPlaylistSongs(playlistId) {
    const { data } = await supabase
        .from('playlist_song')
        .select('*, song(*)')
        .eq('playlist_id', Number(playlistId));
    return (data || []).map(ps => ({ ...ps.song, added_date: ps.added_date })).filter(s => s.title);
}

// ── Likes ─────────────────────────────────
export async function getUserLikes(userId) {
    const { data } = await supabase
        .from('likes')
        .select('*, song(*)')
        .eq('user_id', Number(userId));
    return (data || []).map(l => ({ ...l.song, liked_date: l.liked_date })).filter(s => s.title);
}

export async function isLiked(userId, songId) {
    const { data } = await supabase
        .from('likes')
        .select('user_id')
        .eq('user_id', Number(userId))
        .eq('song_id', Number(songId));
    return (data || []).length > 0;
}

// ── Listening History / Analytics ─────────
export async function getUserHistory(userId) {
    const { data } = await supabase
        .from('listening_history')
        .select('*, song(*)')
        .eq('user_id', Number(userId))
        .order('listened_at', { ascending: false })
        .limit(50);
    return (data || []).map(l => ({ ...l.song, listened_at: l.listened_at, device_type: l.device_type })).filter(s => s.title);
}

export async function getTopSongs(limit = 10) {
    // Get listening counts per song
    const { data: history } = await supabase.from('listening_history').select('song_id');
    if (!history) return [];
    const counts = {};
    history.forEach(l => { counts[l.song_id] = (counts[l.song_id] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
    const songIds = sorted.map(([id]) => Number(id));
    const { data: songs } = await supabase.from('song').select('*').in('song_id', songIds);
    return sorted.map(([songId, streams]) => {
        const song = (songs || []).find(s => s.song_id === Number(songId));
        return song ? { ...song, streams } : null;
    }).filter(Boolean);
}

export async function getMostPopularArtist() {
    const { data: history } = await supabase.from('listening_history').select('song_id');
    if (!history || history.length === 0) return null;
    const songIds = [...new Set(history.map(h => h.song_id))];
    const { data: performs } = await supabase.from('performs').select('*').in('song_id', songIds).eq('role', 'Lead');
    const counts = {};
    history.forEach(l => {
        const perf = (performs || []).filter(p => p.song_id === l.song_id);
        perf.forEach(p => { counts[p.artist_id] = (counts[p.artist_id] || 0) + 1; });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;
    const artist = await getArtistById(Number(sorted[0][0]));
    return artist ? { ...artist, streams: sorted[0][1] } : null;
}

export async function getMostCollaborativeArtist() {
    const { data: allPerforms } = await supabase.from('performs').select('*').eq('role', 'Featured');
    if (!allPerforms) return null;
    const collabs = {};
    allPerforms.forEach(p => { collabs[p.artist_id] = (collabs[p.artist_id] || 0) + 1; });
    const sorted = Object.entries(collabs).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;
    const artist = await getArtistById(Number(sorted[0][0]));
    return artist ? { ...artist, collaborations: sorted[0][1] } : null;
}

export async function getUserTopArtist(userId) {
    const { data: history } = await supabase.from('listening_history').select('song_id').eq('user_id', Number(userId));
    if (!history || history.length === 0) return null;
    const songIds = [...new Set(history.map(h => h.song_id))];
    const { data: performs } = await supabase.from('performs').select('*').in('song_id', songIds).eq('role', 'Lead');
    const counts = {};
    history.forEach(l => {
        const perf = (performs || []).filter(p => p.song_id === l.song_id);
        perf.forEach(p => { counts[p.artist_id] = (counts[p.artist_id] || 0) + 1; });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;
    const artist = await getArtistById(Number(sorted[0][0]));
    return artist ? { ...artist, plays: sorted[0][1] } : null;
}

export async function getDeviceDistribution() {
    const { data } = await supabase.from('listening_history').select('device_type');
    if (!data) return [];
    const counts = {};
    data.forEach(l => { counts[l.device_type] = (counts[l.device_type] || 0) + 1; });
    return Object.entries(counts).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count);
}

export async function getSubscriptionRevenue() {
    const { data } = await supabase.from('subscription').select('*').eq('payment_status', 'Paid');
    const rates = { Premium: 9.99, Family: 14.99 };
    const paid = data || [];
    const total = paid.reduce((sum, s) => sum + (rates[s.plan_type] || 0), 0);
    return { total: total.toFixed(2), breakdown: { Premium: paid.filter(s => s.plan_type === 'Premium').length, Family: paid.filter(s => s.plan_type === 'Family').length } };
}

// ── Genre Trends (last 30 days) ──────────
export async function getGenreTrends() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: history } = await supabase.from('listening_history').select('song_id').gte('listened_at', since);
    if (!history || history.length === 0) return [];
    const songIds = [...new Set(history.map(h => h.song_id))];
    const { data: performs } = await supabase.from('performs').select('song_id, artist_id').in('song_id', songIds).eq('role', 'Lead');
    const artistIds = [...new Set((performs || []).map(p => p.artist_id))];
    const { data: artists } = await supabase.from('artist').select('artist_id, genre').in('artist_id', artistIds);
    const artistGenre = {};
    (artists || []).forEach(a => { artistGenre[a.artist_id] = a.genre; });
    const songArtist = {};
    (performs || []).forEach(p => { songArtist[p.song_id] = p.artist_id; });
    const genreCounts = {};
    history.forEach(h => {
        const artistId = songArtist[h.song_id];
        const genre = artistGenre[artistId];
        if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    return Object.entries(genreCounts).map(([genre, count]) => ({ genre, count })).sort((a, b) => b.count - a.count);
}

// ── Listening Trends (daily counts) ──────
export async function getListeningTrends(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase.from('listening_history').select('listened_at').gte('listened_at', since);
    if (!data) return [];
    const dayCounts = {};
    data.forEach(h => {
        const day = h.listened_at.split('T')[0];
        dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    // Fill missing days with 0
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split('T')[0];
        result.push({ date: key, plays: dayCounts[key] || 0 });
    }
    return result;
}

// ── User Wrapped / Personal Stats ────────
export async function getUserWrapped(userId) {
    const { data: history } = await supabase.from('listening_history').select('song_id, listened_at').eq('user_id', Number(userId));
    if (!history || history.length === 0) return null;
    const songIds = [...new Set(history.map(h => h.song_id))];
    const { data: songs } = await supabase.from('song').select('*').in('song_id', songIds);
    const { data: performs } = await supabase.from('performs').select('song_id, artist_id').in('song_id', songIds).eq('role', 'Lead');
    const artistIds = [...new Set((performs || []).map(p => p.artist_id))];
    const { data: artists } = await supabase.from('artist').select('*').in('artist_id', artistIds);

    // Total minutes
    const songMap = {};
    (songs || []).forEach(s => { songMap[s.song_id] = s; });
    const totalSeconds = history.reduce((sum, h) => sum + (songMap[h.song_id]?.duration_seconds || 0), 0);

    // Top songs
    const songCounts = {};
    history.forEach(h => { songCounts[h.song_id] = (songCounts[h.song_id] || 0) + 1; });
    const topSongIds = Object.entries(songCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topSongs = topSongIds.map(([id, plays]) => ({ ...(songMap[Number(id)] || {}), plays }));

    // Top artists
    const songArtist = {};
    (performs || []).forEach(p => { songArtist[p.song_id] = p.artist_id; });
    const artistCounts = {};
    history.forEach(h => {
        const aid = songArtist[h.song_id];
        if (aid) artistCounts[aid] = (artistCounts[aid] || 0) + 1;
    });
    const topArtistIds = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const artistMap = {};
    (artists || []).forEach(a => { artistMap[a.artist_id] = a; });
    const topArtists = topArtistIds.map(([id, plays]) => ({ ...(artistMap[Number(id)] || {}), plays }));

    // Top genre
    const genreCounts = {};
    history.forEach(h => {
        const aid = songArtist[h.song_id];
        const genre = artistMap[aid]?.genre;
        if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];

    return {
        totalMinutes: Math.round(totalSeconds / 60),
        totalStreams: history.length,
        uniqueSongs: songIds.length,
        uniqueArtists: artistIds.length,
        topSongs,
        topArtists,
        topGenre: topGenre ? { genre: topGenre[0], count: topGenre[1] } : null,
        genreBreakdown: Object.entries(genreCounts).map(([genre, count]) => ({ genre, count })).sort((a, b) => b.count - a.count),
    };
}


export async function search(query) {
    const q = `%${query}%`;
    const [artistRes, albumRes, songRes] = await Promise.all([
        supabase.from('artist').select('*').ilike('artist_name', q),
        supabase.from('album').select('*').ilike('title', q),
        supabase.from('song').select('*').ilike('title', q),
    ]);
    return {
        artists: artistRes.data || [],
        albums: albumRes.data || [],
        songs: songRes.data || [],
    };
}

// ── CRUD Operations (for Admin/Demo) ─────
export async function addSong(song) {
    const { data, error } = await supabase.from('song').insert([song]).select().single();
    if (error) throw new Error(`Add song failed: ${error.message}`);
    return data;
}
export async function updateSong(songId, updates) {
    const { data, error } = await supabase.from('song').update(updates).eq('song_id', Number(songId)).select().single();
    if (error) throw new Error(`Update song failed: ${error.message}`);
    return data;
}
export async function deleteSong(songId) {
    // Delete related performs entries first
    await supabase.from('performs').delete().eq('song_id', Number(songId));
    const { data, error } = await supabase.from('song').delete().eq('song_id', Number(songId)).select().single();
    if (error) throw new Error(`Delete song failed: ${error.message}`);
    return data;
}

export async function addUser(user) {
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) throw new Error(`Add user failed: ${error.message}`);
    return data;
}
export async function updateUser(userId, updates) {
    const { data, error } = await supabase.from('users').update(updates).eq('user_id', Number(userId)).select().single();
    if (error) throw new Error(`Update user failed: ${error.message}`);
    return data;
}
export async function deleteUser(userId) {
    const { data, error } = await supabase.from('users').delete().eq('user_id', Number(userId)).select().single();
    if (error) throw new Error(`Delete user failed: ${error.message}`);
    return data;
}

// ── Interactive Features ─────────────────

// Toggle like on a song (like if not liked, unlike if already liked)
export async function toggleLike(userId, songId) {
    const liked = await isLiked(userId, songId);
    if (liked) {
        await supabase.from('likes').delete().eq('user_id', Number(userId)).eq('song_id', Number(songId));
        return false; // now unliked
    } else {
        await supabase.from('likes').insert([{ user_id: Number(userId), song_id: Number(songId) }]);
        return true; // now liked
    }
}

// Get like count for a song
export async function getSongLikeCount(songId) {
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('song_id', Number(songId));
    return count || 0;
}

// Record a listen (listening history)
export async function recordListen(userId, songId, deviceType = 'Web') {
    if (!userId || !songId) return;
    await supabase.from('listening_history').insert([{
        user_id: Number(userId),
        song_id: Number(songId),
        device_type: deviceType
    }]);
}

// Create a new playlist
export async function createPlaylist(userId, playlistName) {
    const { data } = await supabase.from('playlist').insert([{
        playlist_name: playlistName,
        user_id: Number(userId)
    }]).select().single();
    return data;
}

// Delete a playlist
export async function deletePlaylist(playlistId) {
    await supabase.from('playlist_song').delete().eq('playlist_id', Number(playlistId));
    const { data } = await supabase.from('playlist').delete().eq('playlist_id', Number(playlistId)).select().single();
    return data;
}

// Add a song to a playlist
export async function addToPlaylist(playlistId, songId) {
    const { data, error } = await supabase.from('playlist_song').insert([{
        playlist_id: Number(playlistId),
        song_id: Number(songId)
    }]).select().single();
    return { data, error };
}

// Remove a song from a playlist
export async function removeFromPlaylist(playlistId, songId) {
    await supabase.from('playlist_song').delete()
        .eq('playlist_id', Number(playlistId))
        .eq('song_id', Number(songId));
}

