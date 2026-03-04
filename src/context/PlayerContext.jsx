import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { getSongById, getSongArtists, recordListen } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PlayerContext = createContext(null);

// Royalty-free sample audio URLs (short clips for demo)
const SAMPLE_AUDIO = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
];

export function PlayerProvider({ children }) {
    const { user } = useAuth();
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [queue, setQueue] = useState([]);
    const audioRef = useRef(new Audio());

    // Setup audio event listeners
    useEffect(() => {
        const audio = audioRef.current;

        const onTimeUpdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const onEnded = () => {
            setIsPlaying(false);
            setProgress(100);
            // Auto-play next in queue
            if (queue.length > 0) {
                const next = queue[0];
                setQueue(q => q.slice(1));
                playSong(next);
            }
        };

        const onError = () => {
            // Fallback to simulated progress if audio fails
            console.warn('Audio failed to load, using simulated playback');
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
            audio.pause();
        };
    }, [queue]);

    // Volume sync
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const playSong = useCallback(async (songId) => {
        const song = await getSongById(songId);
        if (!song) return;
        const artists = await getSongArtists(songId);
        setCurrentSong({ ...song, artists });
        setProgress(0);

        // Record to listening history
        if (user) {
            recordListen(user.user_id, songId, 'Web');
        }

        // Pick a sample audio based on song ID
        const audio = audioRef.current;
        const audioUrl = SAMPLE_AUDIO[(songId - 1) % SAMPLE_AUDIO.length];
        audio.src = audioUrl;
        audio.volume = volume;
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            // Fallback: simulate playback if autoplay blocked
            setIsPlaying(true);
            simulatePlayback(song.duration_seconds);
        });
    }, [user, volume]);

    // Fallback simulated playback
    const simulateRef = useRef(null);
    const simulatePlayback = (durationSecs) => {
        if (simulateRef.current) clearInterval(simulateRef.current);
        let elapsed = 0;
        simulateRef.current = setInterval(() => {
            elapsed += 1;
            setProgress((elapsed / durationSecs) * 100);
            if (elapsed >= durationSecs) {
                clearInterval(simulateRef.current);
                setIsPlaying(false);
            }
        }, 1000);
    };

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            if (simulateRef.current) clearInterval(simulateRef.current);
        } else {
            audio.play().catch(() => {
                if (currentSong) simulatePlayback(currentSong.duration_seconds);
            });
        }
        setIsPlaying(prev => !prev);
    }, [isPlaying, currentSong]);

    const seek = useCallback((pct) => {
        const audio = audioRef.current;
        if (audio.duration) {
            audio.currentTime = (pct / 100) * audio.duration;
        }
        setProgress(pct);
    }, []);

    const changeVolume = useCallback((v) => {
        setVolume(v);
        audioRef.current.volume = v;
    }, []);

    const playAlbum = useCallback((songIds) => {
        if (songIds.length === 0) return;
        setQueue(songIds.slice(1));
        playSong(songIds[0]);
    }, [playSong]);

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, progress, duration, volume, queue, playSong, togglePlay, playAlbum, seek, changeVolume }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
