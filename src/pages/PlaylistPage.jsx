import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistById, getPlaylistSongs, getUserById, getSongArtists, getAlbumById } from '../services/api';
import { SongRow } from '../components/Cards';
import { Play, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function PlaylistPage() {
    const { id } = useParams();
    const { playAlbum } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [owner, setOwner] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
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
        }
        load();
    }, [id]);

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
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => playAlbum(songs.map(s => s.song_id))} className="w-14 h-14 rounded-full bg-spotify-green flex items-center justify-center hover:scale-105 transition shadow-lg shadow-spotify-green/20">
                        <Play size={24} className="text-black ml-0.5" />
                    </button>
                </div>
                {songs.length > 0 ? (
                    <div className="space-y-0.5">
                        {songs.map((song, i) => (
                            <SongRow key={song.song_id} song={song} index={i + 1} showAlbum />
                        ))}
                    </div>
                ) : (
                    <p className="text-spotify-subtle text-center py-12">This playlist is empty.</p>
                )}
            </div>
        </div>
    );
}
