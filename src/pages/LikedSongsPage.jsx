import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserLikes, getSongArtists, getAlbumById } from '../services/api';
import { SongRow } from '../components/Cards';
import { Heart, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function LikedSongsPage() {
    const { user } = useAuth();
    const { playAlbum } = usePlayer();
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function load() {
            setLoading(true);
            const liked = await getUserLikes(user.user_id);
            const enriched = await Promise.all(liked.map(async (s) => {
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
            setLikedSongs(enriched);
            setLoading(false);
        }
        load();
    }, [user]);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;

    const handlePlayAll = () => {
        playAlbum(likedSongs.map(s => s.song_id));
    };

    return (
        <div className="pb-28 animate-fade-in">
            <div className="p-8 bg-gradient-to-b from-purple-900/40 to-spotify-black">
                <div className="flex items-end gap-6">
                    <div className="w-52 h-52 rounded-lg bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center shadow-2xl flex-shrink-0">
                        <Heart size={64} className="text-white" />
                    </div>
                    <div className="pb-2">
                        <p className="text-xs uppercase font-semibold tracking-widest text-spotify-subtle mb-2">Playlist</p>
                        <h1 className="text-4xl font-black mb-3">Liked Songs</h1>
                        <p className="text-sm text-spotify-subtle">{user?.name} · {likedSongs.length} songs</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={handlePlayAll} className="w-14 h-14 rounded-full bg-spotify-green flex items-center justify-center hover:scale-105 transition shadow-lg shadow-spotify-green/20">
                        <Play size={24} className="text-black ml-0.5" />
                    </button>
                </div>
                {likedSongs.length > 0 ? (
                    <div className="space-y-0.5">
                        {likedSongs.map((song, i) => (
                            <SongRow key={song.song_id} song={song} index={i + 1} showAlbum />
                        ))}
                    </div>
                ) : (
                    <p className="text-spotify-subtle text-center py-12">You haven't liked any songs yet.</p>
                )}
            </div>
        </div>
    );
}
