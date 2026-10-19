import React from 'react';
import { getCurrentFestiveTheme } from '../utils/festivals';
import { FestiveLogoWrapper } from './FestiveTheme';

const TuneTasticLogo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  const festiveTheme = getCurrentFestiveTheme();

  const logoImg = (
    <img
      src="./logo.png"
      alt="TuneTastic Premium Logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
        position: 'relative',
        zIndex: 1,
        animation: festiveTheme ? 'tt-logo-pulse-festive 2s infinite ease-in-out' : 'tt-logo-pulse 3s infinite ease-in-out',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    />
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes tt-logo-pulse {
          0%   { transform: scale(1); box-shadow: 0 0 10px rgba(29,185,84,0.3); }
          50%  { transform: scale(1.05); box-shadow: 0 0 20px rgba(29,185,84,0.6); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(29,185,84,0.3); }
        }
        @keyframes tt-logo-pulse-festive {
          0%   { transform: scale(1); }
          33%  { transform: scale(1.06); }
          66%  { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
      `}</style>

      {festiveTheme ? (
        <FestiveLogoWrapper size={size}>
          {logoImg}
        </FestiveLogoWrapper>
      ) : (
        <>
          {/* Default background glow */}
          <div
            style={{
              position: 'absolute',
              inset: 2,
              borderRadius: '50%',
              background: 'var(--spotify-green)',
              filter: 'blur(8px)',
              opacity: 0.5,
              zIndex: 0,
            }}
          />
          {logoImg}
        </>
      )}
    </div>
  );
};

export default TuneTasticLogo;
