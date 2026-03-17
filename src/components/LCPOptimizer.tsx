import { useEffect } from 'react'

export default function LCPOptimizer() {
  useEffect(() => {
    console.log('🚀 LCP Optimizer initializing...')
    
    // 🎯 CRITICAL: Inline critical CSS for immediate LCP improvement
    const inlineCriticalCSS = () => {
      const criticalStyle = document.createElement('style')
      criticalStyle.innerHTML = `
        /* 🎨 CRITICAL CSS - Inlined for LCP */
        .hero-title { 
          font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
          font-weight: 900 !important; 
          line-height: 1.1 !important; 
          color: white !important;
          margin: 0 0 1.5rem 0 !important;
          font-display: swap !important;
        }
        .hero-subtitle {
          font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
          color: #d1d5db !important;
          margin: 0 0 2rem 0 !important;
          font-display: swap !important;
        }
        .btn-hero {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.75rem !important;
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: white !important;
          font-weight: 700 !important;
          padding: 1rem 2rem !important;
          border-radius: 1rem !important;
          text-decoration: none !important;
          border: none !important;
          min-height: 48px !important;
          font-size: 1rem !important;
          transform: translateZ(0) !important;
          will-change: transform !important;
        }
        .text-gradient {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        /* Prevent layout shift */
        .aspect-square { aspect-ratio: 1 / 1 !important; }
        .object-cover { object-fit: cover !important; }
        img { max-width: 100% !important; height: auto !important; }
        
        /* Font loading optimization */
        @font-face {
          font-family: 'system-fallback';
          src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
          font-display: swap;
        }
        
        /* Emergency performance mode */
        .emergency-performance * {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
      `
      document.head.insertBefore(criticalStyle, document.head.firstChild)
    }

    // ⚡ AGGRESSIVE: Font optimization
    const optimizeFonts = () => {
      // Preload only essential font weights
      const fontPreloads = [
        {
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap',
          weight: 'critical'
        }
      ]
      
      fontPreloads.forEach(font => {
        const preload = document.createElement('link')
        preload.rel = 'preload'
        preload.href = font.href
        preload.as = 'style'
        preload.fetchPriority = 'high'
        document.head.appendChild(preload)
        
        // Load font stylesheet asynchronously
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = font.href
        link.media = 'print'
        link.onload = () => { 
          link.media = 'all'
          console.log('🎨 Critical font loaded')
        }
        document.head.appendChild(link)
      })
    }

    // 🖼️ CRITICAL: Hero image preloading
    const preloadHeroAssets = () => {
      const criticalImages = [
        '/images/logo.png',
        '/uploads/products/placeholder.jpg'
      ]
      
      criticalImages.forEach(src => {
        const img = new Image()
        img.src = src
        img.decoding = 'sync'
        img.fetchPriority = 'high'
        
        const preload = document.createElement('link')
        preload.rel = 'preload'
        preload.href = src
        preload.as = 'image'
        preload.fetchPriority = 'high'
        document.head.appendChild(preload)
      })
    }

    // 🌐 DNS and resource hints
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
        { rel: 'preconnect', href: 'https://projects-backend.mlqyyh.easypanel.host' }
      ]
      
      hints.forEach(hint => {
        const link = document.createElement('link')
        link.rel = hint.rel
        link.href = hint.href
        if (hint.crossorigin) link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })
    }

    // 📱 Connection-aware optimizations
    const optimizeForConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const effectiveType = connection?.effectiveType
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          console.log('🐌 Slow connection detected - Emergency mode')
          document.body.classList.add('emergency-performance')
          
          // Disable all non-critical features
          const emergencyCSS = document.createElement('style')
          emergencyCSS.innerHTML = `
            .emergency-performance .animate-pulse,
            .emergency-performance .animate-spin,
            .emergency-performance [class*="animate-"] {
              animation: none !important;
            }
            .emergency-performance .blur-3xl,
            .emergency-performance [class*="blur-"] {
              filter: none !important;
            }
            .emergency-performance .transition-all,
            .emergency-performance [class*="transition-"] {
              transition: none !important;
            }
          `
          document.head.appendChild(emergencyCSS)
        }
      }
    }

    // 🔥 Execute all optimizations immediately
    inlineCriticalCSS()
    optimizeFonts()
    preloadHeroAssets()
    addResourceHints()
    optimizeForConnection()

    console.log('✅ LCP Optimizer ready!')
  }, [])

  useEffect(() => {
    // Monitor LCP and auto-optimize
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          const lcp = entries[entries.length - 1]
          const lcpTime = lcp.startTime
          
          console.log(`🎯 Current LCP: ${lcpTime.toFixed(0)}ms`)
          
          if (lcpTime > 4000) {
            console.log('🚨 LCP still poor! Applying emergency fixes...')
            document.body.classList.add('emergency-performance')
            
            // Remove all animations
            const emergencyStyle = document.createElement('style')
            emergencyStyle.innerHTML = `
              * { 
                animation: none !important; 
                transition: none !important;
                transform: none !important;
              }
            `
            document.head.appendChild(emergencyStyle)
          } else if (lcpTime < 2500) {
            console.log('🎉 Great LCP! Performance target achieved!')
          }
        }
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Cleanup observer
      setTimeout(() => lcpObserver.disconnect(), 15000)
    }
  }, [])

  return null
} 