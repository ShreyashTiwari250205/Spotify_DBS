import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArtistCard, AlbumCard, SongRow } from '../components/Cards';
import { getArtists, getAlbums, getTopSongs, getUserTopArtist, getSongArtists, getAlbumById } from '../services/api';

export default function HomePage() {
    const { user } = useAuth();
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [topArtist, setTopArtist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [a, al, ts] = await Promise.all([
                getArtists(),
                getAlbums(),
                getTopSongs(8),
            ]);
            setArtists(a);
            setAlbums(al.slice(0, 8));

            // Enrich top songs with artist names
            const enriched = await Promise.all(ts.map(async (s) => {
                const songArtists = await getSongArtists(s.song_id);
                const lead = songArtists.find(a => a.role === 'Lead');
                const featured = songArtists.filter(a => a.role === 'Featured');
                const album = await getAlbumById(s.album_id);
                return {
                    ...s,
                    artistNames: lead ? lead.artist_name + (featured.length ? ` ft. ${featured.map(a => a.artist_name).join(', ')}` : '') : '',
                    albumTitle: album?.title
                };
            }));
            setTopSongs(enriched);

            if (user) {
                const ta = await getUserTopArtist(user.user_id);
                setTopArtist(ta);
            }
            setLoading(false);
        }
        load();
    }, [user]);

    const hours = new Date().getHours();
    const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

    if (loading) return (
        <div className="p-6 flex items-center justify-center h-full">
            <div className="text-spotify-subtle animate-pulse text-lg">Loading...</div>
        </div>
    );

    return (
        <div className="p-6 pb-28 space-y-10 animate-fade-in">
            {/* Hero */}
            <section>
                <h1 className="text-3xl font-bold mb-1">{greeting}, {user?.name?.split(' ')[0] || 'Listener'}</h1>
                <p className="text-spotify-subtle text-sm">
                    {topArtist
                        ? `Your most played artist is ${topArtist.artist_name} with ${topArtist.plays} plays`
                        : 'Discover your next favorite track'}
                </p>
            </section>

            {/* Quick Picks */}
            <section>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {artists.slice(0, 6).map(artist => (
                        <Link
                            key={artist.artist_id}
                            to={`/artist/${artist.artist_id}`}
                            className="flex items-center gap-3 bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition group"
                        >
                            <img src={`https://picsum.photos/seed/${artist.artist_name.toLowerCase().replace(/\s/g, '')}/64/64`} alt="" className="w-16 h-16 object-cover" />
                            <span className="text-sm font-medium">{artist.artist_name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Popular Artists */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Popular Artists</h2>
                    <Link to="/search" className="text-xs text-spotify-subtle hover:text-white transition font-semibold uppercase tracking-wide">Show all</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {artists.map(artist => (
                        <ArtistCard key={artist.artist_id} artist={artist} />
                    ))}
                </div>
            </section>

            {/* New Releases */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">New Releases</h2>
                    <Link to="/search" className="text-xs text-spotify-subtle hover:text-white transition font-semibold uppercase tracking-wide">Show all</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {albums.map(album => (
                        <AlbumCard key={album.album_id} album={album} />
                    ))}
                </div>
            </section>

            {/* Top Streamed */}
            {topSongs.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">Trending Now</h2>
                    <div className="glass rounded-xl overflow-hidden">
                        {topSongs.map((song, i) => (
                            <SongRow key={song.song_id} song={song} index={i + 1} showAlbum />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
