import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import LikedSongsPage from './pages/LikedSongsPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistPage from './pages/PlaylistPage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import ChartsPage from './pages/ChartsPage';
import AdminPage from './pages/AdminPage';
import WrappedPage from './pages/WrappedPage';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-spotify-black flex items-center justify-center text-spotify-subtle">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

function AppLayout() {
  return (
    <PlayerProvider>
      <div className="flex h-screen overflow-hidden bg-spotify-black">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <PlayerBar />
        </div>
      </div>
    </PlayerProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/liked" element={<LikedSongsPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/charts" element={<ChartsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/wrapped" element={<WrappedPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
