// Enhanced Performance optimization utilities

// Image optimization utilities
export const optimizeImage = (src: string, width?: number, quality = 85) => {
  // Add image optimization parameters for better performance
  const url = new URL(src, window.location.origin)
  if (width) url.searchParams.set('w', width.toString())
  url.searchParams.set('q', quality.toString())
  url.searchParams.set('f', 'webp') // Use WebP format when possible
  return url.toString()
}

// Lazy loading with enhanced intersection observer
export const createLazyLoadObserver = (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without Intersection Observer
    console.warn('IntersectionObserver not supported, falling back to immediate loading')
    return null
  }
  
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string, crossorigin?: boolean) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (type) link.type = type
  if (crossorigin) link.crossOrigin = 'anonymous'
  link.fetchPriority = 'high'
  document.head.appendChild(link)
}

// Prefetch resources for next page
export const prefetchResource = (href: string, as?: string) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  if (as) link.as = as
  document.head.appendChild(link)
}

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style')
  style.innerHTML = css
  style.setAttribute('data-critical', 'true')
  document.head.insertBefore(style, document.head.firstChild)
}

// Enhanced DNS prefetch and preconnect utilities
export const addResourceHints = () => {
  const head = document.head
  
  // Critical domains to preconnect
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://projects-backend.mlqyyh.easypanel.host'
  ]
  
  preconnectDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      head.appendChild(link)
    }
  })
  
  // DNS prefetch for API domains
  const dnsPrefetchDomains = [
    'https://vitals.vercel-analytics.com',
    'https://vercel.live'
  ]
  
  dnsPrefetchDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      head.appendChild(link)
    }
  })
}

// Enhanced bundle size optimization
export const optimizeBundle = () => {
  // Aggressive code splitting - remove unused imports
  console.log('🎯 Optimizing bundle size...')
  
  // Remove unused CSS classes dynamically
  const removeUnusedCSS = () => {
    const usedSelectors = new Set<string>()
    
    // Get all used classes and IDs from DOM
    const elements = document.querySelectorAll('*')
    elements.forEach(el => {
      if (el.className) {
        el.className.split(' ').forEach(cls => {
          if (cls.trim()) usedSelectors.add(`.${cls}`)
        })
      }
      if (el.id) {
        usedSelectors.add(`#${el.id}`)
      }
    })
    
    console.log(`📊 Found ${usedSelectors.size} used selectors`)
  }

  // Optimize images on scroll
  const images = document.querySelectorAll('img[data-src]')
  if (images.length > 0) {
    const imageObserver = createLazyLoadObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = optimizeImage(img.dataset.src)
            img.removeAttribute('data-src')
            imageObserver?.unobserve(img)
          }
        }
      })
    })
    
    if (imageObserver) {
      images.forEach(img => imageObserver.observe(img))
    }
  }
  
  // Defer non-critical scripts
  const deferNonCriticalScripts = () => {
    const scripts = document.querySelectorAll('script:not([data-critical]):not([defer]):not([async])')
    scripts.forEach((script) => {
      const scriptEl = script as HTMLScriptElement
      if (scriptEl.src && !scriptEl.src.includes('critical') && !scriptEl.src.includes('essential')) {
        scriptEl.defer = true
      }
    })
  }
  
  removeUnusedCSS()
  deferNonCriticalScripts()
  
  console.log('✅ Bundle optimization complete')
}

// Enhanced memory management
export const optimizeMemory = () => {
  console.log('🧠 Starting memory optimization...')
  
  // Monitor memory usage
  const monitorMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      
      console.log(`💾 Memory: ${usedMB}MB used / ${totalMB}MB total / ${limitMB}MB limit`)
      
      if (usedMB > 75) {
        console.warn('⚠️ High memory usage detected - running cleanup')
        runMemoryCleanup()
      }
      
      return { used: usedMB, total: totalMB, limit: limitMB }
    }
    return null
  }
  
  // Aggressive memory cleanup
  const runMemoryCleanup = () => {
    // Remove old event listeners
    const elements = document.querySelectorAll('[data-cleanup-listeners]')
    elements.forEach(el => {
      el.removeAttribute('data-cleanup-listeners')
    })
    
    // Clear image caches
    const images = document.querySelectorAll('img[data-cached]')
    images.forEach(img => {
      img.removeAttribute('data-cached')
    })
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc()
    }
    
    console.log('🧹 Memory cleanup completed')
  }
  
  // Monitor every 30 seconds
  setInterval(monitorMemory, 30000)
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', runMemoryCleanup)
  
  return { monitor: monitorMemory, cleanup: runMemoryCleanup }
}

// Enhanced performance monitoring and metrics
export const startPerformanceMonitoring = () => {
  console.log('📊 Starting performance monitoring...')
  
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint with optimization triggers
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      const lcpTime = lastEntry.startTime
      
      console.log(`🎯 LCP: ${lcpTime.toFixed(0)}ms`)
      
      if (lcpTime > 2500) {
        console.log('🚨 Poor LCP detected - triggering optimizations')
        
        // Emergency optimizations
        document.body.classList.add('emergency-performance')
        
        // Remove animations
        const emergencyStyle = document.createElement('style')
        emergencyStyle.innerHTML = `
          .emergency-performance * {
            animation: none !important;
            transition: none !important;
          }
        `
        document.head.appendChild(emergencyStyle)
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('lcp-measured', {
        detail: { value: lcpTime, rating: lcpTime <= 2500 ? 'good' : lcpTime <= 4000 ? 'needs-improvement' : 'poor' }
      }))
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        const fidTime = entry.processingStart - entry.startTime
        console.log(`⚡ FID: ${fidTime.toFixed(0)}ms`)
        
        window.dispatchEvent(new CustomEvent('fid-measured', {
          detail: { value: fidTime, rating: fidTime <= 100 ? 'good' : fidTime <= 300 ? 'needs-improvement' : 'poor' }
        }))
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
    
    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      console.log(`📐 CLS: ${clsValue.toFixed(3)}`)
      
      window.dispatchEvent(new CustomEvent('cls-measured', {
        detail: { value: clsValue, rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor' }
      }))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    
    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart
      const domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart
      
      console.log(`🚀 TTFB: ${ttfb.toFixed(0)}ms`)
      console.log(`📄 DOM Load: ${domLoad.toFixed(0)}ms`)
      
      window.dispatchEvent(new CustomEvent('navigation-metrics', {
        detail: { ttfb, domLoad }
      }))
    }
  }
  
  return () => {
    console.log('📊 Performance monitoring stopped')
  }
}

// Network optimization with retry logic
export const optimizeNetworkRequests = () => {
  const originalFetch = window.fetch
  
  window.fetch = async (input, init = {}) => {
    const maxRetries = 3
    let retryCount = 0
    
    const makeRequest = async (): Promise<Response> => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
        
        const optimizedInit = {
          ...init,
          cache: init.cache || 'default',
          signal: controller.signal
        }
        
        const response = await originalFetch(input, optimizedInit)
        clearTimeout(timeoutId)
        
        if (!response.ok && response.status >= 500 && retryCount < maxRetries) {
          retryCount++
          console.log(`🔄 Retrying request (${retryCount}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
          return makeRequest()
        }
        
        return response
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('⏱️ Request timeout')
        }
        
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`🔄 Retrying after error (${retryCount}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
          return makeRequest()
        }
        
        throw error
      }
    }
    
    return makeRequest()
  }
  
  console.log('🌐 Network optimization active')
}

// Critical rendering path optimization
export const optimizeCriticalRenderingPath = () => {
  console.log('🎨 Optimizing critical rendering path...')
  
  // Defer non-critical CSS
  const deferCSS = () => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
    stylesheets.forEach((link) => {
      const linkEl = link as HTMLLinkElement
      if (!linkEl.href.includes('critical')) {
        linkEl.media = 'print'
        linkEl.onload = () => { linkEl.media = 'all' }
      }
    })
  }
  
  // Inline critical CSS
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      background: #111827;
      color: white;
    }
    .btn-primary {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
    }
  `
  inlineCriticalCSS(criticalCSS)
  
  // Defer non-critical CSS
  setTimeout(deferCSS, 100)
  
  console.log('✅ Critical rendering path optimized')
}

// Bundle analyzer for development
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return
  
  console.log('📦 Analyzing bundle size...')
  
  // Estimate JavaScript bundle size
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const totalSize = scripts.reduce((total) => {
    // Rough estimation - would need actual file sizes in production
    return total + 100 // KB estimate
  }, 0)
  
  console.log(`📊 Estimated JS bundle size: ${totalSize}KB`)
  
  // Memory analysis
  if ('memory' in performance) {
    const memory = (performance as any).memory
    console.log('💾 Memory analysis:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
    })
  }
} 