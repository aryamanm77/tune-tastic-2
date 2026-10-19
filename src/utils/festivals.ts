/**
 * 🎉 TuneTastic Festive Theme System
 * Auto-detects current festivals / events and returns a rich theme config.
 * Works exactly like Swiggy / Zomato / Google – dynamically updating UI on special days.
 */

export interface FestiveTheme {
  id: string;
  name: string;
  emoji: string;
  /** CSS variables to inject into :root */
  cssVars: Record<string, string>;
  /** Festive particles / decorations rendered over the UI */
  particles: ParticleConfig[];
  /** Canvas-based overlay drawn ON TOP of the logo image */
  logoOverlay: LogoOverlay;
  /** Optional body class for CSS-driven effects */
  bodyClass?: string;
  /** Banner message */
  message: string;
}

export interface ParticleConfig {
  type: 'diya' | 'star' | 'snowflake' | 'heart' | 'holi-splash' | 'firework' | 'leaf' | 'petal' | 'crescent' | 'egg' | 'shamrock' | 'lantern';
  count: number;
  colors: string[];
  size: [number, number]; // [min, max]
  speed: [number, number];
}

export interface LogoOverlay {
  type: 'none' | 'diwali' | 'christmas' | 'holi' | 'tricolor' | 'new-year' | 'eid' | 'halloween' | 'valentine' | 'independence' | 'pongal' | 'navratri' | 'onam' | 'durga-puja' | 'lohri' | 'raksha-bandhan' | 'baisakhi' | 'ganesh-chaturthi';
  /** Glow color around logo ring */
  glowColor: string;
  /** Border gradient – two or more stops */
  borderGradient: string[];
  /** Small emoji badge drawn in bottom-right corner */
  badge: string;
  /** Scale factor for badge */
  badgeSize?: number;
}

// ------------------------------------------------------------------
// Date helper – uses IST (India Standard Time) as primary locale
// ------------------------------------------------------------------

function today() {
  // Always use India's date as the baseline for festivals
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  return { month: ist.getUTCMonth() + 1, day: ist.getUTCDate() };
}

// ------------------------------------------------------------------
// Festival Calendar
// Each entry has a date range [month, startDay, endDay]
// Priority: earlier in array wins
// ------------------------------------------------------------------

type FestivalEntry = {
  check: (month: number, day: number) => boolean;
  theme: FestiveTheme;
};

const FESTIVALS: FestivalEntry[] = [

  // ──────────────────────────── JANUARY ────────────────────────────

  {
    check: (m, d) => m === 1 && d <= 2,          // New Year (1 Jan – 2 Jan)
    theme: {
      id: 'new-year',
      name: 'Happy New Year! 🎆',
      emoji: '🎆',
      message: 'Wishing you a year filled with music & magic!',
      cssVars: {
        '--spotify-green': '#FFD700',
        '--spotify-green-hover': '#FFF176',
        '--bg-base': '#0a0a1a',
        '--bg-elevated': '#12122a',
        '--bg-card': '#0d0d20',
        '--festive-accent': '#FFD700',
        '--festive-accent-2': '#ff6b6b',
      },
      particles: [
        { type: 'firework', count: 18, colors: ['#FFD700', '#ff4d4d', '#00e5ff', '#e040fb', '#76ff03'], size: [6, 14], speed: [1.5, 3.5] },
        { type: 'star', count: 30, colors: ['#FFD700', '#ffffff'], size: [2, 5], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'new-year',
        glowColor: '#FFD700',
        borderGradient: ['#FFD700', '#ff4d4d', '#00e5ff', '#FFD700'],
        badge: '🎆',
        badgeSize: 1.2,
      },
      bodyClass: 'festival-new-year',
    },
  },

  {
    check: (m, d) => m === 1 && d >= 13 && d <= 16, // Pongal / Makar Sankranti / Lohri (13–16 Jan)
    theme: {
      id: 'pongal',
      name: 'Pongal & Makar Sankranti 🪁',
      emoji: '🪁',
      message: 'May your life overflow with sweetness and harvest blessings!',
      cssVars: {
        '--spotify-green': '#FF8F00',
        '--spotify-green-hover': '#FFA726',
        '--bg-base': '#1a0d00',
        '--bg-elevated': '#2a1500',
        '--bg-card': '#1f1000',
        '--festive-accent': '#FF8F00',
        '--festive-accent-2': '#4CAF50',
      },
      particles: [
        { type: 'leaf', count: 20, colors: ['#4CAF50', '#8BC34A', '#FF8F00', '#FFCA28'], size: [6, 12], speed: [0.6, 1.2] },
        { type: 'petal', count: 15, colors: ['#FF8F00', '#FFC107', '#FFEB3B'], size: [5, 10], speed: [0.4, 1.0] },
      ],
      logoOverlay: {
        type: 'pongal',
        glowColor: '#FF8F00',
        borderGradient: ['#FF8F00', '#4CAF50', '#FFCA28'],
        badge: '🌾',
      },
    },
  },

  {
    check: (m, d) => m === 1 && d >= 26 && d <= 27, // Republic Day (26 Jan)
    theme: {
      id: 'republic-day',
      name: 'Republic Day 🇮🇳',
      emoji: '🇮🇳',
      message: 'Jai Hind! Celebrating 75+ years of our great Republic!',
      cssVars: {
        '--spotify-green': '#138808',
        '--spotify-green-hover': '#1aac0a',
        '--bg-base': '#07160a',
        '--bg-elevated': '#0f2415',
        '--bg-card': '#0a1c0e',
        '--festive-accent': '#FF9933',
        '--festive-accent-2': '#138808',
      },
      particles: [
        { type: 'petal', count: 25, colors: ['#FF9933', '#FFFFFF', '#138808'], size: [6, 12], speed: [0.5, 1.2] },
        { type: 'star', count: 12, colors: ['#0000FF', '#FF9933'], size: [3, 7], speed: [0.3, 0.7] },
      ],
      logoOverlay: {
        type: 'tricolor',
        glowColor: '#FF9933',
        borderGradient: ['#FF9933', '#FFFFFF', '#138808', '#FF9933'],
        badge: '🇮🇳',
      },
      bodyClass: 'festival-tricolor',
    },
  },

  // ──────────────────────────── FEBRUARY ────────────────────────────

  {
    check: (m, d) => m === 2 && d >= 14 && d <= 15, // Valentine's Day
    theme: {
      id: 'valentine',
      name: "Valentine's Day 💖",
      emoji: '💖',
      message: 'Love is the best music. Tune in to what matters!',
      cssVars: {
        '--spotify-green': '#e91e8c',
        '--spotify-green-hover': '#f048a8',
        '--bg-base': '#1a0510',
        '--bg-elevated': '#250820',
        '--bg-card': '#1f0618',
        '--festive-accent': '#e91e8c',
        '--festive-accent-2': '#ff6090',
      },
      particles: [
        { type: 'heart', count: 25, colors: ['#e91e8c', '#ff6090', '#ff4081', '#f8bbd0'], size: [8, 18], speed: [0.4, 1.2] },
        { type: 'petal', count: 15, colors: ['#ff8fa3', '#f48fb1'], size: [4, 10], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'valentine',
        glowColor: '#e91e8c',
        borderGradient: ['#e91e8c', '#ff6090', '#f8bbd0', '#e91e8c'],
        badge: '💖',
      },
      bodyClass: 'festival-valentine',
    },
  },

  // ──────────────────────────── MARCH ────────────────────────────

  {
    check: (m, d) => m === 3 && d >= 1 && d <= 3,  // Holi (approx. March 1–3, varies by year)
    theme: {
      id: 'holi',
      name: 'Happy Holi! 🎨',
      emoji: '🎨',
      message: 'Let colours of joy fill your life with music and laughter!',
      cssVars: {
        '--spotify-green': '#FF4081',
        '--spotify-green-hover': '#FF80AB',
        '--bg-base': '#1a0518',
        '--bg-elevated': '#280a2a',
        '--bg-card': '#1f0820',
        '--festive-accent': '#FF4081',
        '--festive-accent-2': '#7C4DFF',
      },
      particles: [
        { type: 'holi-splash', count: 30, colors: ['#FF4081', '#7C4DFF', '#00BCD4', '#FFEB3B', '#4CAF50', '#FF9800', '#E91E63'], size: [8, 20], speed: [1, 2.5] },
        { type: 'petal', count: 20, colors: ['#FF4081', '#7C4DFF', '#00BCD4'], size: [5, 10], speed: [0.5, 1.2] },
      ],
      logoOverlay: {
        type: 'holi',
        glowColor: '#FF4081',
        borderGradient: ['#FF4081', '#7C4DFF', '#00BCD4', '#FFEB3B', '#4CAF50', '#FF4081'],
        badge: '🎨',
      },
      bodyClass: 'festival-holi',
    },
  },

  {
    check: (m, d) => m === 3 && d >= 17 && d <= 18, // St. Patrick's Day
    theme: {
      id: 'st-patricks',
      name: "St. Patrick's Day ☘️",
      emoji: '☘️',
      message: 'May the luck of the Irish be with your playlist!',
      cssVars: {
        '--spotify-green': '#00C853',
        '--spotify-green-hover': '#69F0AE',
        '--bg-base': '#001a08',
        '--bg-elevated': '#002612',
        '--bg-card': '#001c0a',
        '--festive-accent': '#00C853',
        '--festive-accent-2': '#FFD600',
      },
      particles: [
        { type: 'shamrock', count: 20, colors: ['#00C853', '#69F0AE', '#FFD600'], size: [8, 16], speed: [0.4, 1.0] },
      ],
      logoOverlay: {
        type: 'none',
        glowColor: '#00C853',
        borderGradient: ['#00C853', '#FFD600', '#00C853'],
        badge: '☘️',
      },
    },
  },

  // ──────────────────────────── APRIL ────────────────────────────

  {
    check: (m, d) => m === 4 && d >= 13 && d <= 15, // Baisakhi
    theme: {
      id: 'baisakhi',
      name: 'Happy Baisakhi! 🌾',
      emoji: '🌾',
      message: 'Celebrating harvest, hope and vibrant Punjabi spirit!',
      cssVars: {
        '--spotify-green': '#FF6F00',
        '--spotify-green-hover': '#FFA726',
        '--bg-base': '#1a0d00',
        '--bg-elevated': '#2a1500',
        '--bg-card': '#1f1000',
        '--festive-accent': '#FF6F00',
        '--festive-accent-2': '#4CAF50',
      },
      particles: [
        { type: 'petal', count: 25, colors: ['#FF6F00', '#FFC107', '#4CAF50'], size: [6, 14], speed: [0.5, 1.2] },
        { type: 'leaf', count: 15, colors: ['#4CAF50', '#8BC34A'], size: [6, 12], speed: [0.4, 1.0] },
      ],
      logoOverlay: {
        type: 'baisakhi',
        glowColor: '#FF6F00',
        borderGradient: ['#FF6F00', '#4CAF50', '#FFCA28'],
        badge: '🌾',
      },
    },
  },

  // ──────────────────────────── AUGUST ────────────────────────────

  {
    check: (m, d) => m === 8 && d >= 14 && d <= 16, // Independence Day (15 Aug)
    theme: {
      id: 'independence-day',
      name: 'Independence Day 🇮🇳',
      emoji: '🇮🇳',
      message: 'Celebrating the spirit of free India! Jai Hind! 🎵',
      cssVars: {
        '--spotify-green': '#138808',
        '--spotify-green-hover': '#1aac0a',
        '--bg-base': '#07160a',
        '--bg-elevated': '#0f2415',
        '--bg-card': '#0a1c0e',
        '--festive-accent': '#FF9933',
        '--festive-accent-2': '#138808',
      },
      particles: [
        { type: 'petal', count: 30, colors: ['#FF9933', '#FFFFFF', '#138808'], size: [6, 14], speed: [0.5, 1.5] },
        { type: 'star', count: 12, colors: ['#0000FF', '#FF9933', '#138808'], size: [3, 8], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'tricolor',
        glowColor: '#FF9933',
        borderGradient: ['#FF9933', '#FFFFFF', '#138808', '#FF9933'],
        badge: '🇮🇳',
      },
      bodyClass: 'festival-tricolor',
    },
  },

  {
    check: (m, d) => m === 8 && d >= 19 && d <= 21, // Raksha Bandhan (approx. Aug)
    theme: {
      id: 'raksha-bandhan',
      name: 'Raksha Bandhan 🪢',
      emoji: '🪢',
      message: 'Celebrating the beautiful bond of siblings!',
      cssVars: {
        '--spotify-green': '#E91E63',
        '--spotify-green-hover': '#F06292',
        '--bg-base': '#1a0510',
        '--bg-elevated': '#250820',
        '--bg-card': '#1f0618',
        '--festive-accent': '#E91E63',
        '--festive-accent-2': '#FFD600',
      },
      particles: [
        { type: 'petal', count: 25, colors: ['#E91E63', '#FFD600', '#FF9800', '#F48FB1'], size: [5, 12], speed: [0.4, 1.0] },
        { type: 'heart', count: 10, colors: ['#E91E63', '#F48FB1'], size: [6, 12], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'raksha-bandhan',
        glowColor: '#E91E63',
        borderGradient: ['#E91E63', '#FFD600', '#E91E63'],
        badge: '🪢',
      },
    },
  },

  // ──────────────────────────── SEPTEMBER ────────────────────────────

  {
    check: (m, d) => m === 9 && d >= 7 && d <= 10, // Ganesh Chaturthi (approx. Sep)
    theme: {
      id: 'ganesh-chaturthi',
      name: 'Ganesh Chaturthi 🐘',
      emoji: '🐘',
      message: 'Ganpati Bappa Morya! May Ganesha bless your music journey!',
      cssVars: {
        '--spotify-green': '#FF6F00',
        '--spotify-green-hover': '#FFA726',
        '--bg-base': '#1a0d00',
        '--bg-elevated': '#2a1500',
        '--bg-card': '#1f1000',
        '--festive-accent': '#FF6F00',
        '--festive-accent-2': '#FFD600',
      },
      particles: [
        { type: 'petal', count: 25, colors: ['#FF6F00', '#FFD600', '#FF9800', '#FF5722'], size: [6, 14], speed: [0.4, 1.2] },
        { type: 'star', count: 15, colors: ['#FFD600', '#FF6F00'], size: [3, 8], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'ganesh-chaturthi',
        glowColor: '#FF6F00',
        borderGradient: ['#FF6F00', '#FFD600', '#FF9800'],
        badge: '🐘',
      },
    },
  },

  // ──────────────────────────── OCTOBER ────────────────────────────

  {
    check: (m, d) => m === 10 && d >= 2 && d <= 5, // Navratri / Durga Puja (approx. Oct 2–12)
    theme: {
      id: 'navratri',
      name: 'Navratri 💃',
      emoji: '💃',
      message: 'Dance to the divine rhythm! Jai Mata Di!',
      cssVars: {
        '--spotify-green': '#E91E63',
        '--spotify-green-hover': '#FF4081',
        '--bg-base': '#1a0010',
        '--bg-elevated': '#280020',
        '--bg-card': '#1f0018',
        '--festive-accent': '#E91E63',
        '--festive-accent-2': '#FF6F00',
      },
      particles: [
        { type: 'petal', count: 30, colors: ['#E91E63', '#FF6F00', '#FF4081', '#FFD600', '#E91E63'], size: [5, 14], speed: [0.5, 1.3] },
        { type: 'star', count: 12, colors: ['#FFD600', '#E91E63'], size: [3, 8], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'navratri',
        glowColor: '#E91E63',
        borderGradient: ['#E91E63', '#FF6F00', '#FFD600', '#9C27B0', '#E91E63'],
        badge: '💃',
      },
      bodyClass: 'festival-navratri',
    },
  },

  {
    check: (m, d) => m === 10 && d >= 20 && d <= 22, // Dussehra
    theme: {
      id: 'dussehra',
      name: 'Happy Dussehra! 🏹',
      emoji: '🏹',
      message: 'May good triumph in your life always!',
      cssVars: {
        '--spotify-green': '#FF5722',
        '--spotify-green-hover': '#FF7043',
        '--bg-base': '#1a0800',
        '--bg-elevated': '#2a1000',
        '--bg-card': '#1f0a00',
        '--festive-accent': '#FF5722',
        '--festive-accent-2': '#FFD600',
      },
      particles: [
        { type: 'petal', count: 25, colors: ['#FF5722', '#FFD600', '#FF9800'], size: [6, 14], speed: [0.5, 1.2] },
        { type: 'star', count: 12, colors: ['#FFD600', '#FF5722'], size: [3, 7], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'none',
        glowColor: '#FF5722',
        borderGradient: ['#FF5722', '#FFD600', '#FF5722'],
        badge: '🏹',
      },
    },
  },

  {
    check: (m, d) => m === 10 && d >= 31 && d <= 31, // Halloween
    theme: {
      id: 'halloween',
      name: 'Halloween 🎃',
      emoji: '🎃',
      message: 'Spooky tunes incoming... if you dare!',
      cssVars: {
        '--spotify-green': '#FF6D00',
        '--spotify-green-hover': '#FF8F00',
        '--bg-base': '#0d0010',
        '--bg-elevated': '#180020',
        '--bg-card': '#110015',
        '--festive-accent': '#FF6D00',
        '--festive-accent-2': '#7B1FA2',
      },
      particles: [
        { type: 'star', count: 20, colors: ['#FF6D00', '#7B1FA2', '#FFF176'], size: [3, 8], speed: [0.3, 0.9] },
        { type: 'leaf', count: 15, colors: ['#FF6D00', '#8B4513', '#5D4037'], size: [6, 14], speed: [0.5, 1.2] },
      ],
      logoOverlay: {
        type: 'halloween',
        glowColor: '#FF6D00',
        borderGradient: ['#FF6D00', '#7B1FA2', '#FF6D00'],
        badge: '🎃',
        badgeSize: 1.3,
      },
      bodyClass: 'festival-halloween',
    },
  },

  // ──────────────────────────── NOVEMBER ────────────────────────────

  {
    check: (m, d) => (m === 10 && d >= 28) || (m === 11 && d <= 5), // Diwali (varies – using approx. Oct 28 – Nov 5)
    theme: {
      id: 'diwali',
      name: 'Happy Diwali! 🪔',
      emoji: '🪔',
      message: 'May the festival of lights fill your life with joy & melody!',
      cssVars: {
        '--spotify-green': '#FFB300',
        '--spotify-green-hover': '#FFD54F',
        '--bg-base': '#0d0800',
        '--bg-elevated': '#1a1200',
        '--bg-card': '#120d00',
        '--festive-accent': '#FFB300',
        '--festive-accent-2': '#E91E63',
      },
      particles: [
        { type: 'diya', count: 16, colors: ['#FFB300', '#FF6D00', '#E91E63', '#FF5722'], size: [10, 20], speed: [0.3, 0.8] },
        { type: 'firework', count: 10, colors: ['#FFD700', '#FF6D00', '#E91E63', '#FFEB3B'], size: [5, 12], speed: [1.5, 3.0] },
        { type: 'star', count: 25, colors: ['#FFB300', '#FFD700', '#ffffff'], size: [2, 5], speed: [0.2, 0.6] },
      ],
      logoOverlay: {
        type: 'diwali',
        glowColor: '#FFB300',
        borderGradient: ['#FFB300', '#FF6D00', '#E91E63', '#FFB300'],
        badge: '🪔',
        badgeSize: 1.2,
      },
      bodyClass: 'festival-diwali',
    },
  },

  // ──────────────────────────── DECEMBER ────────────────────────────

  {
    check: (m, d) => m === 12 && d >= 24 && d <= 26, // Christmas
    theme: {
      id: 'christmas',
      name: 'Merry Christmas! 🎄',
      emoji: '🎄',
      message: 'Deck the halls with music & joy! Ho Ho Ho! 🎅',
      cssVars: {
        '--spotify-green': '#00C853',
        '--spotify-green-hover': '#69F0AE',
        '--bg-base': '#001a08',
        '--bg-elevated': '#002612',
        '--bg-card': '#001c0a',
        '--festive-accent': '#00C853',
        '--festive-accent-2': '#E53935',
      },
      particles: [
        { type: 'snowflake', count: 30, colors: ['#ffffff', '#e0f7fa', '#b2ebf2'], size: [4, 12], speed: [0.3, 1.0] },
        { type: 'star', count: 15, colors: ['#FFD700', '#ffffff'], size: [3, 8], speed: [0.2, 0.6] },
      ],
      logoOverlay: {
        type: 'christmas',
        glowColor: '#00C853',
        borderGradient: ['#00C853', '#E53935', '#00C853'],
        badge: '🎄',
        badgeSize: 1.2,
      },
      bodyClass: 'festival-christmas',
    },
  },

  {
    check: (m, d) => m === 12 && d >= 31,          // New Year's Eve
    theme: {
      id: 'new-year-eve',
      name: "New Year's Eve 🥂",
      emoji: '🥂',
      message: 'Ring in the New Year with the best beats!',
      cssVars: {
        '--spotify-green': '#FFD700',
        '--spotify-green-hover': '#FFF176',
        '--bg-base': '#0a0a1a',
        '--bg-elevated': '#12122a',
        '--bg-card': '#0d0d20',
        '--festive-accent': '#FFD700',
        '--festive-accent-2': '#ff6b6b',
      },
      particles: [
        { type: 'firework', count: 20, colors: ['#FFD700', '#ff4d4d', '#00e5ff', '#e040fb', '#76ff03'], size: [6, 14], speed: [1.5, 3.5] },
        { type: 'star', count: 30, colors: ['#FFD700', '#ffffff'], size: [2, 5], speed: [0.3, 0.8] },
      ],
      logoOverlay: {
        type: 'new-year',
        glowColor: '#FFD700',
        borderGradient: ['#FFD700', '#ff4d4d', '#00e5ff', '#FFD700'],
        badge: '🥂',
        badgeSize: 1.2,
      },
      bodyClass: 'festival-new-year',
    },
  },
];

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

let _cachedTheme: FestiveTheme | null | undefined = undefined;

export function getCurrentFestiveTheme(): FestiveTheme | null {
  if (_cachedTheme !== undefined) return _cachedTheme;

  const { month, day } = today();
  for (const entry of FESTIVALS) {
    if (entry.check(month, day)) {
      _cachedTheme = entry.theme;
      return _cachedTheme;
    }
  }
  _cachedTheme = null;
  return null;
}

/** Clear cache (useful for testing / time-travel) */
export function clearFestiveCache() {
  _cachedTheme = undefined;
}
