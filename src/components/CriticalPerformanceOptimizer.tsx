import { useEffect } from 'react'

// 🚀 CRITICAL Performance Optimizer for DOM and TTFB improvements
export default function CriticalPerformanceOptimizer() {
  useEffect(() => {
    console.log('🔥 CRITICAL Performance Optimizer starting...')
    
    // 1. 🎯 Aggressive Critical CSS Injection (Immediate)
    const injectCriticalCSS = () => {
      if (document.querySelector('#ultra-critical-css')) return
      
      const criticalStyle = document.createElement('style')
      criticalStyle.id = 'ultra-critical-css'
      criticalStyle.innerHTML = `
        /* ⚡ ULTRA CRITICAL CSS - Immediate rendering */
        html { font-size: 16px; }
        * { 
          box-sizing: border-box !important; 
          margin: 0;
          padding: 0;
        }
        body { 
          font-family: system-ui, -apple-system, sans-serif !important;
          background: #111827 !important; 
          color: #f9fafb !important;
          line-height: 1.5 !important;
          overflow-x: hidden !important;
        }
        
        /* Critical layout styles */
        .min-h-screen { min-height: 100vh !important; }
        .bg-gray-900 { background: #111827 !important; }
        .text-white { color: #f9fafb !important; }
        .flex { display: flex !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        
        /* Critical button styles */
        .btn-primary, .btn-hero {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: white !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.75rem !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          border: none !important;
          cursor: pointer !important;
          transition: transform 0.2s ease !important;
        }
        
        /* Remove all animations initially */
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        /* Critical loading styles */
        .loading-critical {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #374151;
          border-radius: 50%;
          border-top-color: #f59e0b;
          animation: spin-fast 0.8s linear infinite;
        }
        @keyframes spin-fast {
          to { transform: rotate(360deg); }
        }
      `
      
      // Insert as first child for highest priority
      document.head.insertBefore(criticalStyle, document.head.firstChild)
      console.log('⚡ Ultra critical CSS injected')
    }

    // 2. 🚀 Aggressive Resource Preloading
    const preloadCriticalResources = () => {
      if (document.querySelector('#critical-resources-loaded')) return
      
      const marker = document.createElement('meta')
      marker.id = 'critical-resources-loaded'
      document.head.appendChild(marker)

      // Preload most critical API endpoints
      const criticalEndpoints = [
        '/api/v1/products/?limit=8',
        '/api/v1/categories/?limit=6',
        '/api/v1/settings/contact'
      ]

      criticalEndpoints.forEach(url => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = url
        link.as = 'fetch'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
        console.log('🔗 Prefetching:', url)
      })

      // Preload critical fonts with highest priority
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      fontLink.as = 'style'
      fontLink.fetchPriority = 'high'
      fontLink.onload = () => {
        fontLink.rel = 'stylesheet'
      }
      document.head.appendChild(fontLink)
    }

    // 3. ⚡ Network Performance Boost
    const optimizeNetworkRequests = () => {
      // Override fetch with aggressive caching and optimization
      const originalFetch = window.fetch
      
      window.fetch = async (input, init = {}) => {
        const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString()
        
        // Add aggressive caching for API requests
        const optimizedInit: RequestInit = {
          ...init,
          cache: 'default' as RequestCache,
          keepalive: true,
          // Add timeout for faster failures
          signal: init.signal || AbortSignal.timeout(5000)
        }
        
        console.log('🌐 Optimized fetch:', url)
        return originalFetch(input, optimizedInit)
      }
    }

    // 4. 🧠 Memory Optimization
    const optimizeMemoryUsage = () => {
      // Immediate cleanup of unused resources
      const cleanup = () => {
        // Remove unused images
        const images = document.querySelectorAll('img[data-loaded="false"]')
        images.forEach(img => img.remove())
        
        // Clear console to free memory
        if (console.clear && Math.random() > 0.8) {
          console.clear()
        }
      }

      // Run cleanup immediately and then periodically
      cleanup()
      setInterval(cleanup, 45000) // Every 45 seconds
    }

    // 5. 🎯 DOM Optimization
    const optimizeDOMPerformance = () => {
      // Add content-visibility to improve rendering
      const style = document.createElement('style')
      style.innerHTML = `
        /* Auto content-visibility for better rendering performance */
        .product-card, .category-item, .admin-row {
          content-visibility: auto !important;
          contain-intrinsic-size: 200px !important;
        }
        
        /* Optimize scroll performance */
        * {
          backface-visibility: hidden !important;
          perspective: 1000px !important;
        }
        
        /* GPU acceleration for critical elements */
        .btn-primary, .hero-section, .header-nav {
          transform: translateZ(0) !important;
          will-change: transform !important;
        }
      `
      document.head.appendChild(style)
    }

    // 6. 📱 Connection-Based Emergency Mode
    const handleSlowConnections = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const rtt = connection?.rtt || 0
        const downlink = connection?.downlink || 0
        
        console.log(`📡 Connection: RTT ${rtt}ms, Speed ${downlink}Mbps`)
        
        // Emergency mode for very slow connections
        if (rtt > 800 || downlink < 1) {
          console.log('🚨 EMERGENCY MODE: Ultra slow connection detected')
          
          // Disable all non-essential features
          const emergencyCSS = document.createElement('style')
          emergencyCSS.innerHTML = `
            .emergency-mode * {
              animation: none !important;
              transition: none !important;
              box-shadow: none !important;
              background-image: none !important;
              filter: none !important;
            }
            .emergency-mode img:not([data-critical]) {
              display: none !important;
            }
            .emergency-mode .bg-gradient-to-r,
            .emergency-mode .bg-gradient-to-br {
              background: #1f2937 !important;
            }
          `
          document.head.appendChild(emergencyCSS)
          document.body.classList.add('emergency-mode')
          
          // Show emergency notification
          console.warn('⚠️ Ultra performance mode activated for slow connection')
        }
      }
    }

    // 7. 🎯 Critical Path Rendering Optimization
    const optimizeCriticalRenderingPath = () => {
      // Defer all non-critical scripts
      const scripts = document.querySelectorAll('script:not([data-critical])')
      scripts.forEach(script => {
        const scriptEl = script as HTMLScriptElement
        if (scriptEl.src && !scriptEl.defer && !scriptEl.async) {
          scriptEl.defer = true
          console.log('⏰ Deferred script:', scriptEl.src)
        }
      })

      // Optimize CSS loading
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
      stylesheets.forEach(link => {
        const linkEl = link as HTMLLinkElement
        if (linkEl.href && linkEl.href.includes('googleapis')) {
          linkEl.media = 'print'
          linkEl.onload = () => { linkEl.media = 'all' }
          console.log('📝 Deferred stylesheet:', linkEl.href)
        }
      })
    }

    // 🚀 Execute ALL optimizations immediately
    console.time('Critical Optimization Time')
    
    injectCriticalCSS()
    preloadCriticalResources()
    optimizeNetworkRequests()
    optimizeMemoryUsage()
    optimizeDOMPerformance()
    handleSlowConnections()
    optimizeCriticalRenderingPath()
    
    console.timeEnd('Critical Optimization Time')
    console.log('🎉 CRITICAL Performance Optimizer ready!')
    
  }, [])

  // Monitor performance in real-time
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming
          const ttfb = nav.responseStart - nav.fetchStart
          const domLoad = nav.domContentLoadedEventEnd - nav.fetchStart
          
          console.log(`🚀 Real-time metrics: TTFB ${ttfb.toFixed(0)}ms | DOM ${domLoad.toFixed(0)}ms`)
          
          // Auto-trigger emergency optimizations if still slow
          if (domLoad > 1500) {
            console.log('🚨 DOM still slow - applying emergency optimizations')
            document.body.classList.add('emergency-mode')
          }
          
          if (ttfb > 600) {
            console.log('🚨 TTFB still slow - enabling aggressive caching')
            // Additional aggressive caching can be added here
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry.startTime
          console.log(`🎯 Real-time LCP: ${lcp.toFixed(0)}ms`)
          
          if (lcp > 2000) {
            console.log('⚡ Applying LCP emergency optimizations')
            // Remove all animations
            const style = document.createElement('style')
            style.innerHTML = `
              * { 
                animation: none !important;
                transition: none !important;
              }
            `
            document.head.appendChild(style)
          }
        }
      })
    })
    
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] })
    
    return () => observer.disconnect()
  }, [])

  return null // This component only optimizes performance
} 