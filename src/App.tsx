import React, { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import MainView from './components/MainView';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import PlaylistView from './components/PlaylistView';
import BottomNav from './components/BottomNav';
import DJView from './components/DJView';
import ItunesSearchView from './components/ItunesSearchView';
import NebulaBackground from './components/NebulaBackground';
import DownloadsView from './components/DownloadsView';
import UploadsView from './components/UploadsView';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import FestiveThemeProvider from './components/FestiveTheme';
import { getCurrentFestiveTheme } from './utils/festivals';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'premium' | 'library' | 'playlist' | 'dj' | 'downloads' | 'uploads'>('home');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [creatingPlaylist, setCreatingPlaylist] = useState<boolean>(false);
  const { djState, songs: allSongs, setPlaylists } = usePlayer() as any;

  // ─── Auto-import shared playlist from URL param ───────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('playlist');
    if (!encoded || !allSongs?.length) return;

    try {
      const payload = JSON.parse(decodeURIComponent(encoded));
      const { n: name, songs: sharedSongs } = payload as { n: string; songs: any[] };
      if (!name || !Array.isArray(sharedSongs) || sharedSongs.length === 0) return;

      // Prefer library version (full audio), fall back to shared metadata
      const resolvedSongs = sharedSongs.map((shared: any) => {
        const libSong = allSongs.find((s: any) => s.id === shared.id);
        return libSong ?? shared;
      });

      // Single atomic update — avoids race condition of createPlaylist + addToPlaylist
      const newId = `shared-${Date.now()}`;
      setPlaylists((prev: any[]) => [
        ...prev,
        { id: newId, name: `${name} (shared)`, songs: resolvedSongs },
      ]);

      setActivePlaylistId(newId);
      setActiveTab('playlist');

      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } catch {
      // Malformed param — ignore
    }
  }, [allSongs]);



  useEffect(() => {
    // Clear theme and video classes
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-') || c === 'video-bg-active' || c === 'nebula-active');
    classesToRemove.forEach(c => document.body.classList.remove(c));

    if (djState.nebulaMode) {
      document.body.classList.add('nebula-active');
    }
  }, [djState.nebulaMode]);

  // Apply festival-active class so CSS can target it
  useEffect(() => {
    const festive = getCurrentFestiveTheme();
    if (festive) {
      document.body.classList.add('festival-active');
    } else {
      document.body.classList.remove('festival-active');
    }
    return () => document.body.classList.remove('festival-active');
  }, []);

  const navigateToPlaylist = (id: string) => {
    setActivePlaylistId(id);
    setActiveTab('playlist');
  };

  return (
    <>
      <NebulaBackground />
      <FestiveThemeProvider />
      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenPlaylist={navigateToPlaylist} />
        
        {activeTab === 'home' && <MainView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'library' && (
          <LibraryView 
            onOpenPlaylist={navigateToPlaylist} 
            onOpenUploads={() => setActiveTab('uploads')} 
            onCreatePlaylist={() => setCreatingPlaylist(true)}
          />
        )}
        {activeTab === 'playlist' && <PlaylistView playlistId={activePlaylistId} goHome={() => setActiveTab('home')} />}
        {activeTab === 'dj' && <DJView />}
        {activeTab === 'premium' && <ItunesSearchView />}
        {activeTab === 'downloads' && <DownloadsView />}
        {activeTab === 'uploads' && <UploadsView />}
        
        <Player />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Stationary fixed mobile FAB for creating playlist - outside .main-view so it never moves when scrolling */}
        {activeTab !== 'dj' && (
          <button
            className="mobile-create-playlist-fab"
            onClick={() => setCreatingPlaylist(true)}
            aria-label="Create Playlist"
            title="Create Playlist"
          >
            <Plus size={26} strokeWidth={2.6} />
          </button>
        )}

        {creatingPlaylist && (
          <CreatePlaylistModal
            onClose={() => setCreatingPlaylist(false)}
            onCreated={(id) => navigateToPlaylist(id)}
          />
        )}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default App;
