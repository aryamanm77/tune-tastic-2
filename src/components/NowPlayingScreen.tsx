/**
 * NowPlayingScreen.tsx
 * Full-screen Spotify-style Now Playing view for mobile.
 * Opens when user taps the mini player bar.
 */
import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { getCoverArtUrl } from '../utils/cloudinary';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Heart, ChevronDown, MoreHorizontal, Volume2, VolumeX,
  Sparkles, Disc, Mic2, Image as ImageIcon, Download, Plus
} from 'lucide-react';
import Visualizer from './Visualizer';
import VinylScratch from './VinylScratch';
import KaraokeMode from './KaraokeMode';
import AddToPlaylistModal from './AddToPlaylistModal';

interface NowPlayingScreenProps {
  onClose: () => void;
}

const LyricsCard: React.FC<{ artist: string, title: string }> = ({ artist, title }) => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLyrics(null);
    setError(false);
    
    // Clean up artist and title for better API matching
    const cleanArtist = artist.split(',')[0].trim();
    const cleanTitle = title.replace(/\(.*?\)/g, '').trim();

    if (!cleanArtist || cleanArtist === 'Unknown Artist') {
      setError(true);
      return;
    }

    setLoading(true);
    fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(cleanArtist + ' ' + cleanTitle)}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0 && data[0].plainLyrics) {
          setLyrics(data[0].plainLyrics);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [artist, title]);

  return (
    <div style={{
      backgroundColor: 'var(--dynamic-bg-color, #2a5a3f)', // Slightly lighter than background
      borderRadius: '12px',
      padding: '24px',
      marginTop: '32px',
      marginBottom: '32px',
      minHeight: '200px',
      transition: 'background-color 0.5s ease',
      filter: 'brightness(1.15)',
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>Lyrics</h3>
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '24px', fontWeight: 700 }}>Loading lyrics...</p>
      ) : error ? (
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.5' }}>
          <p>We couldn't find lyrics for this song in the public database.</p>
          <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>Try playing a more popular track, as the open lyrics API doesn't have every song.</p>
        </div>
      ) : lyrics ? (
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: '1.5',
          margin: 0,
          color: 'white'
        }}>
          {lyrics}
        </pre>
      ) : null}
    </div>
  );
};

const NowPlayingScreen: React.FC<NowPlayingScreenProps> = ({ onClose }) => {
  const {
    currentSong, isPlaying, progress, currentTime, duration, volume,
    isShuffled, repeatMode,
    togglePlayPause, nextSong, prevSong, seekTo, setVolume,
    toggleShuffle, cycleRepeat, toggleLike, isLiked,
    downloadSong, downloadedSongs, downloadProgress
  } = usePlayer();

  const [touching, setTouching] = useState(false);
  const [activeMode, setActiveMode] = useState<'normal' | 'party' | 'vinyl' | 'karaoke'>('normal');
  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  if (!currentSong) return null;

  const liked = isLiked(currentSong.id);

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  };

  const repeatColor = repeatMode !== 'none' ? 'var(--spotify-green)' : 'rgba(255,255,255,0.6)';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 800,
      background: 'var(--dynamic-bg-color, #1e3a29)',
      display: 'flex', flexDirection: 'column',
      animation: 'npSlideUp 0.32s cubic-bezier(0.32,0.72,0,1)',
      overflowY: 'auto'
    }}>
      <style>{`
        @keyframes npSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
        pointerEvents: 'none',
      }} />

      {activeMode === 'party' && <Visualizer />}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '0 28px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'env(safe-area-inset-top, 16px)', marginTop: '16px' }}>
          <button onClick={onClose} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex' }}>
            <ChevronDown size={28} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Now Playing</p>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex' }}>
              <MoreHorizontal size={24} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                backgroundColor: '#282828', borderRadius: '4px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
                zIndex: 100, minWidth: '200px', overflow: 'hidden'
              }}>
                <button 
                  onClick={() => { setShowMenu(false); setShowAddModal(true); }}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Plus size={16} /> Add to Playlist
                </button>
                <button 
                  onClick={() => { setShowMenu(false); downloadSong(currentSong); }}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Download size={16} /> 
                  {downloadedSongs.has(currentSong.id) ? 'Downloaded' : downloadProgress[currentSong.id] !== undefined ? 'Downloading...' : 'Download'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fun Modes Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
          {[
            { id: 'normal', icon: ImageIcon, label: 'Art' },
            { id: 'party', icon: Sparkles, label: 'Party' },
            { id: 'vinyl', icon: Disc, label: 'Vinyl' },
            { id: 'karaoke', icon: Mic2, label: 'Karaoke' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '100px', border: 'none',
                backgroundColor: activeMode === m.id ? 'var(--spotify-green)' : 'rgba(255,255,255,0.1)',
                color: activeMode === m.id ? 'black' : 'white',
                fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                transition: 'all 0.2s ease', zIndex: 2
              }}
            >
              <m.icon size={14} />
              {m.label}
            </button>
          ))}
        </div>

        {/* Central Display Area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0', zIndex: 2 }}>
          {activeMode === 'vinyl' && <VinylScratch />}
          {activeMode === 'karaoke' && <KaraokeMode />}
          
          {(activeMode === 'normal' || activeMode === 'party') && (
            <img
              src={currentSong.coverArt || getCoverArtUrl(currentSong.audioId)}
              onError={e => {
                if (e.currentTarget.src.includes('600x600bb')) {
                  e.currentTarget.src = e.currentTarget.src.replace('600x600bb', '100x100bb');
                } else {
                  e.currentTarget.src = './logo.png';
                }
              }}
              alt={currentSong.title}
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '1 / 1',
                borderRadius: '12px',
                objectFit: 'cover',
                boxShadow: activeMode === 'party' ? '0 0 40px rgba(29, 185, 84, 0.4)' : '0 24px 64px rgba(0,0,0,0.6)',
                transform: touching ? 'scale(0.95)' : isPlaying ? 'scale(1)' : 'scale(0.88)',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onTouchStart={() => setTouching(true)}
              onTouchEnd={() => setTouching(false)}
            />
          )}
        </div>

        {/* Song info + like */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: '22px', fontWeight: 800, color: 'white',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{currentSong.title}</p>
            <p style={{ margin: '4px 0 0', fontSize: '15px', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentSong.artist}
            </p>
          </div>
          <button
            onClick={() => toggleLike(currentSong)}
            style={{ color: liked ? '#FF2D55' : 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            <Heart size={26} fill={liked ? '#FF2D55' : 'none'} />
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <input
            type="range" min="0" max="1" step="0.001"
            value={progress || 0}
            onChange={e => seekTo(parseFloat(e.target.value))}
            style={{ width: '100%', height: '4px', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', cursor: 'pointer', accentColor: 'white' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{formatTime(currentTime)}</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={toggleShuffle} style={{ color: isShuffled ? 'var(--spotify-green)' : 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Shuffle size={22} />
          </button>
          <button onClick={prevSong} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
            <SkipBack size={32} fill="white" />
          </button>
          <button
            onClick={togglePlayPause}
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              backgroundColor: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {isPlaying
              ? <Pause size={30} fill="black" color="black" />
              : <Play size={30} fill="black" color="black" style={{ marginLeft: '4px' }} />}
          </button>
          <button onClick={nextSong} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
            <SkipForward size={32} fill="white" />
          </button>
          <button onClick={cycleRepeat} style={{ color: repeatColor, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <Repeat size={22} />
            {repeatMode === 'one' && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', fontSize: '9px', fontWeight: 800, color: 'var(--spotify-green)' }}>1</span>
            )}
          </button>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', marginBottom: 'env(safe-area-inset-bottom, 32px)', paddingBottom: '16px' }}>
          <button onClick={() => setVolume(0)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <VolumeX size={18} />
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ flex: 1, height: '4px', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', accentColor: 'white' }}
          />
          <button onClick={() => setVolume(1)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Volume2 size={18} />
          </button>
        </div>

        {/* Lyrics Card (Always shown so user can scroll down to it) */}
        <LyricsCard artist={currentSong.artist} title={currentSong.title} />
      </div>
      
      {showAddModal && <AddToPlaylistModal song={currentSong} onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default NowPlayingScreen;
