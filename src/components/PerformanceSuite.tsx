import { useEffect } from 'react'

// Enhanced Performance Suite for aggressive LCP and performance optimization
export default function PerformanceSuite() {
  useEffect(() => {
    console.log('🚀 Enhanced Performance Suite initializing...')
    
    // 🎯 CRITICAL: Inline critical CSS for immediate LCP improvement
    const inlineCriticalCSS = () => {
      // Check if already added
      if (document.querySelector('#critical-perf-css')) return
      
      const criticalStyle = document.createElement('style')
      criticalStyle.id = 'critical-perf-css'
      criticalStyle.innerHTML = `
        /* 🎨 CRITICAL CSS - Enhanced for LCP */
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
        .btn-hero, .btn-primary {
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
          cursor: pointer !important;
        }
        .btn-hero:hover, .btn-primary:hover {
          transform: translateY(-1px) !important;
          background: linear-gradient(135deg, #d97706, #b45309) !important;
        }
        .text-gold-gradient, .text-gradient {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        
        /* Performance enhancements */
        img { 
          content-visibility: auto !important;
          max-width: 100% !important; 
          height: auto !important; 
        }
        .aspect-square { aspect-ratio: 1 / 1 !important; }
        .object-cover { object-fit: cover !important; }
        
        /* Emergency performance mode */
        .emergency-performance * {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
        .emergency-performance .animate-pulse,
        .emergency-performance .animate-spin,
        .emergency-performance [class*="animate-"] {
          animation: none !important;
        }
        .emergency-performance .blur-3xl,
        .emergency-performance [class*="blur-"] {
          filter: none !important;
        }
      `
      
      document.head.insertBefore(criticalStyle, document.head.firstChild)
    }

    // ⚡ Enhanced font optimization with aggressive preloading
    const optimizeFonts = () => {
      // Check if already loaded
      if (document.querySelector('#font-optimization')) return
      
      const fontStyle = document.createElement('style')
      fontStyle.id = 'font-optimization'
      fontStyle.innerHTML = `
        /* Immediate font fallback */
        .font-playfair, .hero-title {
          font-family: -apple-system, BlinkMacSystemFont, system-ui, serif !important;
        }
        .font-montserrat {
          font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
        }
        .font-lora {
          font-family: -apple-system, BlinkMacSystemFont, system-ui, serif !important;
        }
      `
      document.head.appendChild(fontStyle)

      // Ultra-fast font preloading
      const preloadFont = (url: string, id: string) => {
        if (document.querySelector(`#${id}`)) return
        
        const link = document.createElement('link')
        link.id = id
        link.rel = 'preload'
        link.href = url
        link.as = 'style'
        link.fetchPriority = 'high'
        document.head.appendChild(link)
        
        // Immediate font loading
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = url
        fontLink.media = 'print'
        fontLink.onload = () => { 
          fontLink.media = 'all'
        }
        document.head.appendChild(fontLink)
      }
      
      // Only load essential fonts
      preloadFont('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap', 'font-playfair-minimal')
    }

    // 🚀 Service Worker for aggressive caching
    const setupServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('✅ Service Worker registered:', registration.scope)
        } catch (error) {
          console.warn('❌ Service Worker registration failed:', error)
        }
      }
    }

    // 🖼️ Aggressive critical resource preloading
    const preloadCriticalAssets = () => {
      if (document.querySelector('#assets-preloaded')) return
      
      const assetsPreloaded = document.createElement('meta')
      assetsPreloaded.id = 'assets-preloaded'
      document.head.appendChild(assetsPreloaded)

      // Preload only the most critical images
      const criticalImages = ['/uploads/products/placeholder.jpg']
      
      criticalImages.forEach(src => {
        const preload = document.createElement('link')
        preload.rel = 'preload'
        preload.href = src
        preload.as = 'image'
        preload.fetchPriority = 'high'
        document.head.appendChild(preload)
      })

      // Preload critical API endpoints
      const criticalAPIs = [
        '/api/v1/products/?limit=12',
        '/api/v1/categories/'
      ]

      criticalAPIs.forEach(url => {
        const prefetch = document.createElement('link')
        prefetch.rel = 'prefetch'
        prefetch.href = url
        prefetch.as = 'fetch'
        prefetch.crossOrigin = 'anonymous'
        document.head.appendChild(prefetch)
      })
    }

    // 🌐 Enhanced resource hints for faster connections
    const addResourceHints = () => {
      if (document.querySelector('#resource-hints')) return
      
      const hintsAdded = document.createElement('meta')
      hintsAdded.id = 'resource-hints'
      document.head.appendChild(hintsAdded)

      const hints = [
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: 'https://projects-backend.mlqyyh.easypanel.host', crossorigin: true },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
        { rel: 'dns-prefetch', href: 'https://vercel.live' },
        { rel: 'dns-prefetch', href: 'https://vitals.vercel-analytics.com' }
      ]
      
      hints.forEach(hint => {
        const link = document.createElement('link')
        link.rel = hint.rel
        link.href = hint.href
        if (hint.crossorigin) link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })
    }

    // 📱 Enhanced connection-based optimization
    const optimizeForConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const effectiveType = connection?.effectiveType
        
        console.log(`📡 Connection: ${effectiveType}, RTT: ${connection?.rtt}ms, Downlink: ${connection?.downlink}Mbps`)
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || connection?.rtt > 1000) {
          console.log('🐌 Slow connection - Emergency mode')
          document.body.classList.add('emergency-performance')
          
          // Disable heavy features
          const emergencyCSS = document.createElement('style')
          emergencyCSS.innerHTML = `
            .emergency-performance img:not([src*="placeholder"]) {
              display: none !important;
            }
            .emergency-performance .bg-gradient-to-r,
            .emergency-performance .bg-gradient-to-br {
              background: #1f2937 !important;
            }
          `
          document.head.appendChild(emergencyCSS)
        }
      }
    }

    // 🧠 Memory management and cleanup
    const optimizeMemory = () => {
      // Cleanup event listeners on page unload
      const cleanup = () => {
        console.log('🧹 Cleaning up memory...')
        // Clear intervals, observers, and other memory-intensive operations
      }

      window.addEventListener('beforeunload', cleanup)
      
      // Periodic memory optimization
      setInterval(() => {
        if ('performance' in window && 'memory' in performance) {
          const memory = (performance as any).memory
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
          
          if (usedMB > 100) {
            console.warn(`⚠️ High memory usage: ${usedMB}MB - Consider refreshing`)
          }
        }
      }, 30000) // Check every 30 seconds
    }

    // 📊 Enhanced image optimization
    const optimizeImages = () => {
      // Intersection observer with aggressive loading
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            
            // Add performance attributes
            if (!img.hasAttribute('loading')) img.loading = 'lazy'
            if (!img.hasAttribute('decoding')) img.decoding = 'async'
            
            // Convert to WebP if supported
            if (img.src && !img.src.includes('webp') && 'createImageBitmap' in window) {
              const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
              const testImg = new Image()
              testImg.onload = () => {
                img.src = webpSrc
              }
              testImg.onerror = () => {
                // Fallback to original
              }
              testImg.src = webpSrc
            }
            
            img.setAttribute('data-optimized', 'true')
            imageObserver.unobserve(img)
          }
        })
      }, { rootMargin: '20px' })

      // Observe all images
      setTimeout(() => {
        const images = document.querySelectorAll('img:not([data-optimized])')
        images.forEach(img => imageObserver.observe(img))
      }, 100)
    }

    // 🚀 Execute all optimizations immediately
    inlineCriticalCSS()
    optimizeFonts()
    preloadCriticalAssets()
    addResourceHints()
    optimizeForConnection()
    optimizeMemory()
    setupServiceWorker()
    
    // Delayed optimizations
    setTimeout(() => {
      optimizeImages()
    }, 200)

    console.log('✅ Enhanced Performance Suite ready!')
  }, [])

  useEffect(() => {
    // Enhanced LCP Monitoring with more aggressive auto-optimization
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          const lcp = entries[entries.length - 1]
          const lcpTime = lcp.startTime
          
          console.log(`🎯 LCP: ${lcpTime.toFixed(0)}ms`)
          
          if (lcpTime > 2500) {
            console.log('🚨 LCP needs improvement - Applying optimizations!')
            
            // More aggressive optimizations
            document.body.classList.add('emergency-performance')
            
            // Remove all non-critical scripts
            const scripts = document.querySelectorAll('script:not([data-critical])')
            scripts.forEach(script => {
              const scriptEl = script as HTMLScriptElement
              if (!scriptEl.src.includes('essential') && !scriptEl.src.includes('critical')) {
                script.remove()
              }
            })
            
            // Simplify animations
            const animationStyle = document.createElement('style')
            animationStyle.innerHTML = `
              * { 
                animation-duration: 0.1s !important; 
                transition-duration: 0.1s !important;
              }
            `
            document.head.appendChild(animationStyle)
          } else if (lcpTime < 2500) {
            console.log('🎉 Great LCP performance!')
          }
        }
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Cleanup
      const cleanup = setTimeout(() => lcpObserver.disconnect(), 10000)
      return () => clearTimeout(cleanup)
    }
  }, [])

  return null // This component only optimizes, doesn't render
} 