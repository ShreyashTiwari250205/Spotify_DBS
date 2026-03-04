import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, ListMusic, Heart, BarChart3, Settings, LogOut, Music2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
            ? 'bg-spotify-card text-white'
            : 'text-spotify-subtle hover:text-white hover:bg-white/5'
        }`;

    return (
        <aside className="w-64 bg-spotify-black flex flex-col h-full border-r border-white/5">
            {/* Logo */}
            <div className="px-6 py-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-spotify-green flex items-center justify-center">
                    <Music2 size={20} className="text-black" />
                </div>
                <span className="text-xl font-bold tracking-tight">Spotify <span className="text-spotify-green text-xs font-normal">DBS</span></span>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-3 space-y-1 mt-2">
                <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-widest text-spotify-subtle">Menu</p>
                <NavLink to="/" className={linkClass} end><Home size={18} />Home</NavLink>
                <NavLink to="/search" className={linkClass}><Search size={18} />Search</NavLink>
                <NavLink to="/library" className={linkClass}><Library size={18} />My Library</NavLink>

                <div className="my-4 border-t border-white/5" />

                <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-widest text-spotify-subtle">Your Music</p>
                <NavLink to="/liked" className={linkClass}><Heart size={18} />Liked Songs</NavLink>
                <NavLink to="/playlists" className={linkClass}><ListMusic size={18} />Playlists</NavLink>
                <NavLink to="/wrapped" className={linkClass}><Sparkles size={18} />My Stats</NavLink>

                <div className="my-4 border-t border-white/5" />

                <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-widest text-spotify-subtle">Management</p>
                <NavLink to="/charts" className={linkClass}><BarChart3 size={18} />Top Charts</NavLink>
                <NavLink to="/admin" className={linkClass}><Settings size={18} />Admin Panel</NavLink>
            </nav>

            {/* User Info */}
            {user && (
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-spotify-green to-emerald-700 flex items-center justify-center text-sm font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-[11px] text-spotify-subtle truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs text-spotify-subtle hover:text-white transition w-full px-2 py-1.5 rounded hover:bg-white/5"
                    >
                        <LogOut size={14} /> Log out
                    </button>
                </div>
            )}
        </aside>
    );
}
