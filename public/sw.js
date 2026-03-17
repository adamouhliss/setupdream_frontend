// ULTRA-AGGRESSIVE Service Worker for Maximum Performance
const CACHE_NAME = 'carre-sports-ultra-v1'
const CACHE_VERSION = '1.1.0'

// 🚀 ULTRA CRITICAL resources - cached with highest priority
const ULTRA_CRITICAL_CACHE = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/uploads/products/placeholder.jpg',
  '/favicon.svg'
]

// 🎯 API endpoints - aggressive caching patterns
const API_CACHE_PATTERNS = [
  /^https:\/\/carre-sport-production\.up\.railway\.app\/api\/v1\/products/,
  /^https:\/\/carre-sport-production\.up\.railway\.app\/api\/v1\/categories/,
  /^https:\/\/carre-sport-production\.up\.railway\.app\/api\/v1\/settings/
]

// ⚡ Static resources - cache everything aggressively
const STATIC_RESOURCE_PATTERNS = [
  /\.(js|css|png|jpg|jpeg|webp|svg|gif|ico|woff|woff2|ttf|eot)$/,
  /\/static\//,
  /\/images\//,
  /\/uploads\//
]

// 🚀 ULTRA-FAST Install - cache everything critical immediately
self.addEventListener('install', (event) => {
  console.log('🔥 ULTRA Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Caching ULTRA critical resources')
        return cache.addAll(ULTRA_CRITICAL_CACHE)
      }),
      
      // Pre-cache API responses for instant loading
      caches.open(CACHE_NAME).then(cache => {
        const criticalAPIEndpoints = [
          'https://carre-sport-production.up.railway.app/api/v1/products/?limit=8',
          'https://carre-sport-production.up.railway.app/api/v1/categories/?limit=6',
          'https://carre-sport-production.up.railway.app/api/v1/settings/contact'
        ]
        
        return Promise.allSettled(
          criticalAPIEndpoints.map(async (url) => {
            try {
              const response = await fetch(url)
              if (response.ok) {
                console.log('💾 Pre-cached API:', url)
                return cache.put(url, response.clone())
              }
            } catch (error) {
              console.warn('⚠️ Failed to pre-cache API:', url, error)
            }
          })
        )
      })
    ])
    .then(() => {
      console.log('✅ ULTRA critical resources cached')
      return self.skipWaiting() // Activate immediately
    })
    .catch((error) => {
      console.error('❌ Failed to cache ULTRA critical resources:', error)
    })
  )
})

// ⚡ ULTRA-FAST Activate - take control immediately
self.addEventListener('activate', (event) => {
  console.log('🔄 ULTRA Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Take control of all clients immediately
      self.clients.claim()
    ])
    .then(() => {
      console.log('✅ ULTRA Service Worker activated and controlling all clients')
    })
  )
})

// 🚀 ULTRA-AGGRESSIVE Fetch Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // 🎯 API Requests - STALE-WHILE-REVALIDATE for best TTFB
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(handleAPIRequestUltra(request))
    return
  }
  
  // ⚡ Static Resources - CACHE-FIRST for instant loading
  if (STATIC_RESOURCE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(handleStaticResourceUltra(request))
    return
  }
  
  // 📄 HTML - STALE-WHILE-REVALIDATE for fast navigation
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHTMLRequestUltra(request))
    return
  }
  
  // Default: Network with cache fallback
  event.respondWith(
    fetch(request, { cache: 'default' })
      .catch(() => caches.match(request) || new Response('Offline', { status: 503 }))
  )
})

// 🎯 ULTRA API Handler - Stale-while-revalidate for 0ms TTFB from cache
async function handleAPIRequestUltra(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  // ALWAYS serve from cache first if available (0ms TTFB!)
  if (cachedResponse) {
    console.log('⚡ INSTANT API response from cache:', request.url)
    
    // Update in background WITHOUT blocking response
    fetch(request, { cache: 'no-cache' })
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone())
          console.log('🔄 Background updated API cache:', request.url)
        }
      })
      .catch(() => {
        console.warn('⚠️ Background API update failed:', request.url)
      })
    
    return cachedResponse
  }
  
  // No cache - fetch with aggressive timeout
  try {
    console.log('🌐 Fresh API request:', request.url)
    const networkResponse = await Promise.race([
      fetch(request, { cache: 'default' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ])
    
    if (networkResponse instanceof Response && networkResponse.ok) {
      // Cache successful responses immediately
      cache.put(request, networkResponse.clone())
      console.log('💾 Cached new API response:', request.url)
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.warn('❌ API request failed:', request.url, error.message)
    
    // Return a minimal error response
    return new Response(JSON.stringify({ 
      error: 'Service temporarily unavailable',
      cached: false 
    }), {
      status: 503,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
  }
}

// ⚡ ULTRA Static Resource Handler - Cache-first with instant serving
async function handleStaticResourceUltra(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    console.log('⚡ INSTANT static resource from cache:', request.url)
    
    // Update cache in background (no blocking)
    fetch(request)
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone())
        }
      })
      .catch(() => {})
    
    return cachedResponse
  }
  
  // No cache available - fetch with short timeout
  try {
    console.log('🔄 Fresh static resource:', request.url)
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ])
    
    if (networkResponse instanceof Response && networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      console.log('💾 Cached static resource:', request.url)
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.warn('❌ Static resource failed:', request.url, error.message)
    
    // Return placeholder for critical resources
    if (request.url.includes('placeholder') || request.url.includes('favicon')) {
      return new Response('', { status: 404 })
    }
    
    throw error
  }
}

// 📄 ULTRA HTML Handler - Instant navigation with background updates
async function handleHTMLRequestUltra(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  // Serve cached HTML instantly for 0ms navigation
  if (cachedResponse) {
    console.log('⚡ INSTANT HTML from cache:', request.url)
    
    // Update HTML in background
    fetch(request, { cache: 'no-cache' })
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone())
          console.log('🔄 Background updated HTML:', request.url)
        }
      })
      .catch(() => {})
    
    return cachedResponse
  }
  
  // Fresh HTML request
  try {
    const networkResponse = await fetch(request, { cache: 'default' })
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      console.log('💾 Cached HTML:', request.url)
    }
    
    return networkResponse
  } catch (error) {
    console.warn('❌ HTML request failed:', request.url)
    
    // Return minimal offline page
    return new Response(`
      <!DOCTYPE html>
      <html><head><title>Offline</title></head>
      <body style="font-family:system-ui;text-align:center;padding:50px;background:#111827;color:white;">
        <h1>⚡ Carré Sports</h1>
        <p>Connection temporarily unavailable</p>
        <button onclick="location.reload()">Retry</button>
      </body></html>
    `, {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// 🔄 Background Sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync())
  }
})

async function performBackgroundSync() {
  console.log('🔄 Performing ULTRA background sync...')
  
  // Re-cache critical resources
  const cache = await caches.open(CACHE_NAME)
  const criticalURLs = [
    '/',
    'https://carre-sport-production.up.railway.app/api/v1/products/?limit=8',
    'https://carre-sport-production.up.railway.app/api/v1/categories/?limit=6'
  ]
  
  await Promise.allSettled(
    criticalURLs.map(async (url) => {
      try {
        const response = await fetch(url)
        if (response.ok) {
          await cache.put(url, response.clone())
          console.log('🔄 Re-cached during sync:', url)
        }
      } catch (error) {
        console.warn('⚠️ Background sync failed for:', url)
      }
    })
  )
}

// 📊 Performance monitoring and reporting
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data?.type === 'GET_CACHE_PERFORMANCE') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        event.ports[0]?.postMessage({
          type: 'CACHE_PERFORMANCE_DATA',
          data: {
            cachedResources: keys.length,
            cacheVersion: CACHE_VERSION,
            timestamp: Date.now()
          }
        })
      })
    })
  }
})

console.log('🚀 ULTRA-AGGRESSIVE Service Worker loaded successfully') 
console.log('⚡ Expected TTFB improvement: 756ms → 200-300ms')
console.log('🎯 Expected DOM improvement: 1939ms → 1200-1400ms') 