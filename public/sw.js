// Service Worker for Global Anti-CCP Resistance Hub
// Deployed at: https://global-anti-ccp-resistance-hub.stane203.workers.dev/
const CACHE_NAME = 'resistance-hub-v3';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately (app shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const VALID_CACHES = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!VALID_CACHES.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Determine caching strategy by request type
function getCacheStrategy(request) {
  const url = new URL(request.url);

  // Hashed assets (JS/CSS bundles with content hash) — cache-first (immutable)
  if (url.pathname.startsWith('/assets/')) {
    return 'cache-first';
  }

  // Navigation requests — network-first (always try to get fresh HTML)
  if (request.mode === 'navigate') {
    return 'network-first';
  }

  // API calls to external services — network-only (don't cache CORS proxy)
  if (url.hostname !== self.location.hostname) {
    return 'network-only';
  }

  // Static files (icons, manifest) — stale-while-revalidate
  if (url.pathname.match(/\.(png|svg|ico|json)$/)) {
    return 'stale-while-revalidate';
  }

  // Default — network-first
  return 'network-first';
}

// Cache-first: return cached version immediately, only fetch if not cached
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Network error', { status: 408 });
  }
}

// Network-first: try network, fall back to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
}

// Stale-while-revalidate: return cache immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  return cached || await fetchPromise || new Response('Network error', { status: 408 });
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (CORS proxies etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  const strategy = getCacheStrategy(event.request);

  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(event.request));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request));
      break;
    case 'network-only':
      // Let browser handle normally
      break;
    case 'network-first':
    default:
      event.respondWith(networkFirst(event.request));
      break;
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  // Placeholder for syncing offline reports when connection is restored
  console.log('[SW] Syncing offline reports...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
