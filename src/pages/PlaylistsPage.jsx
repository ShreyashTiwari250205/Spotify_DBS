import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, getPlaylistSongs, createPlaylist, deletePlaylist } from '../services/api';
import { ListMusic, Plus, Trash2, X } from 'lucide-react';

export default function PlaylistsPage() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [playlistSongCounts, setPlaylistSongCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    const loadPlaylists = async () => {
        if (!user) return;
        setLoading(true);
        const pl = await getUserPlaylists(user.user_id);
        setPlaylists(pl);
        const counts = {};
        await Promise.all(pl.map(async (p) => {
            const songs = await getPlaylistSongs(p.playlist_id);
            counts[p.playlist_id] = songs.length;
        }));
        setPlaylistSongCounts(counts);
        setLoading(false);
    };

    useEffect(() => { loadPlaylists(); }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim() || creating) return;
        setCreating(true);
        await createPlaylist(user.user_id, newName.trim());
        setNewName('');
        setShowCreate(false);
        setCreating(false);
        loadPlaylists();
    };

    const handleDelete = async (e, playlistId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this playlist?')) return;
        await deletePlaylist(playlistId);
        loadPlaylists();
    };

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;

    return (
        <div className="p-6 pb-28 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Playlists</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition"
                >
                    <Plus size={16} /> New Playlist
                </button>
            </div>

            {/* Create playlist modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
                    <div className="bg-spotify-dark rounded-2xl p-6 w-full max-w-sm border border-white/10 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Create Playlist</h2>
                            <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-white/10"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Playlist name"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition"
                                autoFocus
                                required
                            />
                            <button type="submit" disabled={creating} className="w-full py-3 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition disabled:opacity-50">
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playlists.map(p => (
                        <Link key={p.playlist_id} to={`/playlist/${p.playlist_id}`} className="hover-card group p-5 rounded-xl bg-spotify-card/50 block relative">
                            <button
                                onClick={(e) => handleDelete(e, p.playlist_id)}
                                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition hover:bg-red-500/30 text-spotify-subtle hover:text-red-400 z-10"
                                title="Delete playlist"
                            >
                                <Trash2 size={14} />
                            </button>
                            <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-spotify-card to-spotify-dark flex items-center justify-center mb-4 relative overflow-hidden">
                                <div className="grid grid-cols-2 w-full h-full">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="overflow-hidden bg-spotify-card flex items-center justify-center">
                                            <img
                                                src={`https://picsum.photos/seed/pl${p.playlist_id}i${i}/150/150`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-sm font-semibold truncate">{p.playlist_name}</h3>
                            <p className="text-xs text-spotify-subtle mt-1">{playlistSongCounts[p.playlist_id] || 0} songs · {user?.name}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <ListMusic size={48} className="mx-auto text-spotify-subtle mb-4" />
                    <p className="text-spotify-subtle mb-4">No playlists yet.</p>
                    <button onClick={() => setShowCreate(true)} className="px-6 py-2.5 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition">
                        Create your first playlist
                    </button>
                </div>
            )}
        </div>
    );
}
