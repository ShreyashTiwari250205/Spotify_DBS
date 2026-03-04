import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistById, getPlaylistSongs, getUserById, getSongArtists, getAlbumById, removeFromPlaylist, deletePlaylist, addToPlaylist, getSongs } from '../services/api';
import { SongRow } from '../components/Cards';
import { Play, ListMusic, Trash2, Plus, X, Search } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function PlaylistPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playAlbum } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [owner, setOwner] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSong, setShowAddSong] = useState(false);

    const loadPlaylist = async () => {
        setLoading(true);
        const pl = await getPlaylistById(id);
        if (!pl) { setLoading(false); return; }
        setPlaylist(pl);
        const [o, rawSongs] = await Promise.all([
            getUserById(pl.user_id),
            getPlaylistSongs(id),
        ]);
        setOwner(o);

        const enriched = await Promise.all(rawSongs.map(async (s) => {
            const artists = await getSongArtists(s.song_id);
            const lead = artists.find(a => a.role === 'Lead');
            const featured = artists.filter(a => a.role === 'Featured');
            const album = await getAlbumById(s.album_id);
            return {
                ...s,
                artistNames: lead ? lead.artist_name + (featured.length ? ` ft. ${featured.map(a => a.artist_name).join(', ')}` : '') : '',
                albumTitle: album?.title
            };
        }));
        setSongs(enriched);
        setLoading(false);
    };

    useEffect(() => { loadPlaylist(); }, [id]);

    const handleRemoveSong = async (songId) => {
        await removeFromPlaylist(id, songId);
        loadPlaylist();
    };

    const handleDeletePlaylist = async () => {
        if (!confirm('Delete this entire playlist?')) return;
        await deletePlaylist(id);
        navigate('/playlists');
    };

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;
    if (!playlist) return <div className="p-6 text-spotify-subtle">Playlist not found.</div>;

    return (
        <div className="pb-28 animate-fade-in">
            <div className="p-8 bg-gradient-to-b from-emerald-900/30 to-spotify-black">
                <div className="flex items-end gap-6">
                    <div className="w-52 h-52 rounded-lg bg-gradient-to-br from-spotify-green to-emerald-800 flex items-center justify-center shadow-2xl flex-shrink-0">
                        <ListMusic size={64} className="text-white" />
                    </div>
                    <div className="pb-2">
                        <p className="text-xs uppercase font-semibold tracking-widest text-spotify-subtle mb-2">Playlist</p>
                        <h1 className="text-4xl font-black mb-3">{playlist.playlist_name}</h1>
                        <p className="text-sm text-spotify-subtle">{owner?.name} · {songs.length} songs</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => playAlbum(songs.map(s => s.song_id))} className="w-14 h-14 rounded-full bg-spotify-green flex items-center justify-center hover:scale-105 transition shadow-lg shadow-spotify-green/20">
                        <Play size={24} className="text-black ml-0.5" />
                    </button>
                    <button onClick={() => setShowAddSong(true)} className="p-3 rounded-full hover:bg-white/10 transition text-spotify-subtle hover:text-white" title="Add songs">
                        <Plus size={22} />
                    </button>
                    <button onClick={handleDeletePlaylist} className="p-3 rounded-full hover:bg-red-500/20 transition text-spotify-subtle hover:text-red-400" title="Delete playlist">
                        <Trash2 size={20} />
                    </button>
                </div>

                {songs.length > 0 ? (
                    <div className="space-y-0.5">
                        {songs.map((song, i) => (
                            <div key={song.song_id} className="flex items-center gap-0">
                                <div className="flex-1">
                                    <SongRow song={song} index={i + 1} showAlbum />
                                </div>
                                <button
                                    onClick={() => handleRemoveSong(song.song_id)}
                                    className="p-2 rounded-full hover:bg-red-500/20 transition text-spotify-subtle hover:text-red-400 opacity-0 hover:opacity-100 group-hover:opacity-100"
                                    title="Remove from playlist"
                                    style={{ opacity: undefined }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-spotify-subtle mb-4">This playlist is empty.</p>
                        <button onClick={() => setShowAddSong(true)} className="px-6 py-2.5 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition">
                            Add songs
                        </button>
                    </div>
                )}
            </div>

            {/* Add Song Modal */}
            {showAddSong && (
                <AddSongModal
                    playlistId={id}
                    existingSongIds={songs.map(s => s.song_id)}
                    onClose={() => setShowAddSong(false)}
                    onAdded={loadPlaylist}
                />
            )}
        </div>
    );
}

function AddSongModal({ playlistId, existingSongIds, onClose, onAdded }) {
    const [allSongs, setAllSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [adding, setAdding] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSongs().then(songs => {
            setAllSongs(songs.filter(s => !existingSongIds.includes(s.song_id)));
            setLoading(false);
        });
    }, [existingSongIds]);

    const filtered = searchQuery.length >= 2
        ? allSongs.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : allSongs.slice(0, 20);

    const handleAdd = async (songId) => {
        setAdding(songId);
        await addToPlaylist(playlistId, songId);
        setAllSongs(prev => prev.filter(s => s.song_id !== songId));
        setAdding(null);
        onAdded();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-spotify-dark rounded-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col border border-white/10 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Add Songs</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"><X size={18} /></button>
                </div>

                <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-subtle" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search songs..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1">
                    {loading ? (
                        <p className="text-spotify-subtle text-center py-8 animate-pulse">Loading songs...</p>
                    ) : filtered.length > 0 ? (
                        filtered.map(song => (
                            <div key={song.song_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">{song.title}</p>
                                    <p className="text-xs text-spotify-subtle">
                                        {Math.floor(song.duration_seconds / 60)}:{String(song.duration_seconds % 60).padStart(2, '0')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAdd(song.song_id)}
                                    disabled={adding === song.song_id}
                                    className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium hover:bg-spotify-green hover:text-black transition disabled:opacity-50 flex-shrink-0"
                                >
                                    {adding === song.song_id ? '...' : 'Add'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-spotify-subtle text-center py-8">No songs found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
