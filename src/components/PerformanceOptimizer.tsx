import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Optimize FCP by deferring non-critical operations
    const optimizeFCP = () => {
      // Preload critical fonts
      const linkElement = document.createElement('link')
      linkElement.rel = 'preload'
      linkElement.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap'
      linkElement.as = 'style'
      linkElement.onload = () => {
        linkElement.rel = 'stylesheet'
      }
      document.head.appendChild(linkElement)

      // Add critical CSS for faster rendering
      const criticalCSS = document.createElement('style')
      criticalCSS.innerHTML = `
        /* Critical styles for FCP */
        .btn-primary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
          transform: translateY(-1px);
        }
        .text-gradient {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .shadow-gold {
          box-shadow: 0 4px 14px 0 rgb(245 158 11 / 39%);
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
      document.head.appendChild(criticalCSS)

      // Optimize images loading
      const images = document.querySelectorAll('img[data-src]')
      if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
              }
            }
          })
        }, {
          rootMargin: '50px 0px'
        })

        images.forEach((img) => imageObserver.observe(img))
      }

      // Prefetch key routes after FCP
      const prefetchRoutes = ['/products', '/categories', '/about', '/contact']
      prefetchRoutes.forEach((route) => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      })
    }

    // Run optimizations after a short delay to avoid blocking FCP
    const timer = setTimeout(optimizeFCP, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Optimize resource loading based on connection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection?.effectiveType === '4g') {
        // Preload additional resources on fast connections
        const preloadImages = [
          '/images/hero-bg.webp',
          '/images/featured-1.webp',
          '/images/featured-2.webp'
        ]
        
        preloadImages.forEach((src) => {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = src
          link.as = 'image'
          link.type = 'image/webp'
          document.head.appendChild(link)
        })
      }
    }

    // Add performance observer for monitoring
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'paint') {
              console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`)
            }
          })
        })
        observer.observe({ entryTypes: ['paint'] })

        // Clean up observer after 10 seconds
        setTimeout(() => observer.disconnect(), 10000)
      } catch (error) {
        console.warn('Performance Observer not supported')
      }
    }
  }, [])

  return null // This component doesn't render anything
} 