import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { getSongById, getSongArtists, getSongs, recordListen } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PlayerContext = createContext(null);

// Royalty-free sample audio URLs
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
    const [history, setHistory] = useState([]); // tracks played songs for "previous"
    const audioRef = useRef(new Audio());
    const simulateRef = useRef(null);

    // Use refs to avoid stale closures in audio event callbacks
    const queueRef = useRef(queue);
    const currentSongRef = useRef(currentSong);
    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);

    // Internal play function (not useCallback to avoid circular deps)
    const playById = async (songId) => {
        if (simulateRef.current) clearInterval(simulateRef.current);

        const song = await getSongById(songId);
        if (!song) return;
        const artists = await getSongArtists(songId);
        const fullSong = { ...song, artists };
        setCurrentSong(fullSong);
        currentSongRef.current = fullSong;
        setProgress(0);

        if (user) {
            recordListen(user.user_id, songId, 'Web');
        }

        const audio = audioRef.current;
        const audioUrl = SAMPLE_AUDIO[(songId - 1) % SAMPLE_AUDIO.length];
        audio.src = audioUrl;
        audio.volume = volume;
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            setIsPlaying(true);
            simulatePlayback(song.duration_seconds);
        });
    };

    const simulatePlayback = (durationSecs) => {
        if (simulateRef.current) clearInterval(simulateRef.current);
        let elapsed = 0;
        simulateRef.current = setInterval(() => {
            elapsed += 1;
            setProgress((elapsed / durationSecs) * 100);
            if (elapsed >= durationSecs) {
                clearInterval(simulateRef.current);
                setIsPlaying(false);
                // Auto-advance via queue ref
                advanceQueue();
            }
        }, 1000);
    };

    const advanceQueue = () => {
        const q = queueRef.current;
        if (q.length > 0) {
            const nextId = q[0];
            setQueue(q.slice(1));
            queueRef.current = q.slice(1);
            // Save current to history
            if (currentSongRef.current) {
                setHistory(h => [...h, currentSongRef.current.song_id]);
            }
            playById(nextId);
        }
    };

    // Audio event listeners — registered once
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
            advanceQueue();
        };

        const onError = () => {
            console.warn('Audio load error, falling back to simulation');
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
    }, []); // empty deps — register once

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Public: play a single song, auto-build queue from all songs
    const playSong = useCallback(async (songId) => {
        // Save current to history
        if (currentSongRef.current) {
            setHistory(h => [...h, currentSongRef.current.song_id]);
        }
        // Build a queue from all songs starting after this one
        try {
            const allSongs = await getSongs();
            const idx = allSongs.findIndex(s => s.song_id === songId);
            if (idx >= 0) {
                const rest = allSongs.slice(idx + 1).map(s => s.song_id);
                setQueue(rest);
                queueRef.current = rest;
            }
        } catch {
            // If song list fails, just play the single song
        }
        playById(songId);
    }, [user, volume]);

    // Public: play a list of songs (album, playlist, etc.)
    const playAlbum = useCallback((songIds) => {
        if (songIds.length === 0) return;
        if (currentSongRef.current) {
            setHistory(h => [...h, currentSongRef.current.song_id]);
        }
        const rest = songIds.slice(1);
        setQueue(rest);
        queueRef.current = rest;
        playById(songIds[0]);
    }, [user, volume]);

    // Public: skip to next
    const skipNext = useCallback(() => {
        advanceQueue();
    }, []);

    // Public: skip to previous
    const skipBack = useCallback(() => {
        const audio = audioRef.current;
        // If more than 3 seconds in, restart current song
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            setProgress(0);
            return;
        }
        // Otherwise go to previous song
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const prevId = prev[prev.length - 1];
            // Push current song back to front of queue
            if (currentSongRef.current) {
                setQueue(q => {
                    const newQ = [currentSongRef.current.song_id, ...q];
                    queueRef.current = newQ;
                    return newQ;
                });
            }
            playById(prevId);
            return prev.slice(0, -1);
        });
    }, []);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            if (simulateRef.current) clearInterval(simulateRef.current);
        } else {
            audio.play().catch(() => {
                if (currentSongRef.current) simulatePlayback(currentSongRef.current.duration_seconds);
            });
        }
        setIsPlaying(prev => !prev);
    }, [isPlaying]);

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

    return (
        <PlayerContext.Provider value={{
            currentSong, isPlaying, progress, duration, volume, queue,
            playSong, togglePlay, playAlbum, seek, changeVolume, skipNext, skipBack,
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
