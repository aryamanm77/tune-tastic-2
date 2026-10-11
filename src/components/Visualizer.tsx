import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { ArrowLeft } from 'lucide-react';

interface VisualizerProps {
  onBack?: () => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ onBack }) => {
  const { getAnalyserData, isPlaying } = usePlayer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peaksRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const BAR_COUNT = 48;
    peaksRef.current = new Array(BAR_COUNT).fill(0);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark studio atmospheric background with gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(6, 11, 25, 0.7)');
      bgGrad.addColorStop(1, 'rgba(2, 4, 10, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const data = getAnalyserData();
      const hasAudio = data && data.length > 0 && isPlaying;

      const totalBarWidth = Math.min(width * 0.9, 720);
      const startX = (width - totalBarWidth) / 2;
      const barSpacing = totalBarWidth / BAR_COUNT;
      const barWidth = barSpacing * 0.65;
      const baselineY = height * 0.75;
      const maxHeight = height * 0.45;

      for (let i = 0; i < BAR_COUNT; i++) {
        // Map linearly/logarithmically to spectrum indices
        const dataIdx = Math.floor(Math.pow(i / BAR_COUNT, 1.4) * Math.min(data?.length || 1, 128));
        const rawVal = hasAudio ? (data[dataIdx] || 0) : 10;
        const barHeight = Math.max(6, (rawVal / 255) * maxHeight);

        // Update peak caps with gravity falloff
        if (barHeight > peaksRef.current[i]) {
          peaksRef.current[i] = barHeight;
        } else {
          peaksRef.current[i] = Math.max(0, peaksRef.current[i] - 2.5);
        }

        const x = startX + i * barSpacing;
        const y = baselineY - barHeight;

        // Dynamic electric gradient: Electric Emerald -> Cyan -> Magenta Violet
        const grad = ctx.createLinearGradient(0, baselineY, 0, baselineY - maxHeight);
        grad.addColorStop(0, 'rgba(29, 185, 84, 0.7)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.9)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 1)');

        // Draw main bar with rounded top
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fillStyle = grad;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.fill();

        // Draw floating peak indicator
        const peakY = baselineY - peaksRef.current[i] - 5;
        ctx.beginPath();
        ctx.roundRect(x, peakY, barWidth, 3, 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fill();

        // Draw glass reflection beneath baseline
        const reflGrad = ctx.createLinearGradient(0, baselineY, 0, baselineY + barHeight * 0.35);
        reflGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.roundRect(x, baselineY + 2, barWidth, barHeight * 0.35, [0, 0, 4, 4]);
        ctx.fillStyle = reflGrad;
        ctx.shadowBlur = 0;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [getAnalyserData, isPlaying]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 'max(16px, env(safe-area-inset-top))',
            left: '20px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '500px',
            color: 'white',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            pointerEvents: 'auto',
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Art</span>
        </button>
      )}
    </div>
  );
};

export default Visualizer;
