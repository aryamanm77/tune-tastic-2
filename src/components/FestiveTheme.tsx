/**
 * 🎉 FestiveTheme Component
 * - Injects dynamic CSS variables for the active festival
 * - Renders beautiful floating particles (snow, diyas, hearts, etc.)
 * - Shows a subtle festive banner at the top of the app
 * - Provides a festive logo wrapper used in TuneTasticLogo
 */

import React, { useEffect, useRef, useState } from 'react';
import { getCurrentFestiveTheme, type FestiveTheme, type ParticleConfig } from '../utils/festivals';

// ──────────────────────────────────────────────────────────────────
// CSS injection for festive themes
// ──────────────────────────────────────────────────────────────────

function injectFestiveCSS(theme: FestiveTheme) {
  const root = document.documentElement;
  Object.entries(theme.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  if (theme.bodyClass) {
    document.body.classList.add(theme.bodyClass);
  }
}

function removeFestiveCSS(theme: FestiveTheme) {
  const root = document.documentElement;
  Object.keys(theme.cssVars).forEach((key) => {
    root.style.removeProperty(key);
  });
  if (theme.bodyClass) {
    document.body.classList.remove(theme.bodyClass);
  }
}

// ──────────────────────────────────────────────────────────────────
// Particle System
// ──────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  type: ParticleConfig['type'];
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number; // 0 → 1
}

function createParticle(cfg: ParticleConfig, id: number): Particle {
  const size = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
  const speed = cfg.speed[0] + Math.random() * (cfg.speed[1] - cfg.speed[0]);
  const angle = Math.random() * Math.PI * 2;
  return {
    id,
    x: Math.random() * 100, // vw %
    y: cfg.type === 'firework' ? 100 + Math.random() * 10 : -10,
    size,
    color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
    type: cfg.type,
    vx: cfg.type === 'holi-splash' ? (Math.random() - 0.5) * 2 : Math.cos(angle) * speed * 0.3,
    vy: cfg.type === 'firework' ? -(speed * 1.2) : speed,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
    opacity: 0.8 + Math.random() * 0.2,
    life: 0,
  };
}

function ParticleRenderer({ particle }: { particle: Particle }) {
  const style: React.CSSProperties = {
    position: 'fixed',
    left: `${particle.x}vw`,
    top: `${particle.y}vh`,
    width: particle.size,
    height: particle.size,
    opacity: particle.opacity,
    pointerEvents: 'none',
    zIndex: 5,
    transform: `rotate(${particle.rotation}deg)`,
    transition: 'none',
    filter: `drop-shadow(0 0 ${particle.size * 0.3}px ${particle.color})`,
  };

  const content = (() => {
    switch (particle.type) {
      case 'snowflake': return '❄';
      case 'heart': return '♥';
      case 'diya': return '🪔';
      case 'firework': return '✦';
      case 'leaf': return '🍃';
      case 'petal': return '🌸';
      case 'crescent': return '☽';
      case 'egg': return '🥚';
      case 'shamrock': return '☘';
      case 'lantern': return '🏮';
      case 'holi-splash': return '●';
      case 'star':
      default: return '★';
    }
  })();

  return (
    <div style={{ ...style, fontSize: particle.size, color: particle.color, lineHeight: 1 }}>
      {content}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main FestiveTheme component
// ──────────────────────────────────────────────────────────────────

const FestiveThemeProvider: React.FC = () => {
  const theme = getCurrentFestiveTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showBanner, setShowBanner] = useState(true);
  const frameRef = useRef<number>(0);
  const particleIdRef = useRef(0);
  const lastSpawnRef = useRef<number[]>([]);

  // Inject/remove CSS variables on mount/unmount
  useEffect(() => {
    if (!theme) return;
    injectFestiveCSS(theme);
    return () => {
      removeFestiveCSS(theme);
    };
  }, [theme?.id]);

  // Particle animation loop
  useEffect(() => {
    if (!theme || theme.particles.length === 0) return;

    let lastTime = performance.now();
    lastSpawnRef.current = theme.particles.map(() => 0);

    const spawnIntervals = theme.particles.map((cfg) => {
      // spawn one every N ms based on count
      return 8000 / cfg.count;
    });

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setParticles((prev) => {
        // Move existing
        const moved = prev
          .map((p) => {
            const newLife = p.life + dt * 0.12;
            if (newLife >= 1) return null;
            return {
              ...p,
              x: p.x + p.vx * dt * 10,
              y: p.y + p.vy * dt * 10,
              rotation: p.rotation + p.rotationSpeed,
              opacity: p.type === 'firework'
                ? Math.max(0, 1 - newLife * 1.5)
                : p.type === 'holi-splash'
                  ? Math.max(0, 1 - newLife)
                  : 0.7 + Math.sin(newLife * Math.PI) * 0.3,
              life: newLife,
            };
          })
          .filter(Boolean) as Particle[];

        // Spawn new
        const newParticles: Particle[] = [];
        theme.particles.forEach((cfg, idx) => {
          lastSpawnRef.current[idx] += dt * 1000;
          if (lastSpawnRef.current[idx] >= spawnIntervals[idx]) {
            lastSpawnRef.current[idx] = 0;
            newParticles.push(createParticle(cfg, ++particleIdRef.current));
          }
        });

        // Cap total particles
        return [...moved, ...newParticles].slice(-80);
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [theme?.id]);

  if (!theme) return null;

  return (
    <>
      {/* Floating Particles */}
      {particles.map((p) => (
        <ParticleRenderer key={p.id} particle={p} />
      ))}

      {/* Festive Banner */}
      {showBanner && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: `linear-gradient(90deg, ${theme.logoOverlay.borderGradient.join(', ')})`,
            backgroundSize: '200% auto',
            animation: 'festiveBannerShimmer 3s linear infinite',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: `0 0 20px ${theme.logoOverlay.glowColor}66`,
          }}
        >
          <span style={{ fontSize: 18 }}>{theme.emoji}</span>
          <span style={{ color: '#000', fontWeight: 700, fontSize: 13, letterSpacing: 0.3 }}>
            {theme.name} &nbsp;—&nbsp; {theme.message}
          </span>
          <span style={{ fontSize: 18 }}>{theme.emoji}</span>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              position: 'absolute',
              right: 12,
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              color: '#000',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
            }}
            aria-label="Close festive banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Keyframe injection */}
      <style>{`
        @keyframes festiveBannerShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Festive glow on interactive elements */
        .festival-active button:hover,
        .festival-active [class*="card"]:hover {
          box-shadow: 0 0 12px var(--festive-accent, var(--spotify-green)) !important;
        }

        /* EQ bars take on festive color automatically via --spotify-green */
        .festival-active .eq-bar {
          background: var(--spotify-green) !important;
        }
      `}</style>
    </>
  );
};

export default FestiveThemeProvider;

// ──────────────────────────────────────────────────────────────────
// Festive Logo Wrapper – used inside TuneTasticLogo
// ──────────────────────────────────────────────────────────────────

export const FestiveLogoWrapper: React.FC<{
  size: number;
  children: React.ReactNode;
}> = ({ size, children }) => {
  const theme = getCurrentFestiveTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const angleRef = useRef(0);

  // Draw rotating festive ring on canvas
  useEffect(() => {
    if (!theme || theme.logoOverlay.type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const s = size * dpr;
    canvas.width = s;
    canvas.height = s;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const colors = theme.logoOverlay.borderGradient;
    const badge = theme.logoOverlay.badge;
    const badgeSize = (theme.logoOverlay.badgeSize ?? 1) * size * 0.28;

    const draw = () => {
      ctx.clearRect(0, 0, s, s);

      const cx = s / 2;
      const cy = s / 2;
      const r = (size / 2 - 2) * dpr;

      // Build a gradient for the ring
      const grad = ctx.createConicGradient
        ? ctx.createConicGradient(angleRef.current, cx, cy)
        : (() => {
            const g = ctx.createLinearGradient(0, 0, s, s);
            colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
            return g;
          })();

      if ((grad as CanvasGradient).addColorStop) {
        colors.forEach((c, i) => (grad as CanvasGradient).addColorStop(i / (colors.length - 1), c));
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 3 * dpr;
      ctx.strokeStyle = colors[Math.round(angleRef.current / (Math.PI * 2) * colors.length) % colors.length];
      ctx.stroke();
      ctx.restore();

      // Badge emoji in bottom-right
      ctx.save();
      ctx.font = `${badgeSize}px serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = theme.logoOverlay.glowColor;
      ctx.shadowBlur = 8 * dpr;
      ctx.fillText(badge, s - 2, s - 2);
      ctx.restore();

      angleRef.current = (angleRef.current + 0.01) % (Math.PI * 2);
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [theme?.id, size]);

  if (!theme) return <>{children}</>;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Festive glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: '50%',
          background: `conic-gradient(${theme.logoOverlay.borderGradient.join(', ')})`,
          animation: 'festiveLogo-spin 4s linear infinite',
          zIndex: 0,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 2,
          borderRadius: '50%',
          background: '#000',
          zIndex: 1,
        }}
      />
      {/* Logo image */}
      <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', overflow: 'hidden', zIndex: 2 }}>
        {children}
      </div>
      {/* Badge overlay */}
      {theme.logoOverlay.badge && (
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            fontSize: size * 0.28,
            lineHeight: 1,
            zIndex: 3,
            filter: `drop-shadow(0 0 4px ${theme.logoOverlay.glowColor})`,
            animation: 'festiveLogo-badge-bounce 1.5s ease-in-out infinite',
          }}
        >
          {theme.logoOverlay.badge}
        </div>
      )}
      <style>{`
        @keyframes festiveLogo-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes festiveLogo-badge-bounce {
          0%, 100% { transform: scale(1) rotate(-10deg); }
          50%      { transform: scale(1.2) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};
