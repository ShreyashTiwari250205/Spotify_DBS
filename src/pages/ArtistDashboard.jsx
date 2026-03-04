import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { getArtistSongs, getArtistAlbums, getArtistById, addSong, addAlbum, addPerforms, deleteSong } from '../services/api';
import { Mic2, Plus, Trash2, Play, Disc, Music, X, Album } from 'lucide-react';

export default function ArtistDashboard() {
    const { user } = useAuth();
    const { playSong } = usePlayer();
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const artistId = user?.artist_id;

    useEffect(() => {
        if (!artistId) { setLoading(false); return; }
        async function load() {
            setLoading(true);
            const [a, s, al] = await Promise.all([
                getArtistById(artistId),
                getArtistSongs(artistId),
                getArtistAlbums(artistId),
            ]);
            setArtist(a);
            setSongs(s);
            setAlbums(al);
            setLoading(false);
        }
        load();
    }, [artistId, refreshKey]);

    const handleDelete = async (songId) => {
        if (!confirm('Delete this song permanently?')) return;
        await deleteSong(songId);
        setRefreshKey(r => r + 1);
    };

    if (!artistId) return (
        <div className="p-6 pb-28 animate-fade-in text-center py-20">
            <Mic2 size={48} className="mx-auto text-spotify-subtle mb-4" />
            <p className="text-spotify-subtle text-lg">This account is not linked to an artist profile.</p>
            <p className="text-spotify-subtle text-sm mt-2">Log in with an artist account to manage your catalog.</p>
        </div>
    );

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading your catalog...</div>;

    return (
        <div className="p-6 pb-28 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-spotify-card">
                        <img src={`https://picsum.photos/seed/${(artist?.artist_name || '').toLowerCase().replace(/\s/g, '')}/128/128`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-spotify-green font-semibold">Artist Dashboard</p>
                        <h1 className="text-2xl font-bold">{artist?.artist_name}</h1>
                        <p className="text-spotify-subtle text-sm">{artist?.genre} · {artist?.country} {artist?.verified_status ? '✓ Verified' : '· Unverified'}</p>
                    </div>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition">
                    <Plus size={16} /> Release Song
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-5 text-center">
                    <Music className="mx-auto text-spotify-green mb-2" size={22} />
                    <p className="text-2xl font-black">{songs.length}</p>
                    <p className="text-xs text-spotify-subtle">Songs</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <Album className="mx-auto text-blue-400 mb-2" size={22} />
                    <p className="text-2xl font-black">{albums.length}</p>
                    <p className="text-xs text-spotify-subtle">Albums</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <Disc className="mx-auto text-purple-400 mb-2" size={22} />
                    <p className="text-2xl font-black">{artist?.monthly_listeners || 0}</p>
                    <p className="text-xs text-spotify-subtle">Monthly Listeners</p>
                </div>
            </div>

            {/* Albums */}
            {albums.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-3">Your Albums</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {albums.map(al => (
                            <div key={al.album_id} className="glass rounded-xl p-4 min-w-[160px] flex-shrink-0">
                                <img src={`https://picsum.photos/seed/album${al.album_id}/120/120`} alt="" className="w-full aspect-square rounded-lg object-cover mb-3" />
                                <p className="font-semibold text-sm truncate">{al.title}</p>
                                <p className="text-xs text-spotify-subtle">{al.release_date}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Songs */}
            <section>
                <h2 className="text-lg font-bold mb-3">Your Songs</h2>
                {songs.length === 0 ? (
                    <div className="glass rounded-xl p-8 text-center">
                        <p className="text-spotify-subtle">No songs yet. Click "Release Song" to add your first track!</p>
                    </div>
                ) : (
                    <div className="glass rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-spotify-subtle text-left">
                                    <th className="px-4 py-3 w-10">#</th>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3 hidden md:table-cell">Album</th>
                                    <th className="px-4 py-3">Duration</th>
                                    <th className="px-4 py-3">Plays</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {songs.map((song, i) => {
                                    const al = albums.find(a => a.album_id === song.album_id);
                                    return (
                                        <tr key={song.song_id} className="border-b border-white/5 hover:bg-white/5 transition group">
                                            <td className="px-4 py-3 text-spotify-subtle">
                                                <span className="group-hover:hidden">{i + 1}</span>
                                                <button onClick={() => playSong(song.song_id)} className="hidden group-hover:inline text-spotify-green"><Play size={14} /></button>
                                            </td>
                                            <td className="px-4 py-3 font-medium">{song.title}</td>
                                            <td className="px-4 py-3 text-spotify-subtle hidden md:table-cell">{al?.title || 'Single'}</td>
                                            <td className="px-4 py-3 text-spotify-subtle">{Math.floor(song.duration_seconds / 60)}:{String(song.duration_seconds % 60).padStart(2, '0')}</td>
                                            <td className="px-4 py-3 text-spotify-subtle">{song.play_count || 0}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(song.song_id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-spotify-subtle hover:text-red-400 transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {showModal && createPortal(
                <AddSongModal artistId={artistId} albums={albums} onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); setRefreshKey(r => r + 1); }} />,
                document.body
            )}
        </div>
    );
}

// ── Add Song Modal with Album/Single options ──
function AddSongModal({ artistId, albums, onClose, onSave }) {
    const [mode, setMode] = useState('existing'); // 'existing', 'new', 'single'
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        duration_seconds: 200,
        release_date: new Date().toISOString().split('T')[0],
        album_id: albums.length > 0 ? albums[0].album_id : '',
    });

    const [newAlbum, setNewAlbum] = useState({
        title: '',
        release_date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            let albumId;

            if (mode === 'existing') {
                albumId = Number(form.album_id);
            } else if (mode === 'new') {
                if (!newAlbum.title.trim()) throw new Error('Album title is required');
                const album = await addAlbum({
                    title: newAlbum.title.trim(),
                    release_date: newAlbum.release_date,
                    artist_id: Number(artistId),
                });
                albumId = album.album_id;
            } else {
                // Single — create a "Singles" album or use song title as album
                const album = await addAlbum({
                    title: `${form.title.trim()} - Single`,
                    release_date: form.release_date,
                    artist_id: Number(artistId),
                });
                albumId = album.album_id;
            }

            const song = await addSong({
                title: form.title.trim(),
                duration_seconds: Number(form.duration_seconds),
                release_date: form.release_date,
                album_id: albumId,
            });

            // Link artist to song
            await addPerforms(artistId, song.song_id, 'Lead');

            setSaving(false);
            onSave();
        } catch (err) {
            setSaving(false);
            setError(err.message || 'Failed to release song');
        }
    };

    const modes = [
        { key: 'existing', label: 'Existing Album', icon: Album, disabled: albums.length === 0 },
        { key: 'new', label: 'New Album', icon: Plus },
        { key: 'single', label: 'Single', icon: Disc },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9999 }} onClick={onClose}>
            <div className="bg-spotify-dark rounded-2xl p-6 w-full max-w-lg border border-white/10 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Release a Song</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition text-white"><X size={18} /></button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Song Details */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-spotify-subtle mb-1.5">Song Title</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition" required placeholder="Enter song title" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-spotify-subtle mb-1.5">Duration (seconds)</label>
                                <input type="number" value={form.duration_seconds} onChange={e => setForm({ ...form, duration_seconds: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition" required min={10} max={3600} />
                            </div>
                            <div>
                                <label className="block text-xs text-spotify-subtle mb-1.5">Release Date</label>
                                <input type="date" value={form.release_date} onChange={e => setForm({ ...form, release_date: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition" required />
                            </div>
                        </div>
                    </div>

                    {/* Release Mode Selector */}
                    <div>
                        <label className="block text-xs text-spotify-subtle mb-2">Release Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {modes.map(m => (
                                <button
                                    key={m.key}
                                    type="button"
                                    disabled={m.disabled}
                                    onClick={() => setMode(m.key)}
                                    className={`p-3 rounded-xl text-center text-xs font-medium transition border ${mode === m.key
                                            ? 'bg-spotify-green/10 border-spotify-green text-spotify-green'
                                            : 'bg-white/5 border-white/10 text-spotify-subtle hover:bg-white/10'
                                        } ${m.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                                >
                                    <m.icon size={18} className="mx-auto mb-1" />
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contextual Album Fields */}
                    {mode === 'existing' && albums.length > 0 && (
                        <div>
                            <label className="block text-xs text-spotify-subtle mb-1.5">Select Album</label>
                            <select value={form.album_id} onChange={e => setForm({ ...form, album_id: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green" required>
                                {albums.map(a => <option key={a.album_id} value={a.album_id}>{a.title}</option>)}
                            </select>
                        </div>
                    )}

                    {mode === 'new' && (
                        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-spotify-green font-semibold">New Album Details</p>
                            <div>
                                <label className="block text-xs text-spotify-subtle mb-1.5">Album Title</label>
                                <input type="text" value={newAlbum.title} onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition" required placeholder="Enter album title" />
                            </div>
                            <div>
                                <label className="block text-xs text-spotify-subtle mb-1.5">Album Release Date</label>
                                <input type="date" value={newAlbum.release_date} onChange={e => setNewAlbum({ ...newAlbum, release_date: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition" required />
                            </div>
                        </div>
                    )}

                    {mode === 'single' && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-spotify-subtle">A new album called "<span className="text-white">{form.title || '...'} - Single</span>" will be created automatically.</p>
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="w-full py-3 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition disabled:opacity-50">
                        {saving ? 'Releasing...' : 'Release Song'}
                    </button>
                </form>
            </div>
        </div>
    );
}
