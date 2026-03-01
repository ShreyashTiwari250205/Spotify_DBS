import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbumById, getSongsByAlbum, getArtistById, getSongArtists } from '../services/api';
import { SongRow } from '../components/Cards';
import { Play, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumPage() {
    const { id } = useParams();
    const { playAlbum } = usePlayer();
    const [album, setAlbum] = useState(null);
    const [artist, setArtist] = useState(null);
    const [albumSongs, setAlbumSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const al = await getAlbumById(id);
            if (!al) { setLoading(false); return; }
            setAlbum(al);
            const [ar, songs] = await Promise.all([
                getArtistById(al.artist_id),
                getSongsByAlbum(id),
            ]);
            setArtist(ar);

            const enriched = await Promise.all(songs.map(async (s) => {
                const artists = await getSongArtists(s.song_id);
                const lead = artists.find(a => a.role === 'Lead');
                const featured = artists.filter(a => a.role === 'Featured');
                return {
                    ...s,
                    artistNames: lead ? lead.artist_name + (featured.length ? ` ft. ${featured.map(a => a.artist_name).join(', ')}` : '') : ''
                };
            }));
            setAlbumSongs(enriched);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;
    if (!album) return <div className="p-6 text-spotify-subtle">Album not found.</div>;

    const totalDuration = albumSongs.reduce((sum, s) => sum + s.duration_seconds, 0);
    const formatTotal = (s) => `${Math.floor(s / 3600)} hr ${Math.floor((s % 3600) / 60)} min`;

    const handlePlayAll = () => {
        playAlbum(albumSongs.map(s => s.song_id));
    };

    return (
        <div className="pb-28 animate-fade-in">
            {/* Header */}
            <div className="flex items-end gap-6 p-6 bg-gradient-to-b from-spotify-card to-spotify-black">
                <img
                    src={`https://picsum.photos/seed/album${album.album_id}/224/224`}
                    alt={album.title}
                    className="w-56 h-56 rounded-lg shadow-2xl shadow-black/60 flex-shrink-0"
                />
                <div className="pb-2">
                    <p className="text-xs uppercase font-semibold tracking-widest text-spotify-subtle mb-2">Album</p>
                    <h1 className="text-4xl font-black mb-4">{album.title}</h1>
                    <div className="flex items-center gap-2 text-sm">
                        {artist && (
                            <>
                                <img src={`https://picsum.photos/seed/${artist.artist_name.toLowerCase().replace(/\s/g, '')}/24/24`} alt="" className="w-6 h-6 rounded-full" />
                                <Link to={`/artist/${artist.artist_id}`} className="font-semibold hover:underline">{artist.artist_name}</Link>
                                <span className="text-spotify-subtle">·</span>
                            </>
                        )}
                        <span className="text-spotify-subtle">{new Date(album.release_date).getFullYear()}</span>
                        <span className="text-spotify-subtle">·</span>
                        <span className="text-spotify-subtle">{albumSongs.length} songs, {formatTotal(totalDuration)}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handlePlayAll}
                        className="w-14 h-14 rounded-full bg-spotify-green flex items-center justify-center hover:scale-105 transition shadow-lg shadow-spotify-green/20"
                    >
                        <Play size={24} className="text-black ml-0.5" />
                    </button>
                </div>

                <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 mb-2 text-xs text-spotify-subtle uppercase font-semibold tracking-wider">
                    <span className="w-6 text-center">#</span>
                    <span className="flex-1">Title</span>
                    <Clock size={14} />
                </div>

                <div className="space-y-0.5">
                    {albumSongs.map((song, i) => (
                        <SongRow key={song.song_id} song={song} index={i + 1} />
                    ))}
                </div>
            </div>
        </div>
    );
}
