/**
 * TuneTastic Service Worker
 *
 * KEY FEATURE: Intercepts every /manifest.json request and returns a
 * DYNAMICALLY GENERATED manifest based on today's date — including the
 * correct festive icon. This is what makes the home screen icon
 * automatically update for already-installed PWAs on Android Chrome.
 *
 * How Chrome handles this:
 * - Chrome re-checks the manifest every ~24h for installed PWAs
 * - When it sees a new icon URL, it downloads and applies it automatically
 * - No reinstall needed — icon just updates in the background
 */

const CACHE_NAME = 'tunetastic-v4';
const STATIC_ASSETS = [
  '/',
  '/icon-192.png',
  '/icon-diwali.png',
  '/icon-christmas.png',
  '/icon-holi.png',
  '/icon-independence.png',
  '/icon-newyear.png',
  '/logo.png',
];

// ─────────────────────────────────────────────────────────────────
// Festival detector (mirrors festivals.ts logic, plain JS for SW)
// ─────────────────────────────────────────────────────────────────

function getFestivalInfo() {
  var now = new Date();
  // IST = UTC + 5:30
  var ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  var m = ist.getUTCMonth() + 1;
  var d = ist.getUTCDate();

  // Returns { icon, themeColor, name, shortName, bgColor }
  if (m === 1  && d <= 2)            return { icon: '/icon-newyear.png',      themeColor: '#FFD700', bgColor: '#0a0a1a', name: 'TuneTastic — Happy New Year! \uD83C\uDF86',   shortName: 'TuneTastic \uD83C\uDF86' };
  if (m === 1  && d >= 26 && d <= 27) return { icon: '/icon-independence.png', themeColor: '#FF9933', bgColor: '#07160a', name: 'TuneTastic — Jai Hind! \uD83C\uDDEE\uD83C\uDDF3',              shortName: 'TuneTastic \uD83C\uDDEE\uD83C\uDDF3' };
  if (m === 2  && d >= 14 && d <= 15) return { icon: '/icon-192.png',          themeColor: '#e91e8c', bgColor: '#1a0510', name: "TuneTastic — Happy Valentine's! \uD83D\uDC96", shortName: 'TuneTastic \uD83D\uDC96' };
  if (m === 3  && d >= 1  && d <= 3)  return { icon: '/icon-holi.png',         themeColor: '#FF4081', bgColor: '#1a0518', name: 'TuneTastic — Happy Holi! \uD83C\uDFA8',        shortName: 'TuneTastic \uD83C\uDFA8' };
  if (m === 8  && d >= 14 && d <= 16) return { icon: '/icon-independence.png', themeColor: '#FF9933', bgColor: '#07160a', name: 'TuneTastic — Jai Hind! \uD83C\uDDEE\uD83C\uDDF3',              shortName: 'TuneTastic \uD83C\uDDEE\uD83C\uDDF3' };
  if (m === 10 && d >= 15 && d <= 27) return { icon: '/icon-diwali.png',       themeColor: '#FFB300', bgColor: '#0d0800', name: 'TuneTastic — Happy Diwali! \uD83E\uDE94',     shortName: 'TuneTastic \uD83E\uDE94' };
  if (m === 12 && d >= 24 && d <= 26) return { icon: '/icon-christmas.png',    themeColor: '#00C853', bgColor: '#001a08', name: 'TuneTastic — Merry Christmas! \uD83C\uDF84',   shortName: 'TuneTastic \uD83C\uDF84' };
  if (m === 12 && d >= 31)            return { icon: '/icon-newyear.png',      themeColor: '#FFD700', bgColor: '#0a0a1a', name: "TuneTastic — Happy New Year's Eve! \uD83E\uDD42", shortName: 'TuneTastic \uD83E\uDD42' };

  // Default (no festival)
  return { icon: '/icon-192.png', themeColor: '#1db954', bgColor: '#05050c', name: 'TuneTastic Web Player', shortName: 'TuneTastic' };
}

// ─────────────────────────────────────────────────────────────────
// Build a manifest JSON string dynamically
// ─────────────────────────────────────────────────────────────────

function buildManifest() {
  var f = getFestivalInfo();
  var manifest = {
    id: '/',
    name: f.name,
    short_name: f.shortName,
    description: 'Your personal music streaming app',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: f.bgColor,
    theme_color: f.themeColor,
    categories: ['music', 'entertainment'],
    icons: [
      { src: f.icon, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: f.icon, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: f.icon, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
  return JSON.stringify(manifest, null, 2);
}

// ─────────────────────────────────────────────────────────────────
// Service Worker lifecycle
// ─────────────────────────────────────────────────────────────────

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS).catch(function(err) {
        console.log('SW cache prefetch warning (non-critical):', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(function() {
      return clients.claim();
    })
  );
});

// ─────────────────────────────────────────────────────────────────
// Fetch handler — intercept manifest.json and serve dynamic version
// ─────────────────────────────────────────────────────────────────

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // 🎯 KEY: Intercept /manifest.json → return live festive manifest
  if (url.pathname === '/manifest.json') {
    event.respondWith(
      new Response(buildManifest(), {
        status: 200,
        headers: {
          'Content-Type': 'application/manifest+json',
          // No caching — always fresh so Chrome picks up icon changes
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    );
    return;
  }

  // For everything else: network-first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
