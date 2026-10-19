/**
 * FestiveTheme — Premium Edition
 *
 * Inspired by how Swiggy, Zomato & Google handle festive UI:
 * - Subtle ambient bokeh lighting (tiny glowing CSS dots, not emoji)
 * - Thin, elegant toast-style banner (not a garish full rainbow bar)
 * - Soft CSS color palette shift on accent elements
 * - Instagram-story-style logo ring (thin, slow pulse — no spinning)
 * - Small static badge, no bouncing
 */

import React, { useEffect, useRef, useState } from 'react';
import { getCurrentFestiveTheme, type FestiveTheme } from '../utils/festivals';

// ─────────────────────────────────────────────────────────────────
// CSS injection helpers
// ─────────────────────────────────────────────────────────────────

function injectFestiveCSS(theme: FestiveTheme) {
  const root = document.documentElement;
  Object.entries(theme.cssVars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (theme.bodyClass) document.body.classList.add(theme.bodyClass);
}
function removeFestiveCSS(theme: FestiveTheme) {
  const root = document.documentElement;
  Object.keys(theme.cssVars).forEach((k) => root.style.removeProperty(k));
  if (theme.bodyClass) document.body.classList.remove(theme.bodyClass);
}

// ─────────────────────────────────────────────────────────────────
// Ambient Bokeh — pure CSS circles, no emojis
// ─────────────────────────────────────────────────────────────────

interface BokehDot {
  id: number;
  x: number;    // vw
  size: number; // px
  color: string;
  delay: number;
  duration: number;
}

function generateBokeh(theme: FestiveTheme, count = 18): BokehDot[] {
  const colors = theme.logoOverlay.borderGradient;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 3 + Math.random() * 5,
    color: colors[i % colors.length],
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 12,
  }));
}

const AmbientBokeh: React.FC<{ theme: FestiveTheme }> = ({ theme }) => {
  const dots = useRef(generateBokeh(theme)).current;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 8,
        overflow: 'hidden',
      }}
    >
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: `${d.x}vw`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: d.color,
            opacity: 0,
            boxShadow: `0 0 ${d.size * 2}px ${d.color}, 0 0 ${d.size * 4}px ${d.color}55`,
            animation: `bokehRise ${d.duration}s ${d.delay}s ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Festive Banner — slim, elegant, toast-style (like Swiggy)
// ─────────────────────────────────────────────────────────────────

const FestiveBanner: React.FC<{ theme: FestiveTheme; onClose: () => void }> = ({ theme, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in after 600ms
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: `linear-gradient(135deg, ${theme.logoOverlay.borderGradient[0]}22, ${theme.logoOverlay.borderGradient[1] ?? theme.logoOverlay.borderGradient[0]}18)`,
        borderBottom: `1px solid ${theme.logoOverlay.glowColor}33`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Glow line at bottom of banner */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${theme.logoOverlay.glowColor}88, transparent)`,
      }} />

      <span style={{ fontSize: 14, lineHeight: 1 }}>{theme.emoji}</span>
      <span style={{
        color: theme.logoOverlay.glowColor,
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: 0.4,
        opacity: 0.95,
      }}>
        {theme.name}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
        · {theme.message}
      </span>

      <button
        onClick={onClose}
        style={{
          position: 'absolute', right: 10,
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer', fontSize: 16, lineHeight: 1,
          padding: '0 4px',
          transition: 'color 0.2s',
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Main Provider
// ─────────────────────────────────────────────────────────────────

const FestiveThemeProvider: React.FC = () => {
  const theme = getCurrentFestiveTheme();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!theme) return;
    injectFestiveCSS(theme);
    return () => removeFestiveCSS(theme);
  }, [theme?.id]);

  if (!theme) return null;

  return (
    <>
      {/* Ambient bokeh light dots */}
      <AmbientBokeh theme={theme} />

      {/* Slim festive banner */}
      {showBanner && (
        <FestiveBanner theme={theme} onClose={() => setShowBanner(false)} />
      )}

      {/* Global keyframes + festival-active styles */}
      <style>{`
        @keyframes bokehRise {
          0%   { transform: translateY(0)   scale(1);    opacity: 0; }
          10%  { opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-105vh) scale(0.6); opacity: 0; }
        }

        /* Subtle festive glow on accent/interactive elements */
        body.festival-active [class*="now-playing"],
        body.festival-active .player-bar {
          box-shadow: inset 0 0 60px ${theme.logoOverlay.glowColor}08 !important;
        }

        /* Progress bar fills with festival accent color */
        body.festival-active input[type=range]::-webkit-slider-thumb {
          background: var(--spotify-green) !important;
          box-shadow: 0 0 6px ${theme.logoOverlay.glowColor}88 !important;
        }
      `}</style>
    </>
  );
};

export default FestiveThemeProvider;

// ─────────────────────────────────────────────────────────────────
// Festive Logo Wrapper — Instagram story ring style
// ─────────────────────────────────────────────────────────────────

export const FestiveLogoWrapper: React.FC<{
  size: number;
  children: React.ReactNode;
}> = ({ size, children }) => {
  const theme = getCurrentFestiveTheme();

  if (!theme) return <>{children}</>;

  const ringColors = theme.logoOverlay.borderGradient;
  const gradientStr = `conic-gradient(${ringColors.join(', ')}, ${ringColors[0]})`;
  const ringThickness = Math.max(2, Math.round(size * 0.06)); // 6% of size
  const gap = 2; // gap between ring and logo

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Outer glow halo — very subtle, like story ring ambient */}
      <div style={{
        position: 'absolute',
        inset: -(ringThickness + gap + 2),
        borderRadius: '50%',
        background: theme.logoOverlay.glowColor,
        opacity: 0.12,
        filter: 'blur(8px)',
        animation: 'festRingPulse 3s ease-in-out infinite',
      }} />

      {/* Gradient ring (conic) */}
      <div style={{
        position: 'absolute',
        inset: -ringThickness - gap,
        borderRadius: '50%',
        background: gradientStr,
        animation: 'festRingPulse 3s ease-in-out infinite',
      }} />

      {/* White gap separator */}
      <div style={{
        position: 'absolute',
        inset: -gap,
        borderRadius: '50%',
        background: '#111',
        zIndex: 1,
      }} />

      {/* Logo image */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%', overflow: 'hidden',
        zIndex: 2,
      }}>
        {children}
      </div>

      {/* Small badge — static, bottom-right, small and tasteful */}
      {theme.logoOverlay.badge && (
        <div style={{
          position: 'absolute',
          bottom: -ringThickness - gap + 1,
          right: -ringThickness - gap + 1,
          fontSize: Math.round(size * 0.32),
          lineHeight: 1,
          zIndex: 4,
          filter: `drop-shadow(0 1px 3px rgba(0,0,0,0.7))`,
        }}>
          {theme.logoOverlay.badge}
        </div>
      )}

      <style>{`
        @keyframes festRingPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
};
