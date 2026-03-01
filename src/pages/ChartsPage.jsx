import { useState, useEffect } from 'react';
import { getTopSongs, getMostPopularArtist, getMostCollaborativeArtist, getDeviceDistribution, getSubscriptionRevenue, getSongArtists, getAlbumById } from '../services/api';
import { SongRow } from '../components/Cards';
import { BarChart3, Crown, Users, Smartphone, DollarSign, TrendingUp } from 'lucide-react';

export default function ChartsPage() {
    const [topSongs, setTopSongs] = useState([]);
    const [popArtist, setPopArtist] = useState(null);
    const [collabArtist, setCollabArtist] = useState(null);
    const [devices, setDevices] = useState([]);
    const [revenue, setRevenue] = useState({ total: '0', breakdown: { Premium: 0, Family: 0 } });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [ts, pa, ca, dev, rev] = await Promise.all([
                getTopSongs(15),
                getMostPopularArtist(),
                getMostCollaborativeArtist(),
                getDeviceDistribution(),
                getSubscriptionRevenue(),
            ]);

            // Enrich top songs
            const enriched = await Promise.all(ts.map(async (s) => {
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

            setTopSongs(enriched);
            setPopArtist(pa);
            setCollabArtist(ca);
            setDevices(dev);
            setRevenue(rev);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading...</div>;

    const maxDevice = devices.length > 0 ? devices[0].count : 1;

    return (
        <div className="p-6 pb-28 animate-fade-in space-y-10">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-spotify-green" /> Global Charts & Analytics</h1>
                <p className="text-spotify-subtle text-sm mt-1">Platform-wide analytics from listening history</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-5">
                    <Crown className="text-yellow-500 mb-2" size={22} />
                    <p className="text-xs text-spotify-subtle mb-1">Most Popular Artist</p>
                    <p className="font-bold">{popArtist?.artist_name || '—'}</p>
                    <p className="text-xs text-spotify-subtle">{popArtist?.streams || 0} streams</p>
                </div>
                <div className="glass rounded-xl p-5">
                    <Users className="text-blue-400 mb-2" size={22} />
                    <p className="text-xs text-spotify-subtle mb-1">Most Collaborative</p>
                    <p className="font-bold">{collabArtist?.artist_name || '—'}</p>
                    <p className="text-xs text-spotify-subtle">{collabArtist?.collaborations || 0} features</p>
                </div>
                <div className="glass rounded-xl p-5">
                    <TrendingUp className="text-spotify-green mb-2" size={22} />
                    <p className="text-xs text-spotify-subtle mb-1">Total Streams</p>
                    <p className="font-bold">{topSongs.reduce((sum, s) => sum + (s.streams || 0), 0).toLocaleString()}</p>
                    <p className="text-xs text-spotify-subtle">top 15 combined</p>
                </div>
                <div className="glass rounded-xl p-5">
                    <DollarSign className="text-emerald-400 mb-2" size={22} />
                    <p className="text-xs text-spotify-subtle mb-1">Subscription Revenue</p>
                    <p className="font-bold">${revenue.total}</p>
                    <p className="text-xs text-spotify-subtle">{revenue.breakdown.Premium}P / {revenue.breakdown.Family}F</p>
                </div>
            </div>

            {topSongs.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-spotify-green" /> Top 15 Most Streamed
                    </h2>
                    <div className="glass rounded-xl overflow-hidden">
                        {topSongs.map((song, i) => (
                            <SongRow key={song.song_id} song={song} index={i + 1} showAlbum />
                        ))}
                    </div>
                </section>
            )}

            {devices.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Smartphone size={18} className="text-blue-400" /> Device Distribution
                    </h2>
                    <div className="glass rounded-xl p-6 space-y-4">
                        {devices.map(d => (
                            <div key={d.device} className="flex items-center gap-4">
                                <span className="w-28 text-sm text-spotify-subtle">{d.device}</span>
                                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.count / maxDevice) * 100}%`, background: 'linear-gradient(90deg, #1DB954, #1ed760)' }} />
                                </div>
                                <span className="text-sm font-semibold w-16 text-right">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
