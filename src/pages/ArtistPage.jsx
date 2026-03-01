import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtistById, getAlbumsByArtist, getArtistSongs, getPerformsByArtist, getSongArtists, getAlbumById } from '../services/api';
import { AlbumCard, SongRow } from '../components/Cards';
import { CheckCircle2, Play, Users } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function ArtistPage() {
    const { id } = useParams();
    const { playSong, playAlbum } = usePlayer();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [leadSongs, setLeadSongs] = useState([]);
    const [featuredCount, setFeaturedCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [a, al, allSongs, performs] = await Promise.all([
                getArtistById(id),
                getAlbumsByArtist(id),
                getArtistSongs(id),
                getPerformsByArtist(id),
            ]);
            setArtist(a);
            setAlbums(al);
            setFeaturedCount(performs.filter(p => p.role === 'Featured').length);

            const leads = allSongs.filter(s => s.role === 'Lead').slice(0, 10);
            const enriched = await Promise.all(leads.map(async (s) => {
                const artists = await getSongArtists(s.song_id);
                const featured = artists.filter(a => a.role === 'Featured');
                const album = await getAlbumById(s.album_id);
                return {
                    ...s,
                    artistNames: a.artist_name + (featured.length ? ` ft. ${featured.map(a => a.artist_name).join(', ')}` : ''),
                    albumTitle: album?.title
                };
            }));
            setLeadSongs(enriched);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;
    if (!artist) return <div className="p-6 text-spotify-subtle">Artist not found.</div>;

    const handlePlayAll = () => {
        const songIds = leadSongs.map(s => s.song_id);
        playAlbum(songIds);
    };

    return (
        <div className="pb-28 animate-fade-in">
            {/* Hero Banner */}
            <div className="relative h-80 overflow-hidden">
                <img
                    src={`https://picsum.photos/seed/${artist.artist_name.toLowerCase().replace(/\s/g, '')}/1200/400`}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-spotify-black" />
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                        {artist.verified_status && (
                            <span className="flex items-center gap-1 text-xs text-blue-400">
                                <CheckCircle2 size={14} /> Verified Artist
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl font-black mb-2">{artist.artist_name}</h1>
                    <div className="flex items-center gap-4 text-sm text-spotify-subtle">
                        <span>{artist.genre}</span>
                        <span>·</span>
                        <span>{artist.country}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {featuredCount} collaborations</span>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-10">
                {/* Play Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePlayAll}
                        className="w-14 h-14 rounded-full bg-spotify-green flex items-center justify-center hover:scale-105 transition shadow-lg shadow-spotify-green/20"
                    >
                        <Play size={24} className="text-black ml-0.5" />
                    </button>
                </div>

                {/* Popular Tracks */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Popular</h2>
                    <div className="space-y-0.5">
                        {leadSongs.map((song, i) => (
                            <SongRow key={song.song_id} song={song} index={i + 1} showAlbum />
                        ))}
                    </div>
                </section>

                {/* Discography */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Discography</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {albums.map(album => (
                            <AlbumCard key={album.album_id} album={album} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
