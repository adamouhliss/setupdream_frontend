import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
  domContentLoaded?: number
}

export default function PerformanceTracker() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})

  useEffect(() => {
    const trackPerformance = () => {
      // Track Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          })
          setMetrics(prev => ({ ...prev, cls }))
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      }

      // Track navigation timing
      const perfEntries = performance.getEntriesByType('navigation')
      if (perfEntries.length > 0) {
        const navigation = perfEntries[0] as PerformanceNavigationTiming
        
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
        }))
      }
    }

    // Track after page load
    if (document.readyState === 'complete') {
      trackPerformance()
    } else {
      window.addEventListener('load', trackPerformance)
      return () => window.removeEventListener('load', trackPerformance)
    }
  }, [])

  // Only show in development or when user presses Ctrl+Shift+P
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setShowMetrics(!showMetrics)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showMetrics])

  if (!showMetrics) return null

  const getScoreColor = (value: number, thresholds: { good: number, poor: number }) => {
    if (value <= thresholds.good) return 'text-green-400'
    if (value <= thresholds.poor) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 text-sm border border-gray-700">
      <div className="font-bold mb-2">🎯 Performance Metrics</div>
      <div className="space-y-1">
        {metrics.lcp && (
          <div>
            LCP: <span className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>
              {metrics.lcp.toFixed(0)}ms
            </span>
          </div>
        )}
        {metrics.fid && (
          <div>
            FID: <span className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}>
              {metrics.fid.toFixed(0)}ms
            </span>
          </div>
        )}
        {metrics.cls && (
          <div>
            CLS: <span className={getScoreColor(metrics.cls * 1000, { good: 100, poor: 250 })}>
              {metrics.cls.toFixed(3)}
            </span>
          </div>
        )}
        {metrics.ttfb && (
          <div>
            TTFB: <span className={getScoreColor(metrics.ttfb, { good: 600, poor: 1000 })}>
              {metrics.ttfb.toFixed(0)}ms
            </span>
          </div>
        )}
        {metrics.domContentLoaded && (
          <div>
            DCL: <span className={getScoreColor(metrics.domContentLoaded, { good: 1500, poor: 2500 })}>
              {metrics.domContentLoaded.toFixed(0)}ms
            </span>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-2">Press Ctrl+Shift+P to toggle</div>
    </div>
  )
} 