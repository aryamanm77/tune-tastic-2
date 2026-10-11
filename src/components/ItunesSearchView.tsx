import React, { useState, useEffect, useRef } from 'react';
import { usePlayer, Song } from '../context/PlayerContext';
import { Play, Search, Loader2, Pause, Music2, MoreHorizontal, Download, ListPlus, Check, ListMusic } from 'lucide-react';
import { searchItunes } from '../utils/itunes-song-search';
import AddToPlaylistModal from './AddToPlaylistModal';

const ItunesSearchView: React.FC = () => {
  const { 
    currentSong, isPlaying, playSong, togglePlayPause, 
    addToQueue, downloadSong, downloadAllSongs, downloadedSongs
  } = usePlayer() as any;

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Song[]>([]);
  const [modalSong, setModalSong] = useState<Song | null>(null);
  const [queuedIds, setQueuedIds] = useState<Set<string>>(new Set());
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [allQueuedToast, setAllQueuedToast] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setIsSearching(false); return; }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setIsSearching(true);
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const newSongs = await searchItunes(query, { limit: 25 });
        setResults(newSongs);
      } catch { /* silent */ } finally { setIsSearching(false); }
    }, 400);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [query]);

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) { togglePlayPause(); return; }
    if (!song.audioUrl) return;
    playSong(song, results);
  };

  const handleAddToQueue = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addToQueue) addToQueue(song);
    setQueuedIds(prev => new Set(prev).add(song.id));
    setTimeout(() => {
      setQueuedIds(prev => {
        const next = new Set(prev);
        next.delete(song.id);
        return next;
      });
    }, 2000);
  };

  const handleDownloadSingle = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadSong) downloadSong(song);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0 || isDownloadingAll) return;
    setIsDownloadingAll(true);
    try {
      if (downloadAllSongs) {
        await downloadAllSongs(results);
      } else {
        for (const s of results) {
          if (downloadSong) await downloadSong(s);
        }
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleQueueAll = () => {
    if (results.length === 0) return;
    results.forEach(s => {
      if (addToQueue) addToQueue(s);
    });
    setAllQueuedToast(true);
    setTimeout(() => setAllQueuedToast(false), 2000);
  };

  const formatTime = (ms: number) => {
    if (!ms) return '-:--';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('600x600bb')) {
      target.src = target.src.replace('600x600bb', '100x100bb');
      return;
    }
    if (target.dataset.fallbackAttempted) return;
    target.dataset.fallbackAttempted = 'true';
    target.src = './logo.png';
  };

  const isCurrent = (song: Song) => currentSong?.id === song.id;

  return (
    <>
      <div className="main-view" style={{ padding: '0', overflowX: 'hidden', background: 'var(--bg-base)' }}>
        <style>{`
          /* ── Spotify Search page styles ── */
          .sp-search-header {
            background: linear-gradient(180deg, #1a3a2a 0%, #121212 100%);
            padding: 24px 24px 16px;
            position: sticky;
            top: 0;
            z-index: 10;
          }
          .sp-search-input-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            border-radius: 500px;
            padding: 10px 16px;
            max-width: 380px;
          }
          .sp-search-input-wrap input {
            background: transparent;
            border: none;
            outline: none;
            color: black;
            font-size: 14px;
            font-weight: 600;
            flex: 1;
          }
          .sp-search-input-wrap input::placeholder { color: #6a6a6a; }
          .sp-section { padding: 0 24px 40px; }
          .sp-section-title {
            font-size: 22px;
            font-weight: 700;
            color: white;
            margin: 0;
          }
          /* Song rows */
          .sp-song-row {
            display: grid;
            grid-template-columns: 24px 44px 1fr auto auto;
            align-items: center;
            gap: 14px;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s;
          }
          .sp-song-row:hover { background: rgba(255,255,255,0.08); }
          .sp-row-num { text-align: right; font-size: 15px; color: rgba(255,255,255,0.5); }
          .sp-row-num .sp-play-icon { display: none; }
          .sp-song-row:hover .sp-row-num .sp-row-idx { display: none; }
          .sp-song-row:hover .sp-row-num .sp-play-icon { display: flex; justify-content: center; }
          .sp-row-img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; display: block; flex-shrink: 0; }
          .sp-row-actions { display: flex; align-items: center; gap: 8px; opacity: 1; }
          /* Top result card */
          .sp-top-card {
            background: rgba(255,255,255,0.07);
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            position: relative;
            transition: background 0.2s;
          }
          .sp-top-card:hover { background: rgba(255,255,255,0.14); }
          .sp-top-card-fab {
            position: absolute;
            top: 20px; right: 20px;
            width: 48px; height: 48px;
            border-radius: 50%;
            background: var(--spotify-green);
            border: none; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 24px rgba(29,185,84,0.5);
            transition: transform 0.2s ease;
          }
          .sp-top-card-fab:hover { transform: scale(1.06); }
        `}</style>

        {/* Search bar header */}
        <div className="sp-search-header">
          <div className="sp-search-input-wrap">
            <Search size={18} color="#6a6a6a" />
            <input
              ref={inputRef}
              type="text"
              placeholder="What do you want to play? (Apple Music)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {isSearching && <Loader2 size={16} color="#1db954" className="animate-spin" />}
          </div>
        </div>

        {/* Main content */}
        <div className="sp-section">
          {/* Default state */}
          {!query.trim() && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
              <Music2 size={54} color="var(--spotify-green)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
              <h2 style={{ color: 'white', fontWeight: 800, margin: '0 0 8px' }}>Explore 100M+ Songs on Apple Music</h2>
              <p style={{ margin: 0, fontSize: '14px', maxWidth: '440px', marginInline: 'auto', lineHeight: 1.5 }}>
                Search for your favorite artists, albums, or tracks to stream high-definition previews, add them to your queue, and download them.
              </p>
            </div>
          )}

          {/* Search Results */}
          {query.trim() && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '16px' }}>
              
              {/* Toolbar: Download All & Queue All */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <p className="sp-section-title">Results for "{query}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={handleDownloadAll}
                    disabled={isDownloadingAll}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: isDownloadingAll ? 'rgba(29, 185, 84, 0.25)' : 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '500px', padding: '8px 16px', color: 'white',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseOut={e => e.currentTarget.style.background = isDownloadingAll ? 'rgba(29, 185, 84, 0.25)' : 'rgba(255,255,255,0.12)'}
                  >
                    <Download size={15} color={isDownloadingAll ? 'var(--spotify-green)' : 'white'} />
                    <span>{isDownloadingAll ? 'Downloading...' : `Download all (${results.length})`}</span>
                  </button>

                  <button
                    onClick={handleQueueAll}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: allQueuedToast ? 'rgba(29, 185, 84, 0.25)' : 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '500px', padding: '8px 16px', color: 'white',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseOut={e => e.currentTarget.style.background = allQueuedToast ? 'rgba(29, 185, 84, 0.25)' : 'rgba(255,255,255,0.12)'}
                  >
                    {allQueuedToast ? <Check size={15} color="var(--spotify-green)" /> : <ListMusic size={15} />}
                    <span>{allQueuedToast ? 'All queued!' : 'Queue all'}</span>
                  </button>
                </div>
              </div>

              {/* Top Result + Songs grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* Top Result Card */}
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Top result
                  </p>
                  <div className="sp-top-card" onClick={() => handlePlay(results[0])}>
                    <img
                      src={results[0].coverArt?.replace('600x600bb', '300x300bb')}
                      onError={handleImageError}
                      alt=""
                      style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'block' }}
                    />
                    <p style={{ fontSize: '26px', fontWeight: 800, color: 'white', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {results[0].title}
                    </p>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
                      Song · {results[0].artist}
                    </p>

                    {/* Action buttons on card */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={e => handleAddToQueue(results[0], e)}
                        title="Add to queue"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: queuedIds.has(results[0].id) ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.15)',
                          border: 'none', borderRadius: '20px', padding: '7px 14px',
                          color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {queuedIds.has(results[0].id) ? <Check size={15} color="var(--spotify-green)" /> : <ListPlus size={15} />}
                        <span>{queuedIds.has(results[0].id) ? 'Queued' : 'Add to Queue'}</span>
                      </button>

                      <button
                        onClick={e => handleDownloadSingle(results[0], e)}
                        title="Download song"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: downloadedSongs?.has(results[0].id) ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.15)',
                          border: 'none', borderRadius: '20px', padding: '7px 14px',
                          color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {downloadedSongs?.has(results[0].id) ? <Check size={15} color="var(--spotify-green)" /> : <Download size={15} />}
                        <span>{downloadedSongs?.has(results[0].id) ? 'Downloaded' : 'Download'}</span>
                      </button>

                      <button
                        onClick={e => { e.stopPropagation(); setModalSong(results[0]); }}
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="More options"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <button
                      className="sp-top-card-fab"
                      onClick={e => { e.stopPropagation(); handlePlay(results[0]); }}
                      title={isCurrent(results[0]) && isPlaying ? 'Pause' : 'Play'}
                    >
                      {isCurrent(results[0]) && isPlaying
                        ? <Pause size={22} fill="black" color="black" />
                        : <Play size={22} fill="black" color="black" style={{ marginLeft: '3px' }} />}
                    </button>
                  </div>
                </div>

                {/* Next 4 Songs */}
                {results.length > 1 && (
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      Songs
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {results.slice(1, 5).map(song => {
                        const active = isCurrent(song);
                        const isQueued = queuedIds.has(song.id);
                        const isDownloaded = downloadedSongs?.has(song.id);
                        return (
                          <div key={song.id} className="sp-song-row" onClick={() => handlePlay(song)}>
                            <div className="sp-row-num">
                              <span className="sp-play-icon">
                                {active && isPlaying
                                  ? <div className="eq-bars" style={{ transform: 'scale(0.75)' }}><div className="eq-bar"/><div className="eq-bar"/><div className="eq-bar"/><div className="eq-bar"/></div>
                                  : <Play size={14} fill="white" color="white" />}
                              </span>
                            </div>
                            <img className="sp-row-img" src={song.coverArt?.replace('600x600bb', '100x100bb')} onError={handleImageError} alt="" />
                            <div style={{ minWidth: 0 }}>
                              <p className="ellipsis" style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: active ? 'var(--spotify-green)' : 'white' }}>{song.title}</p>
                              <p className="ellipsis" style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{song.artist}</p>
                            </div>
                            <div className="sp-row-actions">
                              <button
                                onClick={e => handleAddToQueue(song, e)}
                                title={isQueued ? 'Added to queue' : 'Add to queue'}
                                style={{
                                  color: isQueued ? 'var(--spotify-green)' : 'rgba(255,255,255,0.7)',
                                  background: isQueued ? 'rgba(29,185,84,0.15)' : 'none',
                                  border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '6px',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                              >
                                {isQueued ? <Check size={16} /> : <ListPlus size={16} />}
                              </button>
                              <button
                                onClick={e => handleDownloadSingle(song, e)}
                                title={isDownloaded ? 'Downloaded' : 'Download song'}
                                style={{
                                  color: isDownloaded ? 'var(--spotify-green)' : 'rgba(255,255,255,0.7)',
                                  background: isDownloaded ? 'rgba(29,185,84,0.15)' : 'none',
                                  border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '6px',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                              >
                                {isDownloaded ? <Check size={16} /> : <Download size={16} />}
                              </button>
                              <button 
                                onClick={e => { e.stopPropagation(); setModalSong(song); }}
                                style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                                title="More options"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{formatTime(song.durationMs || 0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* All results table */}
              {results.length > 5 && (
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>All results</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '24px 44px 1fr auto auto', gap: '14px', padding: '0 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '4px' }}>
                    <span style={{ textAlign: 'right', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>#</span>
                    <span />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>⏱</span>
                  </div>
                  {results.slice(5).map((song, i) => {
                    const active = isCurrent(song);
                    const isQueued = queuedIds.has(song.id);
                    const isDownloaded = downloadedSongs?.has(song.id);
                    return (
                      <div key={song.id} className="sp-song-row" onClick={() => handlePlay(song)}>
                        <div className="sp-row-num">
                          {active
                            ? <div className={'eq-bars' + (isPlaying ? '' : ' paused')} style={{ transform: 'scale(0.7)', justifyContent: 'center' }}>
                                <div className="eq-bar" style={{ background: 'var(--spotify-green)' }} /><div className="eq-bar" style={{ background: 'var(--spotify-green)' }} /><div className="eq-bar" style={{ background: 'var(--spotify-green)' }} /><div className="eq-bar" style={{ background: 'var(--spotify-green)' }} />
                              </div>
                            : <>
                                <span className="sp-row-idx">{i + 6}</span>
                                <span className="sp-play-icon"><Play size={14} fill="white" color="white" /></span>
                              </>}
                        </div>
                        <img className="sp-row-img" src={song.coverArt?.replace('600x600bb', '100x100bb')} onError={handleImageError} loading="lazy" alt="" />
                        <div style={{ minWidth: 0 }}>
                          <p className="ellipsis" style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: active ? 'var(--spotify-green)' : 'white' }}>{song.title}</p>
                          <p className="ellipsis" style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{song.artist}</p>
                        </div>
                        <div className="sp-row-actions">
                          <button
                            onClick={e => handleAddToQueue(song, e)}
                            title={isQueued ? 'Added to queue' : 'Add to queue'}
                            style={{
                              color: isQueued ? 'var(--spotify-green)' : 'rgba(255,255,255,0.7)',
                              background: isQueued ? 'rgba(29,185,84,0.15)' : 'none',
                              border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {isQueued ? <Check size={16} /> : <ListPlus size={16} />}
                          </button>
                          <button
                            onClick={e => handleDownloadSingle(song, e)}
                            title={isDownloaded ? 'Downloaded' : 'Download song'}
                            style={{
                              color: isDownloaded ? 'var(--spotify-green)' : 'rgba(255,255,255,0.7)',
                              background: isDownloaded ? 'rgba(29,185,84,0.15)' : 'none',
                              border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {isDownloaded ? <Check size={16} /> : <Download size={16} />}
                          </button>
                          <button 
                            onClick={e => { e.stopPropagation(); setModalSong(song); }}
                            style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                            title="More options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{formatTime(song.durationMs || 0)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {query.trim() && !isSearching && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Music2 size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '16px' }} />
              <h2 style={{ color: 'white', fontWeight: 700, margin: '0 0 8px' }}>No results found for "{query}"</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Please make sure your words are spelled correctly, or try different keywords.</p>
            </div>
          )}
        </div>
      </div>

      {modalSong && <AddToPlaylistModal song={modalSong} onClose={() => setModalSong(null)} />}
    </>
  );
};

export default ItunesSearchView;
