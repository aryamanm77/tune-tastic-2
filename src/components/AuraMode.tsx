import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

const AuraMode: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getAnalyserData, isPlaying } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number, y: number, radius: number, color: string, vx: number, vy: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Init particles
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 20 + 10,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const data = getAnalyserData();
      let avgBass = 0;
      if (data && data.length > 0) {
        for (let i = 0; i < 10; i++) {
          avgBass += data[i];
        }
        avgBass = avgBass / 10;
      }
      
      const bounceMult = isPlaying ? 1 + (avgBass / 255) * 2 : 1;

      particles.forEach((p, i) => {
        p.x += p.vx * bounceMult;
        p.y += p.vy * bounceMult;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const pRadius = p.radius + (data ? (data[i % data.length] / 255) * 30 : 0);

        ctx.beginPath();
        ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Glow effect
        ctx.shadowBlur = pRadius;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [getAnalyserData, isPlaying]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default AuraMode;
