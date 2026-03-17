import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  SignalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BoltIcon,
  EyeIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

interface PerformanceMetric {
  name: string
  value: number
  status: 'good' | 'needs-improvement' | 'poor'
  unit: string
  description: string
  threshold: { good: number, poor: number }
}

export default function AdminPerformanceTest() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    runInitialTests()
  }, [])

  const runInitialTests = async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await runPerformanceTests()
      setMetrics(results)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to run performance tests')
    } finally {
      setLoading(false)
    }
  }

  const runPerformanceTests = (): Promise<PerformanceMetric[]> => {
    return new Promise((resolve) => {
      const results: PerformanceMetric[] = []

      // Get navigation timing data
      const performanceEntries = performance.getEntriesByType('navigation')
      if (performanceEntries.length > 0) {
        const navigation = performanceEntries[0] as PerformanceNavigationTiming
        
        // DOM Content Loaded
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
        results.push({
          name: 'DOM Content Loaded',
          value: domContentLoaded,
          status: domContentLoaded <= 1500 ? 'good' : domContentLoaded <= 2500 ? 'needs-improvement' : 'poor',
          unit: 'ms',
          description: 'Time until DOM is fully loaded and parsed',
          threshold: { good: 1500, poor: 2500 }
        })

        // Page Load Time
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        results.push({
          name: 'Page Load Time',
          value: pageLoadTime,
          status: pageLoadTime <= 3000 ? 'good' : pageLoadTime <= 5000 ? 'needs-improvement' : 'poor',
          unit: 'ms',
          description: 'Time until page is completely loaded',
          threshold: { good: 3000, poor: 5000 }
        })

        // DNS Lookup Time
        const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart
        results.push({
          name: 'DNS Lookup Time',
          value: dnsTime,
          status: dnsTime <= 100 ? 'good' : dnsTime <= 300 ? 'needs-improvement' : 'poor',
          unit: 'ms',
          description: 'Time to resolve domain name',
          threshold: { good: 100, poor: 300 }
        })

        // Server Response Time (TTFB)
        const ttfb = navigation.responseStart - navigation.fetchStart
        results.push({
          name: 'Time to First Byte (TTFB)',
          value: ttfb,
          status: ttfb <= 600 ? 'good' : ttfb <= 1000 ? 'needs-improvement' : 'poor',
          unit: 'ms',
          description: 'Time until first byte received from server',
          threshold: { good: 600, poor: 1000 }
        })

        // Connection Time
        const connectionTime = navigation.connectEnd - navigation.connectStart
        results.push({
          name: 'Connection Time',
          value: connectionTime,
          status: connectionTime <= 100 ? 'good' : connectionTime <= 300 ? 'needs-improvement' : 'poor',
          unit: 'ms',
          description: 'Time to establish connection to server',
          threshold: { good: 100, poor: 300 }
        })
      }

      // Core Web Vitals - LCP
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry) {
            results.push({
              name: 'Largest Contentful Paint (LCP)',
              value: lastEntry.startTime,
              status: lastEntry.startTime <= 2500 ? 'good' : lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor',
              unit: 'ms',
              description: 'Time until the largest content element is rendered',
              threshold: { good: 2500, poor: 4000 }
            })
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        setTimeout(() => {
          lcpObserver.disconnect()
          resolve(results)
        }, 3000)
      } else {
        resolve(results)
      }
    })
  }

  const runNetworkTest = async () => {
    setLoading(true)
    setError(null)
    try {
      const startTime = performance.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      await fetch('/api/v1/products/?limit=1', {
        method: 'HEAD',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const endTime = performance.now()
      const networkLatency = endTime - startTime

      const networkMetric: PerformanceMetric = {
        name: 'API Response Time',
        value: networkLatency,
        status: networkLatency <= 200 ? 'good' : networkLatency <= 500 ? 'needs-improvement' : 'poor',
        unit: 'ms',
        description: 'Time to receive API response',
        threshold: { good: 200, poor: 500 }
      }

      setMetrics(prev => {
        const filtered = prev.filter(m => m.name !== 'API Response Time')
        return [...filtered, networkMetric]
      })
      setLastUpdated(new Date())
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Network test timed out - server may be slow')
      } else {
        setError('Network test failed - check API connection')
      }
    } finally {
      setLoading(false)
    }
  }

  const runMemoryTest = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryMetrics: PerformanceMetric[] = [
        {
          name: 'Used JS Heap Size',
          value: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          status: memory.usedJSHeapSize < 50 * 1024 * 1024 ? 'good' : memory.usedJSHeapSize < 100 * 1024 * 1024 ? 'needs-improvement' : 'poor',
          unit: 'MB',
          description: 'Amount of JavaScript memory currently in use',
          threshold: { good: 50, poor: 100 }
        },
        {
          name: 'Total JS Heap Size',
          value: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          status: memory.totalJSHeapSize < 100 * 1024 * 1024 ? 'good' : memory.totalJSHeapSize < 200 * 1024 * 1024 ? 'needs-improvement' : 'poor',
          unit: 'MB',
          description: 'Total amount of JavaScript memory allocated',
          threshold: { good: 100, poor: 200 }
        },
        {
          name: 'JS Heap Size Limit',
          value: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
          status: 'good', // This is just informational
          unit: 'MB',
          description: 'Maximum JavaScript memory available',
          threshold: { good: 1000, poor: 2000 }
        }
      ]

      setMetrics(prev => {
        const filtered = prev.filter(m => !m.name.includes('JS Heap'))
        return [...filtered, ...memoryMetrics]
      })
      setLastUpdated(new Date())
    } else {
      setError('Memory performance API not available in this browser')
    }
  }

  const runResourceTimingTest = () => {
    const resources = performance.getEntriesByType('resource')
    const cssResources = resources.filter(r => r.name.includes('.css'))
    const jsResources = resources.filter(r => r.name.includes('.js'))
    const imageResources = resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
    
    const resourceMetrics: PerformanceMetric[] = [
      {
        name: 'CSS Files Loaded',
        value: cssResources.length,
        status: cssResources.length <= 5 ? 'good' : cssResources.length <= 10 ? 'needs-improvement' : 'poor',
        unit: 'files',
        description: 'Number of CSS files loaded',
        threshold: { good: 5, poor: 10 }
      },
      {
        name: 'JS Files Loaded',
        value: jsResources.length,
        status: jsResources.length <= 10 ? 'good' : jsResources.length <= 20 ? 'needs-improvement' : 'poor',
        unit: 'files',
        description: 'Number of JavaScript files loaded',
        threshold: { good: 10, poor: 20 }
      },
      {
        name: 'Images Loaded',
        value: imageResources.length,
        status: imageResources.length <= 20 ? 'good' : imageResources.length <= 50 ? 'needs-improvement' : 'poor',
        unit: 'files',
        description: 'Number of image files loaded',
        threshold: { good: 20, poor: 50 }
      }
    ]

    setMetrics(prev => {
      const filtered = prev.filter(m => !m.name.includes('Files Loaded') && !m.name.includes('Images Loaded'))
      return [...filtered, ...resourceMetrics]
    })
    setLastUpdated(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-900/20 border-green-700/50'
      case 'needs-improvement': return 'bg-yellow-900/20 border-yellow-700/50'
      case 'poor': return 'bg-red-900/20 border-red-700/50'
      default: return 'bg-gray-900/20 border-gray-700/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'needs-improvement': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
      case 'poor': return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />
    }
  }

  const getOverallScore = () => {
    if (metrics.length === 0) return 0
    const scores: number[] = metrics.map(m => {
      switch (m.status) {
        case 'good': return 100
        case 'needs-improvement': return 50
        case 'poor': return 0
        default: return 50
      }
    })
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-playfair text-gray-100">
                  Performance Testing Dashboard
                </h1>
                <p className="text-gray-300 font-lora">
                  Monitor and analyze website performance metrics in real-time
                </p>
              </div>
            </div>
            
            {/* Overall Performance Score */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(getOverallScore())}`}>
                  {getOverallScore()}
                </div>
                <div className="text-sm text-gray-400 mt-1">Performance Score</div>
              </div>
            </div>
          </div>

          {lastUpdated && (
            <p className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-4 font-playfair flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-blue-400" />
            Performance Tests
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={runInitialTests}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 justify-center"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Core Web Vitals
            </button>
            
            <button
              onClick={runNetworkTest}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 justify-center"
            >
              <SignalIcon className="w-4 h-4" />
              Network Speed
            </button>
            
            <button
              onClick={runMemoryTest}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 justify-center"
            >
              <CpuChipIcon className="w-4 h-4" />
              Memory Usage
            </button>

            <button
              onClick={runResourceTimingTest}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 justify-center"
            >
              <ServerIcon className="w-4 h-4" />
              Resource Timing
            </button>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              <p className="text-red-300 font-montserrat">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 border ${getStatusColor(metric.status)} backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <h3 className="font-semibold font-montserrat text-gray-100 text-sm">
                    {metric.name}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-100">
                    {metric.value.toFixed(metric.unit === 'ms' ? 0 : 1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {metric.unit}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 font-lora">
                  {metric.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    metric.status === 'good' ? 'bg-green-900/50 text-green-300' :
                    metric.status === 'needs-improvement' ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-red-900/50 text-red-300'
                  }`}>
                    {metric.status.replace('-', ' ').toUpperCase()}
                  </span>
                  
                  <div className="text-xs text-gray-400">
                    Good: ≤{metric.threshold.good}{metric.unit}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-6 font-playfair flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-green-400" />
            Performance Optimization Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-green-300 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Excellent (90-100)
              </h3>
              <ul className="text-sm text-gray-300 space-y-2 font-lora">
                <li>• LCP: ≤ 2.5s</li>
                <li>• TTFB: ≤ 600ms</li>
                <li>• DOM Load: ≤ 1.5s</li>
                <li>• Memory: ≤ 50MB</li>
                <li>• Connection: ≤ 100ms</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-yellow-300 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4" />
                Needs Improvement (50-89)
              </h3>
              <ul className="text-sm text-gray-300 space-y-2 font-lora">
                <li>• LCP: 2.5s - 4.0s</li>
                <li>• TTFB: 600ms - 1s</li>
                <li>• DOM Load: 1.5s - 2.5s</li>
                <li>• Memory: 50MB - 100MB</li>
                <li>• Connection: 100ms - 300ms</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-red-300 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4" />
                Poor (0-49)
              </h3>
              <ul className="text-sm text-gray-300 space-y-2 font-lora">
                <li>• LCP: &gt; 4.0s</li>
                <li>• TTFB: &gt; 1s</li>
                <li>• DOM Load: &gt; 2.5s</li>
                <li>• Memory: &gt; 100MB</li>
                <li>• Connection: &gt; 300ms</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-xl">
            <h4 className="font-semibold text-blue-300 mb-2">🚀 Optimization Tips:</h4>
            <ul className="text-sm text-gray-300 space-y-1 font-lora">
              <li>• Optimize images (WebP format, lazy loading)</li>
              <li>• Minimize CSS/JS files and enable compression</li>
              <li>• Use CDN for static assets</li>
              <li>• Implement code splitting for large bundles</li>
              <li>• Enable browser caching with proper headers</li>
              <li>• Monitor and fix memory leaks regularly</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 