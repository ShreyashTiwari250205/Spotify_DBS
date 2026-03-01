import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music2 } from 'lucide-react';

const demoAccounts = [
    { email: 'demo@spotify.dbs', name: 'Demo User' },
    { email: 'shreyas@spotify.dbs', name: 'Shreyas M' },
    { email: 'admin@spotify.dbs', name: 'Admin Panel' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) navigate('/');
        else setError(result.error);
    };

    const handleDemoLogin = async (account) => {
        setLoading(true);
        const result = await login(account.email, 'unused');
        setLoading(false);
        if (result.success) navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-spotify-card to-spotify-black flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-spotify-green flex items-center justify-center mb-4 animate-pulse-glow">
                        <Music2 size={32} className="text-black" />
                    </div>
                    <h1 className="text-3xl font-bold">Spotify <span className="text-spotify-green">DBS</span></h1>
                    <p className="text-spotify-subtle mt-2 text-sm">Database Management System Project</p>
                </div>

                {/* Login Form */}
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-semibold mb-6 text-center">Log in to continue</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-spotify-subtle mb-1.5">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition placeholder:text-white/20"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-spotify-subtle mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition placeholder:text-white/20"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs text-spotify-subtle text-center mb-3">Quick demo login</p>
                        <div className="space-y-2">
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.email}
                                    onClick={() => handleDemoLogin(account)}
                                    disabled={loading}
                                    className="w-full py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition flex items-center justify-between group disabled:opacity-50"
                                >
                                    <span>{account.name}</span>
                                    <span className="text-xs text-spotify-subtle group-hover:text-spotify-green transition">{account.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-spotify-subtle mt-6">
                    BITS Pilani — DBMS Project · Semester 6
                </p>
            </div>
        </div>
    );
}
