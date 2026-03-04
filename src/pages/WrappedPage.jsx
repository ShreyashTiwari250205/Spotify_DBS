import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWrapped } from '../services/api';
import { Sparkles, Music, Clock, Disc, User, Headphones } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#1DB954', '#1ed760', '#15803d', '#4ade80', '#86efac', '#a3e635'];

export default function WrappedPage() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getUserWrapped(user.user_id).then(d => { setData(d); setLoading(false); });
        }
    }, [user]);

    if (loading) return <div className="p-6 text-spotify-subtle animate-pulse text-lg">Loading your stats...</div>;
    if (!data) return (
        <div className="p-6 pb-28 animate-fade-in text-center py-20">
            <Sparkles size={48} className="mx-auto text-spotify-subtle mb-4" />
            <p className="text-spotify-subtle text-lg">No listening history yet.</p>
            <p className="text-spotify-subtle text-sm mt-2">Start playing songs to see your personal stats!</p>
        </div>
    );

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-spotify-dark border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
                {payload.map((p, i) => <p key={i} style={{ color: p.color || '#fff' }}>{p.name}: {p.value}</p>)}
            </div>
        );
    };

    return (
        <div className="p-6 pb-28 animate-fade-in space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-spotify-green/20 via-emerald-900/30 to-spotify-black p-8">
                <Sparkles size={120} className="absolute -top-4 -right-4 text-spotify-green/10" />
                <div className="relative">
                    <p className="text-xs uppercase tracking-[0.3em] text-spotify-green font-semibold mb-2">Your Music Stats</p>
                    <h1 className="text-3xl font-black mb-1">{user?.name}'s Wrapped</h1>
                    <p className="text-spotify-subtle text-sm">Your personal listening overview</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-5 text-center">
                    <Clock className="mx-auto text-spotify-green mb-2" size={24} />
                    <p className="text-2xl font-black">{data.totalMinutes.toLocaleString()}</p>
                    <p className="text-xs text-spotify-subtle">Minutes Listened</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <Headphones className="mx-auto text-blue-400 mb-2" size={24} />
                    <p className="text-2xl font-black">{data.totalStreams}</p>
                    <p className="text-xs text-spotify-subtle">Total Streams</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <Music className="mx-auto text-purple-400 mb-2" size={24} />
                    <p className="text-2xl font-black">{data.uniqueSongs}</p>
                    <p className="text-xs text-spotify-subtle">Unique Songs</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <User className="mx-auto text-pink-400 mb-2" size={24} />
                    <p className="text-2xl font-black">{data.uniqueArtists}</p>
                    <p className="text-xs text-spotify-subtle">Unique Artists</p>
                </div>
            </div>

            {/* Top Genre Banner */}
            {data.topGenre && (
                <div className="glass rounded-xl p-6 flex items-center gap-4">
                    <Disc className="text-spotify-green flex-shrink-0" size={36} />
                    <div>
                        <p className="text-xs text-spotify-subtle">Your Favorite Genre</p>
                        <p className="text-xl font-bold">{data.topGenre.genre}</p>
                        <p className="text-xs text-spotify-subtle">{data.topGenre.count} plays</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Artists */}
                {data.topArtists.length > 0 && (
                    <section className="glass rounded-xl p-6">
                        <h2 className="text-lg font-bold mb-4">Your Top Artists</h2>
                        <div className="space-y-3">
                            {data.topArtists.map((a, i) => (
                                <div key={a.artist_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition">
                                    <span className="text-xl font-black text-spotify-green w-8 text-center">{i + 1}</span>
                                    <img src={`https://picsum.photos/seed/${(a.artist_name || '').toLowerCase().replace(/\s/g, '')}/80/80`} alt="" className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{a.artist_name}</p>
                                        <p className="text-xs text-spotify-subtle">{a.genre}</p>
                                    </div>
                                    <span className="text-sm text-spotify-subtle">{a.plays} plays</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Genre Breakdown Pie */}
                {data.genreBreakdown.length > 0 && (
                    <section className="glass rounded-xl p-6">
                        <h2 className="text-lg font-bold mb-4">Genre Breakdown</h2>
                        <div className="flex items-center justify-center gap-4">
                            <ResponsiveContainer width="55%" height={220}>
                                <PieChart>
                                    <Pie data={data.genreBreakdown} dataKey="count" nameKey="genre" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                                        {data.genreBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {data.genreBreakdown.map((g, i) => (
                                    <div key={g.genre} className="flex items-center gap-2 text-sm">
                                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-spotify-subtle">{g.genre}</span>
                                        <span className="font-semibold">{g.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Top Songs Bar Chart */}
            {data.topSongs.length > 0 && (
                <section className="glass rounded-xl p-6">
                    <h2 className="text-lg font-bold mb-4">Your Most Played Songs</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.topSongs.map(s => ({ ...s, name: s.title?.length > 20 ? s.title.slice(0, 20) + '…' : s.title }))} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" stroke="#a7a7a7" tick={{ fontSize: 11 }} />
                            <YAxis dataKey="name" type="category" width={130} stroke="#a7a7a7" tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="plays" name="Plays" radius={[0, 6, 6, 0]}>
                                {data.topSongs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </section>
            )}
        </div>
    );
}
