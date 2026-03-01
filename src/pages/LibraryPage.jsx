import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, getUserLikes, getUserHistory, getUserTopArtist, getUserSubscription } from '../services/api';
import { ListMusic, Heart, Clock, Crown, User } from 'lucide-react';

export default function LibraryPage() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [likedCount, setLikedCount] = useState(0);
    const [recentHistory, setRecentHistory] = useState([]);
    const [topArtist, setTopArtist] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function load() {
            setLoading(true);
            const [pl, liked, history, ta, sub] = await Promise.all([
                getUserPlaylists(user.user_id),
                getUserLikes(user.user_id),
                getUserHistory(user.user_id),
                getUserTopArtist(user.user_id),
                getUserSubscription(user.user_id),
            ]);
            setPlaylists(pl);
            setLikedCount(liked.length);
            setRecentHistory(history.slice(0, 5));
            setTopArtist(ta);
            setSubscription(sub);
            setLoading(false);
        }
        load();
    }, [user]);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;

    return (
        <div className="p-6 pb-28 animate-fade-in space-y-8">
            <h1 className="text-2xl font-bold">Your Library</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-5 text-center">
                    <ListMusic className="mx-auto mb-2 text-spotify-green" size={24} />
                    <p className="text-2xl font-bold">{playlists.length}</p>
                    <p className="text-xs text-spotify-subtle mt-1">Playlists</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <Heart className="mx-auto mb-2 text-pink-500" size={24} />
                    <p className="text-2xl font-bold">{likedCount}</p>
                    <p className="text-xs text-spotify-subtle mt-1">Liked Songs</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <User className="mx-auto mb-2 text-blue-400" size={24} />
                    <p className="text-2xl font-bold truncate text-sm mt-1">{topArtist?.artist_name || '—'}</p>
                    <p className="text-xs text-spotify-subtle mt-1">Top Artist</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <Crown className="mx-auto mb-2 text-yellow-500" size={24} />
                    <p className="text-lg font-bold">{subscription?.plan_type || 'Free'}</p>
                    <p className="text-xs text-spotify-subtle mt-1">{subscription?.payment_status || 'N/A'}</p>
                </div>
            </div>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Your Playlists</h2>
                    <Link to="/playlists" className="text-xs text-spotify-subtle hover:text-white">See all</Link>
                </div>
                {playlists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {playlists.map(p => (
                            <Link key={p.playlist_id} to={`/playlist/${p.playlist_id}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-spotify-green to-emerald-800 flex items-center justify-center flex-shrink-0">
                                    <ListMusic size={20} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{p.playlist_name}</p>
                                    <p className="text-xs text-spotify-subtle">Playlist · {user?.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-spotify-subtle text-sm">No playlists yet.</p>
                )}
            </section>

            <Link to="/liked" className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-800/30 to-blue-800/30 hover:from-purple-800/40 hover:to-blue-800/40 transition group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                    <Heart size={22} className="text-white" />
                </div>
                <div>
                    <p className="font-semibold">Liked Songs</p>
                    <p className="text-xs text-spotify-subtle">{likedCount} songs</p>
                </div>
            </Link>

            <section>
                <h2 className="text-lg font-bold mb-4">Recently Played</h2>
                {recentHistory.length > 0 ? (
                    <div className="space-y-2">
                        {recentHistory.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition">
                                <Clock size={14} className="text-spotify-subtle flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.title}</p>
                                    <p className="text-xs text-spotify-subtle">{item.device_type} · {new Date(item.listened_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-spotify-subtle text-sm">No listening history yet.</p>
                )}
            </section>
        </div>
    );
}
