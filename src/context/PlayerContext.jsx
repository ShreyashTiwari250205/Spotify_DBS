import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { getSongById, getSongArtists } from '../services/api';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    const playSong = useCallback(async (songId) => {
        const song = await getSongById(songId);
        if (!song) return;
        const artists = await getSongArtists(songId);
        setCurrentSong({ ...song, artists });
        setIsPlaying(true);
        setProgress(0);

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current);
                    setIsPlaying(false);
                    return 100;
                }
                return prev + (100 / song.duration_seconds);
            });
        }, 1000);
    }, []);

    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const playAlbum = useCallback((songIds) => {
        if (songIds.length === 0) return;
        setQueue(songIds.slice(1));
        playSong(songIds[0]);
    }, [playSong]);

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, progress, queue, playSong, togglePlay, playAlbum }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
