import { useState, useEffect, useCallback } from 'react';
import { getSongs, getUsers, getAlbums, addSong, updateSong, deleteSong, addUser, updateUser, deleteUser, getSongArtists } from '../services/api';
import { Settings, Plus, Pencil, Trash2, X } from 'lucide-react';

const tabs = ['Songs', 'Users'];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('Songs');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => setRefreshKey(r => r + 1);

    return (
        <div className="p-6 pb-28 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="text-spotify-green" /> Admin Panel</h1>
                    <p className="text-spotify-subtle text-sm mt-1">Manage database records — Insert, Update, Delete</p>
                </div>
                <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition">
                    <Plus size={16} /> Add {activeTab.slice(0, -1)}
                </button>
            </div>

            <div className="flex gap-2 mb-6">
                {tabs.map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === t ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {activeTab === 'Songs' && <SongsTable onEdit={(item) => { setEditItem(item); setShowModal(true); }} refreshKey={refreshKey} onRefresh={handleRefresh} />}
            {activeTab === 'Users' && <UsersTable onEdit={(item) => { setEditItem(item); setShowModal(true); }} refreshKey={refreshKey} onRefresh={handleRefresh} />}

            {showModal && (
                <Modal type={activeTab.slice(0, -1)} item={editItem} onClose={() => { setShowModal(false); setEditItem(null); }} onSave={handleRefresh} />
            )}
        </div>
    );
}

function SongsTable({ onEdit, refreshKey, onRefresh }) {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songArtists, setSongArtists] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [s, al] = await Promise.all([getSongs(), getAlbums()]);
            setSongs(s.slice(0, 30));
            setAlbums(al);
            // Load artists for first 30 songs
            const artistMap = {};
            await Promise.all(s.slice(0, 30).map(async (song) => {
                const artists = await getSongArtists(song.song_id);
                artistMap[song.song_id] = artists.map(a => `${a.artist_name} (${a.role})`).join(', ');
            }));
            setSongArtists(artistMap);
            setLoading(false);
        }
        load();
    }, [refreshKey]);

    const handleDelete = async (id) => {
        if (confirm('Delete this song?')) {
            await deleteSong(id);
            onRefresh();
        }
    };

    if (loading) return <div className="text-spotify-subtle animate-pulse py-8 text-center">Loading songs...</div>;

    return (
        <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-spotify-subtle text-left">
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Title</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Album</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Duration</th>
                        <th className="px-4 py-3 font-semibold">Artists</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map(song => {
                        const album = albums.find(a => a.album_id === song.album_id);
                        return (
                            <tr key={song.song_id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="px-4 py-3 text-spotify-subtle">{song.song_id}</td>
                                <td className="px-4 py-3 font-medium">{song.title}</td>
                                <td className="px-4 py-3 text-spotify-subtle hidden md:table-cell">{album?.title || '—'}</td>
                                <td className="px-4 py-3 text-spotify-subtle hidden md:table-cell">{Math.floor(song.duration_seconds / 60)}:{String(song.duration_seconds % 60).padStart(2, '0')}</td>
                                <td className="px-4 py-3 text-spotify-subtle text-xs max-w-[200px] truncate">{songArtists[song.song_id] || '—'}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button onClick={() => onEdit(song)} className="p-1.5 rounded-lg hover:bg-white/10 transition text-spotify-subtle hover:text-white"><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(song.song_id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition text-spotify-subtle hover:text-red-400"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function UsersTable({ onEdit, refreshKey, onRefresh }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const u = await getUsers();
            setUsers(u);
            setLoading(false);
        }
        load();
    }, [refreshKey]);

    const handleDelete = async (id) => {
        if (confirm('Delete this user?')) {
            await deleteUser(id);
            onRefresh();
        }
    };

    if (loading) return <div className="text-spotify-subtle animate-pulse py-8 text-center">Loading users...</div>;

    return (
        <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-spotify-subtle text-left">
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Country</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">DOB</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-4 py-3 text-spotify-subtle">{user.user_id}</td>
                            <td className="px-4 py-3 font-medium">{user.name}</td>
                            <td className="px-4 py-3 text-spotify-subtle">{user.email}</td>
                            <td className="px-4 py-3 text-spotify-subtle hidden md:table-cell">{user.country}</td>
                            <td className="px-4 py-3 text-spotify-subtle hidden md:table-cell">{user.date_of_birth}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(user)} className="p-1.5 rounded-lg hover:bg-white/10 transition text-spotify-subtle hover:text-white"><Pencil size={14} /></button>
                                    <button onClick={() => handleDelete(user.user_id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition text-spotify-subtle hover:text-red-400"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Modal({ type, item, onClose, onSave }) {
    const isEdit = !!item;
    const [albums, setAlbums] = useState([]);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState(
        type === 'Song'
            ? { title: item?.title || '', duration_seconds: item?.duration_seconds || 200, album_id: item?.album_id || 1, release_date: item?.release_date || '2025-01-01' }
            : { name: item?.name || '', email: item?.email || '', date_of_birth: item?.date_of_birth || '2000-01-01', country: item?.country || '' }
    );

    useEffect(() => {
        if (type === 'Song') {
            getAlbums().then(setAlbums);
        }
    }, [type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        if (type === 'Song') {
            if (isEdit) await updateSong(item.song_id, form);
            else await addSong(form);
        } else {
            if (isEdit) await updateUser(item.user_id, form);
            else await addUser(form);
        }
        setSaving(false);
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-spotify-dark rounded-2xl p-6 w-full max-w-md border border-white/10 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">{isEdit ? 'Edit' : 'Add'} {type}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'Song' ? (
                        <>
                            <Field label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
                            <Field label="Duration (seconds)" type="number" value={form.duration_seconds} onChange={v => setForm({ ...form, duration_seconds: Number(v) })} />
                            <div>
                                <label className="block text-xs text-spotify-subtle mb-1.5">Album</label>
                                <select value={form.album_id} onChange={e => setForm({ ...form, album_id: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green">
                                    {albums.map(a => <option key={a.album_id} value={a.album_id}>{a.title}</option>)}
                                </select>
                            </div>
                            <Field label="Release Date" type="date" value={form.release_date} onChange={v => setForm({ ...form, release_date: v })} />
                        </>
                    ) : (
                        <>
                            <Field label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                            <Field label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                            <Field label="Date of Birth" type="date" value={form.date_of_birth} onChange={v => setForm({ ...form, date_of_birth: v })} />
                            <Field label="Country" value={form.country} onChange={v => setForm({ ...form, country: v })} />
                        </>
                    )}
                    <button type="submit" disabled={saving} className="w-full py-3 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-spotify-green-dark transition disabled:opacity-50">
                        {saving ? 'Saving...' : (isEdit ? 'Update' : 'Add')} {!saving && type}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Field({ label, type = 'text', value, onChange }) {
    return (
        <div>
            <label className="block text-xs text-spotify-subtle mb-1.5">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-spotify-green transition" required />
        </div>
    );
}
