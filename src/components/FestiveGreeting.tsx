/**
 * FestiveGreeting — Google Pay-style full-screen festival greeting
 *
 * Shows ONCE on the first open of the app on a festival day.
 * Never shows again for the same festival (tracked via localStorage).
 * Auto-dismisses after 4s or user taps "Let's Go".
 */

import React, { useEffect, useState, useRef } from 'react';
import { getCurrentFestiveTheme, type FestiveTheme } from '../utils/festivals';

// ─── Particle system ──────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  shape: 'circle' | 'rect' | 'star';
}

function makeParticles(theme: FestiveTheme): Particle[] {
  const colors = [...theme.logoOverlay.borderGradient, '#fff', theme.logoOverlay.glowColor];
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: -10 - Math.random() * 20,
    vx: (Math.random() - 0.5) * 1.2,
    vy: 1.5 + Math.random() * 2.5,
    size: 4 + Math.random() * 8,
    color: colors[i % colors.length],
    opacity: 0.7 + Math.random() * 0.3,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 4,
    shape: (['circle', 'rect', 'star'] as const)[i % 3],
  }));
}

// ─── Main Component ───────────────────────────────────────────────

const FestiveGreeting: React.FC = () => {
  const theme = getCurrentFestiveTheme();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!theme) return;

    // Only show once per festival per year
    const key = `tunetastic_greeted_${theme.id}_${new Date().getFullYear()}`;
    if (localStorage.getItem(key)) return;

    // Mark as shown immediately
    localStorage.setItem(key, '1');

    setParticles(makeParticles(theme));
    setVisible(true);

    // Auto-dismiss after 4.5 seconds
    timerRef.current = setTimeout(() => dismiss(), 4500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, [theme?.id]);

  // Animate particles on canvas
  useEffect(() => {
    if (!visible || !canvasRef.current || particles.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let parts = particles.map(p => ({ ...p }));

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts = parts.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        rotation: p.rotation + p.rotSpeed,
        opacity: p.y > canvas.height * 0.85 ? p.opacity * 0.95 : p.opacity,
      })).map(p => p.y > canvas.height + 20 ? { ...p, y: -10, x: 10 + Math.random() * 80 } : p);

      parts.forEach(p => {
        ctx.save();
        const px = (p.x / 100) * canvas.width;
        const py = (p.y / 100) * canvas.height;
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          // 5-point star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = i === 0 ? p.size / 2 : p.size / 4;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [visible, particles]);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLeaving(true);
    setTimeout(() => setVisible(false), 600);
  };

  if (!theme || !visible) return null;

  const g = theme.logoOverlay.glowColor;
  const grad = theme.logoOverlay.borderGradient;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        background: `radial-gradient(ellipse at center, ${g}22 0%, #05050c 70%)`,
        cursor: 'pointer',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        animation: leaving ? 'none' : 'greetFadeIn 0.5s ease',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '0 32px',
        animation: leaving ? 'none' : 'greetSlideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Big emoji */}
        <div style={{
          fontSize: 'clamp(64px, 20vw, 120px)',
          lineHeight: 1,
          marginBottom: 24,
          filter: `drop-shadow(0 0 40px ${g})`,
          animation: 'emojiBounce 2s ease-in-out infinite',
        }}>
          {theme.emoji}
        </div>

        {/* Greeting headline */}
        <h1 style={{
          fontSize: 'clamp(28px, 8vw, 52px)',
          fontWeight: 900,
          margin: '0 0 12px',
          background: `linear-gradient(135deg, ${grad.join(', ')})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>
          Happy {theme.name}!
        </h1>

        {/* Subtext */}
        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 'clamp(14px, 4vw, 18px)',
          margin: '0 0 36px',
          fontWeight: 400,
          maxWidth: 320,
        }}>
          {theme.message}
        </p>

        {/* Glow divider */}
        <div style={{
          width: 60,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${grad.join(', ')})`,
          boxShadow: `0 0 16px ${g}`,
          marginBottom: 36,
        }} />

        {/* CTA button */}
        <button
          onClick={e => { e.stopPropagation(); dismiss(); }}
          style={{
            padding: '14px 40px',
            borderRadius: 50,
            border: `2px solid ${g}`,
            background: `linear-gradient(135deg, ${grad[0]}33, ${grad[grad.length - 1]}33)`,
            backdropFilter: 'blur(12px)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.5,
            boxShadow: `0 0 24px ${g}66`,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.boxShadow = `0 0 40px ${g}99`)}
          onMouseOut={e => (e.currentTarget.style.boxShadow = `0 0 24px ${g}66`)}
        >
          Let's Go! 🎵
        </button>

        {/* Tap anywhere hint */}
        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          marginTop: 16,
        }}>
          Tap anywhere to continue
        </p>
      </div>

      <style>{`
        @keyframes greetFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes greetSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes emojiBounce {
          0%, 100% { transform: translateY(0)    scale(1);    }
          50%       { transform: translateY(-12px) scale(1.06); }
        }
      `}</style>
    </div>
  );
};

export default FestiveGreeting;
