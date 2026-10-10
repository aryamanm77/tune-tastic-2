import React, { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
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

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'premium' | 'library' | 'playlist' | 'dj' | 'downloads' | 'uploads'>('home');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const { djState } = usePlayer();

  useEffect(() => {
    // Clear old themes
    document.body.classList.remove('nebula-active', 'theme-ocean-waves', 'theme-cyber-matrix', 'theme-deep-space');
    
    // Add new theme
    if (djState.nebulaMode) {
      document.body.classList.add('nebula-active');
    } else if (djState.themeBackground && djState.themeBackground !== 'none') {
      document.body.classList.add(djState.themeBackground);
    }
  }, [djState.nebulaMode, djState.themeBackground]);

  const navigateToPlaylist = (id: string) => {
    setActivePlaylistId(id);
    setActiveTab('playlist');
  };

  return (
    <>
      {/* Real Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -2,
          opacity: 0.6,
          filter: 'hue-rotate(30deg) brightness(0.8)'
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-purple-and-blue-neon-waves-22879-large.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: -1, pointerEvents: 'none' }} />
      <NebulaBackground />
      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenPlaylist={navigateToPlaylist} />
      
      {activeTab === 'home' && <MainView />}
      {activeTab === 'search' && <SearchView />}
      {activeTab === 'library' && <LibraryView onOpenPlaylist={navigateToPlaylist} onOpenUploads={() => setActiveTab('uploads')} />}
      {activeTab === 'playlist' && <PlaylistView playlistId={activePlaylistId} goHome={() => setActiveTab('home')} />}
      {activeTab === 'dj' && <DJView />}
      {activeTab === 'premium' && <ItunesSearchView />}
      {activeTab === 'downloads' && <DownloadsView />}
      {activeTab === 'uploads' && <UploadsView />}
      
      <Player />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
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
