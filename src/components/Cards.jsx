import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getArtistById, isLiked, toggleLike } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function ArtistCard({ artist }) {
    return (
        <Link to={`/artist/${artist.artist_id}`} className="hover-card group p-4 rounded-xl bg-spotify-card/50 block">
            <div className="relative mb-4">
                <img
                    src={`https://picsum.photos/seed/${artist.artist_name.toLowerCase().replace(/\s/g, '')}/400/400`}
                    alt={artist.artist_name}
                    className="w-full aspect-square rounded-full object-cover shadow-lg shadow-black/40"
                />
                <div className="play-button-overlay absolute bottom-2 right-2">
                    <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center shadow-xl shadow-black/40 hover:scale-105 transition">
                        <Play size={20} className="text-black ml-0.5" />
                    </div>
                </div>
            </div>
            <h3 className="text-sm font-semibold truncate">{artist.artist_name}</h3>
            <p className="text-xs text-spotify-subtle mt-1">{artist.genre} · {artist.country}</p>
        </Link>
    );
}

export function AlbumCard({ album }) {
    const [artistName, setArtistName] = useState('');

    useEffect(() => {
        getArtistById(album.artist_id).then(a => setArtistName(a?.artist_name || ''));
    }, [album.artist_id]);

    return (
        <Link to={`/album/${album.album_id}`} className="hover-card group p-4 rounded-xl bg-spotify-card/50 block">
            <div className="relative mb-4">
                <img
                    src={`https://picsum.photos/seed/album${album.album_id}/300/300`}
                    alt={album.title}
                    className="w-full aspect-square rounded-lg object-cover shadow-lg shadow-black/40"
                />
                <div className="play-button-overlay absolute bottom-2 right-2">
                    <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center shadow-xl shadow-black/40 hover:scale-105 transition">
                        <Play size={20} className="text-black ml-0.5" />
                    </div>
                </div>
            </div>
            <h3 className="text-sm font-semibold truncate">{album.title}</h3>
            <p className="text-xs text-spotify-subtle mt-1">{artistName}</p>
        </Link>
    );
}

export function SongRow({ song, index, showAlbum = false, onLikeChange }) {
    const { playSong, currentSong, isPlaying } = usePlayer();
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const isCurrentlyPlaying = currentSong?.song_id === song.song_id;

    useEffect(() => {
        if (user && song.song_id) {
            isLiked(user.user_id, song.song_id).then(setLiked);
        }
    }, [user, song.song_id]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user || likeLoading) return;
        setLikeLoading(true);
        const newLiked = await toggleLike(user.user_id, song.song_id);
        setLiked(newLiked);
        setLikeLoading(false);
        if (onLikeChange) onLikeChange(song.song_id, newLiked);
    };

    const formatDuration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div
            onClick={() => playSong(song.song_id)}
            className={`flex items-center gap-4 px-4 py-2.5 rounded-lg cursor-pointer group transition-all duration-200 ${isCurrentlyPlaying ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
        >
            <span className={`w-6 text-center text-sm ${isCurrentlyPlaying ? 'text-spotify-green font-semibold' : 'text-spotify-subtle group-hover:text-white'}`}>
                {isCurrentlyPlaying && isPlaying ? (
                    <span className="inline-flex gap-[2px]">
                        <span className="w-[3px] h-3 bg-spotify-green rounded-full animate-pulse" />
                        <span className="w-[3px] h-4 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-[3px] h-2 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </span>
                ) : (
                    index
                )}
            </span>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isCurrentlyPlaying ? 'text-spotify-green' : ''}`}>{song.title}</p>
                {song.artistNames && <p className="text-xs text-spotify-subtle truncate">{song.artistNames}</p>}
            </div>
            {showAlbum && song.albumTitle && (
                <p className="text-xs text-spotify-subtle w-40 truncate hidden md:block">{song.albumTitle}</p>
            )}
            {song.streams && (
                <p className="text-xs text-spotify-subtle w-24 text-right hidden md:block">{song.streams.toLocaleString()} plays</p>
            )}
            {/* Like Button */}
            <button
                onClick={handleLike}
                className={`p-1.5 rounded-full transition-all duration-200 ${liked
                        ? 'text-spotify-green hover:text-spotify-green-dark'
                        : 'text-spotify-subtle opacity-0 group-hover:opacity-100 hover:text-white'
                    } ${liked ? 'opacity-100' : ''}`}
                title={liked ? 'Unlike' : 'Like'}
            >
                <Heart size={16} className={liked ? 'fill-spotify-green' : ''} />
            </button>
            <span className="text-xs text-spotify-subtle w-12 text-right">{formatDuration(song.duration_seconds)}</span>
        </div>
    );
}
