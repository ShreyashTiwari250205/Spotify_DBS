import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { isLiked, toggleLike } from '../services/api';

export default function PlayerBar() {
    const { currentSong, isPlaying, progress, volume, togglePlay, seek, changeVolume } = usePlayer();
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        if (user && currentSong) {
            isLiked(user.user_id, currentSong.song_id).then(setLiked);
        } else {
            setLiked(false);
        }
    }, [user, currentSong?.song_id]);

    const handleLike = async () => {
        if (!user || !currentSong || likeLoading) return;
        setLikeLoading(true);
        const newLiked = await toggleLike(user.user_id, currentSong.song_id);
        setLiked(newLiked);
        setLikeLoading(false);
    };

    if (!currentSong) return (
        <div className="h-20 bg-spotify-dark border-t border-white/5 flex items-center justify-center">
            <p className="text-spotify-subtle text-sm">Select a song to start playing</p>
        </div>
    );

    const elapsed = Math.floor((progress / 100) * currentSong.duration_seconds);
    const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;

    const leadArtist = currentSong.artists?.find(a => a.role === 'Lead');
    const featuredArtists = currentSong.artists?.filter(a => a.role === 'Featured') || [];
    const artistStr = leadArtist
        ? leadArtist.artist_name + (featuredArtists.length ? ` ft. ${featuredArtists.map(a => a.artist_name).join(', ')}` : '')
        : 'Unknown';

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        seek(pct);
    };

    const handleVolume = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        changeVolume(v);
    };

    return (
        <div className="h-20 bg-spotify-dark border-t border-white/5 flex items-center px-4 gap-4 z-50">
            {/* Song Info */}
            <div className="flex items-center gap-3 w-72 min-w-0">
                <div className="w-14 h-14 rounded-md bg-spotify-card flex-shrink-0 overflow-hidden">
                    <img src={`https://picsum.photos/seed/song${currentSong.song_id}/56/56`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{currentSong.title}</p>
                    <p className="text-xs text-spotify-subtle truncate">{artistStr}</p>
                </div>
                <button onClick={handleLike} className={`p-1.5 rounded-full transition-all duration-200 flex-shrink-0 ${liked ? 'text-spotify-green' : 'text-spotify-subtle hover:text-white'}`}>
                    <Heart size={16} className={liked ? 'fill-spotify-green' : ''} />
                </button>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col items-center gap-1 max-w-[45%]">
                <div className="flex items-center gap-5">
                    <button className="text-spotify-subtle hover:text-white transition"><Shuffle size={16} /></button>
                    <button className="text-spotify-subtle hover:text-white transition"><SkipBack size={18} /></button>
                    <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition">
                        {isPlaying ? <Pause size={16} className="text-black" /> : <Play size={16} className="text-black ml-0.5" />}
                    </button>
                    <button className="text-spotify-subtle hover:text-white transition"><SkipForward size={18} /></button>
                    <button className="text-spotify-subtle hover:text-white transition"><Repeat size={16} /></button>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <span className="text-[11px] text-spotify-subtle w-10 text-right">{formatTime(elapsed)}</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer" onClick={handleSeek}>
                        <div className="h-full bg-spotify-green rounded-full transition-all duration-150 group-hover:bg-spotify-green" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[11px] text-spotify-subtle w-10">{formatTime(currentSong.duration_seconds)}</span>
                </div>
            </div>

            {/* Volume */}
            <div className="w-36 flex items-center gap-2 justify-end">
                <button onClick={() => changeVolume(volume > 0 ? 0 : 0.7)} className="text-spotify-subtle hover:text-white transition">
                    {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group" onClick={handleVolume}>
                    <div className="h-full bg-white/50 group-hover:bg-spotify-green rounded-full transition" style={{ width: `${volume * 100}%` }} />
                </div>
            </div>
        </div>
    );
}
