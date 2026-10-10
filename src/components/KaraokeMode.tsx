import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

const KaraokeMode: React.FC = () => {
  const { currentSong, currentTime, duration } = usePlayer();
  const [lyrics, setLyrics] = useState<{ time: number, text: string }[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!currentSong) return;
    setLyrics(null);
    setError(false);

    const cleanArtist = currentSong.artist.split(',')[0].trim();
    const cleanTitle = currentSong.title.replace(/\(.*?\)/g, '').trim();

    if (!cleanArtist || cleanArtist === 'Unknown Artist') {
      setError(true);
      return;
    }

    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data.lyrics) {
          const cleanedLyrics = data.lyrics.replace(/Paroles de la chanson.+?[\r\n]+/i, '');
          const lines = cleanedLyrics.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
          
          if (lines.length > 0) {
            // Pseudo-sync: Distribute lines evenly across the song duration
            // (Assuming first line starts a bit after 0, and last line ends before duration)
            const safeDuration = duration > 0 ? duration : 180;
            const timePerLine = safeDuration / (lines.length + 2); 
            
            const syncedLyrics = lines.map((text: string, i: number) => ({
              time: timePerLine * (i + 1),
              text
            }));
            
            setLyrics(syncedLyrics);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [currentSong, duration]);

  // If error or still loading, show fallback mock lyrics
  const displayLyrics = lyrics || [
    { time: 0, text: "♪ (Intro)" },
    { time: 5, text: "Ooh, yeah..." },
    { time: 10, text: "Let's go!" },
    { time: 15, text: "Singing along to the beat," },
    { time: 20, text: "Dancing in the street!" },
    { time: 25, text: "We don't need no sleep," },
    { time: 30, text: "Because the music's too sweet!" },
    { time: 35, text: "♪ (Chorus)" }
  ];

  // For the mock fallback, loop every 40s. For real lyrics, use actual time.
  const timeToUse = lyrics ? currentTime : currentTime % 40;

  const activeIndex = displayLyrics.findIndex((l, i) => 
    timeToUse >= l.time && (i === displayLyrics.length - 1 || timeToUse < displayLyrics[i + 1].time)
  );

  return (
    <div style={{
      width: '100%', maxWidth: '400px', height: '320px',
      margin: '0 auto', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '16px',
      padding: '24px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
    }}>
      <style>{`
        .lyric-line {
          transition: all 0.3s ease;
          text-align: center;
          margin: 12px 0;
        }
        .lyric-active {
          font-size: 28px;
          font-weight: 800;
          color: var(--spotify-green);
          text-shadow: 0 0 12px rgba(29,185,84,0.6);
          transform: scale(1.1);
        }
        .lyric-inactive {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
        }
      `}</style>
      
      {error && !lyrics && (
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
          Real lyrics not found.<br/>Showing visualizer.
        </div>
      )}

      <div style={{
        display: 'flex', flexDirection: 'column',
        transform: `translateY(${(3 - (activeIndex >= 0 ? activeIndex : 0)) * 44}px)`,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        width: '100%'
      }}>
        {displayLyrics.map((l, i) => (
          <div key={i} className={`lyric-line ${i === activeIndex ? 'lyric-active' : 'lyric-inactive'}`}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KaraokeMode;
