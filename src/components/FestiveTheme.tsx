/**
 * FestiveTheme — Premium, Real-App Style
 * - Subtle ambient bokeh lighting (tiny CSS dots, not emoji)
 * - Clear, always-visible top bar (like Swiggy's coloured announcement strip)
 * - Soft CSS colour palette shift on accent elements
 * - Instagram-story-style logo ring
 */

import React, { useEffect, useRef } from 'react';
import { getCurrentFestiveTheme, type FestiveTheme } from '../utils/festivals';

// ─────────────────────────────────────────────────────────────────
// CSS variable injection
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
// Ambient Bokeh — pure CSS glowing dots floating upward
// ─────────────────────────────────────────────────────────────────

interface BokehDot { id: number; x: number; size: number; color: string; delay: number; dur: number; }

function makeBokeh(theme: FestiveTheme): BokehDot[] {
  const colors = theme.logoOverlay.borderGradient;
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (i * 5.1 + Math.sin(i) * 12 + 100) % 100,
    size: 3 + (i % 4),
    color: colors[i % colors.length],
    delay: (i * 0.7) % 9,
    dur: 11 + (i % 7),
  }));
}

const AmbientBokeh: React.FC<{ theme: FestiveTheme }> = ({ theme }) => {
  const dots = useRef(makeBokeh(theme)).current;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 8, overflow: 'hidden' }}>
      {dots.map(d => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${d.x}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: d.color,
            opacity: 0,
            boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
            animation: `bokehUp ${d.dur}s ${d.delay}s ease-in infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bokehUp {
          0%   { transform: translateY(0);       opacity: 0;   }
          8%   {                                  opacity: 0.7; }
          85%  {                                  opacity: 0.25;}
          100% { transform: translateY(-102vh);   opacity: 0;   }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Festive Top Bar — always visible, no animation delay
// Designed like Swiggy / Zomato's top offer bar
// ─────────────────────────────────────────────────────────────────

const FestiveBar: React.FC<{ theme: FestiveTheme }> = ({ theme }) => {
  const g = theme.logoOverlay.glowColor;

  return (
    <div
      id="festive-bar"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 36,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        /* Rich solid background — very clearly visible */
        background: `linear-gradient(90deg, #1a1200 0%, ${g}40 40%, ${g}40 60%, #1a1200 100%)`,
        borderBottom: `2px solid ${g}`,
        boxShadow: `0 1px 20px ${g}60`,
      }}
    >
      <span style={{ fontSize: 16 }}>{theme.emoji}</span>

      <span style={{
        color: g,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: 0.3,
        textShadow: `0 0 12px ${g}`,
      }}>
        {theme.name}
      </span>

      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
        — {theme.message}
      </span>

      <span style={{ fontSize: 16 }}>{theme.emoji}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Main Provider
// ─────────────────────────────────────────────────────────────────

const FestiveThemeProvider: React.FC = () => {
  const theme = getCurrentFestiveTheme();

  useEffect(() => {
    if (!theme) return;
    injectFestiveCSS(theme);
    return () => removeFestiveCSS(theme);
  }, [theme?.id]);

  if (!theme) return null;

  return (
    <>
      <AmbientBokeh theme={theme} />
      <FestiveBar theme={theme} />
      <style>{`
        body.festival-active input[type=range]::-webkit-slider-thumb {
          box-shadow: 0 0 6px ${theme.logoOverlay.glowColor}99 !important;
        }
      `}</style>
    </>
  );
};

export default FestiveThemeProvider;

// ─────────────────────────────────────────────────────────────────
// Festive Logo Wrapper — Instagram story-ring style
// ─────────────────────────────────────────────────────────────────

export const FestiveLogoWrapper: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => {
  const theme = getCurrentFestiveTheme();
  if (!theme) return <>{children}</>;

  const colors = theme.logoOverlay.borderGradient;
  const thick = Math.max(2, Math.round(size * 0.07));
  const gap = 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Soft ambient glow */}
      <div style={{
        position: 'absolute',
        inset: -(thick + gap + 3),
        borderRadius: '50%',
        background: theme.logoOverlay.glowColor,
        opacity: 0.15,
        filter: 'blur(10px)',
        animation: 'festPulse 3s ease-in-out infinite',
      }} />
      {/* Gradient ring */}
      <div style={{
        position: 'absolute',
        inset: -(thick + gap),
        borderRadius: '50%',
        background: `conic-gradient(${[...colors, colors[0]].join(', ')})`,
        animation: 'festPulse 3s ease-in-out infinite',
      }} />
      {/* Gap */}
      <div style={{ position: 'absolute', inset: -gap, borderRadius: '50%', background: '#111', zIndex: 1 }} />
      {/* Logo */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', zIndex: 2 }}>
        {children}
      </div>
      {/* Badge */}
      {theme.logoOverlay.badge && (
        <div style={{
          position: 'absolute',
          bottom: -(thick + gap - 2),
          right: -(thick + gap - 2),
          fontSize: Math.round(size * 0.3),
          lineHeight: 1,
          zIndex: 4,
          filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.8))',
        }}>
          {theme.logoOverlay.badge}
        </div>
      )}
      <style>{`
        @keyframes festPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
