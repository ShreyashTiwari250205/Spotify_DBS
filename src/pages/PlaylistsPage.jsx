import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, getPlaylistSongs } from '../services/api';
import { ListMusic, Music2 } from 'lucide-react';

export default function PlaylistsPage() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [playlistSongCounts, setPlaylistSongCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function load() {
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
        }
        load();
    }, [user]);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;

    return (
        <div className="p-6 pb-28 animate-fade-in">
            <h1 className="text-2xl font-bold mb-6">Your Playlists</h1>

            {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playlists.map(p => (
                        <Link key={p.playlist_id} to={`/playlist/${p.playlist_id}`} className="hover-card group p-5 rounded-xl bg-spotify-card/50 block">
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
                    <p className="text-spotify-subtle">No playlists yet.</p>
                </div>
            )}
        </div>
    );
}
