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
import { VIDEO_CATEGORIES } from './data/videoCategories';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'premium' | 'library' | 'playlist' | 'dj' | 'downloads' | 'uploads'>('home');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const { djState } = usePlayer();

  const isVideoActive = Boolean(djState.themeBackground && djState.themeBackground !== 'none' && !djState.nebulaMode);
  const activeCategory = VIDEO_CATEGORIES.find(c => c.id === djState.themeBackground) || VIDEO_CATEGORIES[0];
  const activeVideoUrl = isVideoActive
    ? (djState.themeBackground?.startsWith('http') ? djState.themeBackground : (activeCategory?.videoUrl || VIDEO_CATEGORIES[0].videoUrl))
    : '';

  useEffect(() => {
    // Clear all existing theme and video classes
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-') || c === 'video-bg-active' || c === 'nebula-active');
    classesToRemove.forEach(c => document.body.classList.remove(c));
    
    // Add active theme classes
    if (djState.nebulaMode) {
      document.body.classList.add('nebula-active');
    } else if (isVideoActive) {
      document.body.classList.add('video-bg-active');
      if (djState.themeBackground) {
        document.body.classList.add(`theme-${djState.themeBackground}`);
      }
    }
  }, [djState.nebulaMode, djState.themeBackground, isVideoActive]);

  const navigateToPlaylist = (id: string) => {
    setActivePlaylistId(id);
    setActiveTab('playlist');
  };

  return (
    <>
      {/* Real Video Background Across Entire App */}
      {isVideoActive && activeVideoUrl && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <video
            key={activeVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              opacity: 0.85,
              filter: 'brightness(0.88) contrast(1.08)',
              transition: 'opacity 0.5s ease',
            }}
          >
            <source src={activeVideoUrl} type={activeVideoUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          </video>
          {/* Subtle vignette/contrast overlay so text and controls are 100% crisp & readable */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.48) 100%)',
            }}
          />
        </div>
      )}
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
