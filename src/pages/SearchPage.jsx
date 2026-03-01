import { useState, useEffect } from 'react';
import { search, getArtists, getAlbums, getSongArtists } from '../services/api';
import { ArtistCard, AlbumCard, SongRow } from '../components/Cards';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [allArtists, setAllArtists] = useState([]);
    const [allAlbums, setAllAlbums] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load browse data
    useEffect(() => {
        async function load() {
            const [a, al] = await Promise.all([getArtists(), getAlbums()]);
            setAllArtists(a);
            setAllAlbums(al);
        }
        load();
    }, []);

    // Search with debounce
    useEffect(() => {
        if (query.length < 2) { setResults(null); return; }
        setLoading(true);
        const timer = setTimeout(async () => {
            const res = await search(query);
            // Enrich songs
            const enriched = await Promise.all((res.songs || []).slice(0, 15).map(async (s) => {
                const artists = await getSongArtists(s.song_id);
                const lead = artists.find(a => a.role === 'Lead');
                const featured = artists.filter(a => a.role === 'Featured');
                return {
                    ...s,
                    artistNames: lead ? lead.artist_name + (featured.length ? ` ft. ${featured.map(a => a.artist_name).join(', ')}` : '') : ''
                };
            }));
            setResults({ ...res, songs: enriched });
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="p-6 pb-28 animate-fade-in">
            <div className="relative max-w-lg mb-8">
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-spotify-subtle" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to listen to?"
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green transition placeholder:text-spotify-subtle"
                    autoFocus
                />
            </div>

            {loading && <div className="text-spotify-subtle animate-pulse py-4">Searching...</div>}

            {results && !loading ? (
                <div className="space-y-10">
                    {results.artists.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-4">Artists</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {results.artists.map(a => <ArtistCard key={a.artist_id} artist={a} />)}
                            </div>
                        </section>
                    )}
                    {results.albums.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-4">Albums</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {results.albums.map(a => <AlbumCard key={a.album_id} album={a} />)}
                            </div>
                        </section>
                    )}
                    {results.songs.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-4">Songs</h2>
                            <div className="glass rounded-xl overflow-hidden">
                                {results.songs.map((s, i) => <SongRow key={s.song_id} song={s} index={i + 1} showAlbum />)}
                            </div>
                        </section>
                    )}
                    {results.artists.length === 0 && results.albums.length === 0 && results.songs.length === 0 && (
                        <p className="text-spotify-subtle text-center py-12">No results found for "{query}"</p>
                    )}
                </div>
            ) : !results && (
                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-bold mb-4">Browse Artists</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {allArtists.map(a => <ArtistCard key={a.artist_id} artist={a} />)}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold mb-4">Browse Albums</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {allAlbums.map(a => <AlbumCard key={a.album_id} album={a} />)}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
