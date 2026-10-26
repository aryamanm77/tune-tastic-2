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
import FestiveGreeting from './components/FestiveGreeting';
import { getCurrentFestiveTheme } from './utils/festivals';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'premium' | 'library' | 'playlist' | 'dj' | 'downloads' | 'uploads'>('home');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [creatingPlaylist, setCreatingPlaylist] = useState<boolean>(false);
  const { djState, songs: allSongs, setPlaylists } = usePlayer() as any;

  // Pending shared playlist waiting for user confirmation
  const [sharedPlaylist, setSharedPlaylist] = useState<{ name: string; songs: any[] } | null>(null);

  // ─── Detect shared playlist from URL param ───────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('playlist');
    if (!encoded || !allSongs?.length) return;

    try {
      const payload = JSON.parse(decodeURIComponent(encoded));
      const { n: name, songs: sharedSongs } = payload as { n: string; songs: any[] };
      if (!name || !Array.isArray(sharedSongs) || sharedSongs.length === 0) return;

      // Prefer library version (has full audio), fall back to shared metadata
      const resolvedSongs = sharedSongs.map((shared: any) => {
        const libSong = allSongs.find((s: any) => s.id === shared.id);
        return libSong ?? shared;
      });

      // Show confirmation modal — don't silently auto-import
      setSharedPlaylist({ name, songs: resolvedSongs });

      // Clean URL right away
      window.history.replaceState({}, '', window.location.pathname);
    } catch {
      // Malformed param — ignore
    }
  }, [allSongs]);

  const handleSaveSharedPlaylist = () => {
    if (!sharedPlaylist) return;
    const newId = `shared-${Date.now()}`;
    setPlaylists((prev: any[]) => [
      ...prev,
      { id: newId, name: `${sharedPlaylist.name} (shared)`, songs: sharedPlaylist.songs },
    ]);
    setSharedPlaylist(null);
    setActivePlaylistId(newId);
    setActiveTab('playlist');
  };

  useEffect(() => {
    const classesToRemove = Array.from(document.body.classList).filter(
      c => c.startsWith('theme-') || c === 'video-bg-active' || c === 'nebula-active'
    );
    classesToRemove.forEach(c => document.body.classList.remove(c));
    if (djState.nebulaMode) document.body.classList.add('nebula-active');
  }, [djState.nebulaMode]);

  useEffect(() => {
    const festive = getCurrentFestiveTheme();
    if (festive) document.body.classList.add('festival-active');
    else document.body.classList.remove('festival-active');
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
      <FestiveGreeting />
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

        {/* ── Shared Playlist Save Modal ─────────────────────────── */}
        {sharedPlaylist && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}>
            <div style={{
              background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: 28,
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              animation: 'fadeInUp 0.3s ease',
            }}>
              <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 10 }}>🎵</div>

              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, textAlign: 'center', margin: '0 0 6px' }}>
                Playlist Shared With You
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, textAlign: 'center', margin: '0 0 22px' }}>
                Save it to your library to listen anytime
              </p>

              {/* Playlist card */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 22,
              }}>
                <p style={{ color: 'var(--spotify-green)', fontWeight: 700, fontSize: 17, margin: '0 0 3px' }}>
                  {sharedPlaylist.name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 14px' }}>
                  {sharedPlaylist.songs.length} songs
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 200, overflowY: 'auto' }}>
                  {sharedPlaylist.songs.slice(0, 8).map((s: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, width: 16, textAlign: 'right', flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ color: '#fff', fontSize: 13, margin: 0, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.title}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{s.artist}</p>
                      </div>
                    </div>
                  ))}
                  {sharedPlaylist.songs.length > 8 && (
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textAlign: 'center', margin: '4px 0 0' }}>
                      +{sharedPlaylist.songs.length - 8} more songs
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setSharedPlaylist(null)}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 50,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  Dismiss
                </button>
                <button
                  onClick={handleSaveSharedPlaylist}
                  style={{
                    flex: 2, padding: '13px', borderRadius: 50,
                    background: 'var(--spotify-green)',
                    border: 'none',
                    color: '#000', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'opacity 0.2s',
                  }}
                >
                  ➕ Save to My Library
                </button>
              </div>
            </div>

            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(24px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
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
