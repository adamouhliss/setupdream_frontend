import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CloudArrowDownIcon,
  DocumentTextIcon,
  EyeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShoppingBagIcon,
  ShareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

interface FeedStats {
  total_active_products: number
  products_with_images: number
  image_coverage_percentage: number
  in_stock: number
  out_of_stock: number
  products_on_sale: number
  category_breakdown: Array<{
    category: string
    count: number
  }>
}

export default function AdminXMLFeeds() {
  const [stats, setStats] = useState<FeedStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState<string | null>(null)
  const [selectedFeedType, setSelectedFeedType] = useState<'general' | 'google' | 'facebook'>('general')
  const { token } = useAuthStore()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/xml-feed/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching feed stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadFeed = async (feedType: string, includeInactive: boolean = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        feed_type: feedType,
        include_inactive: includeInactive.toString()
      })

      const response = await fetch(`${API_BASE_URL}/products/xml-feed/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        const filename = {
          general: 'product_feed.xml',
          google: 'google_shopping_feed.xml',
          facebook: 'facebook_catalog_feed.xml'
        }[feedType] || 'product_feed.xml'
        
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewFeed = async (feedType: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/xml-feed/preview/?feed_type=${feedType}&limit=3`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewData(data.xml_preview)
        setSelectedFeedType(feedType as any)
      }
    } catch (error) {
      console.error('Error previewing feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const feedTypes = [
    {
      type: 'general',
      name: 'General Product Feed',
      description: 'Basic XML feed with all required product attributes',
      icon: DocumentTextIcon,
      color: 'blue',
      useCases: ['Generic platforms', 'Custom integrations', 'API consumers']
    },
    {
      type: 'google',
      name: 'Google Shopping Feed',
      description: 'Optimized for Google Merchant Center and Google Shopping',
      icon: GlobeAltIcon,
      color: 'green',
      useCases: ['Google Merchant Center', 'Google Shopping ads', 'Google Product Listings']
    },
    {
      type: 'facebook',
      name: 'Facebook Catalog Feed',
      description: 'Formatted for Facebook Shop and dynamic ads',
      icon: ShareIcon,
      color: 'purple',
      useCases: ['Facebook Shop', 'Instagram Shopping', 'Dynamic Product Ads']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-playfair text-gray-100">
                XML Product Feeds
              </h1>
              <p className="text-gray-400 font-lora">
                Generate and manage XML product feeds for various platforms
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feed Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBagIcon className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300 font-medium">Total Products</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">{stats.total_active_products}</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                <span className="text-gray-300 font-medium">In Stock</span>
              </div>
              <p className="text-3xl font-bold text-green-400">{stats.in_stock}</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                <span className="text-gray-300 font-medium">Out of Stock</span>
              </div>
              <p className="text-3xl font-bold text-red-400">{stats.out_of_stock}</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <ChartBarIcon className="w-6 h-6 text-purple-400" />
                <span className="text-gray-300 font-medium">Image Coverage</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{stats.image_coverage_percentage}%</p>
            </div>
          </motion.div>
        )}

        {/* Feed Types */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {feedTypes.map((feed, index) => {
            const Icon = feed.icon
            const colorClassMap = {
              blue: 'from-blue-500 to-blue-600 text-blue-400 border-blue-600/30 bg-blue-900/20',
              green: 'from-green-500 to-green-600 text-green-400 border-green-600/30 bg-green-900/20',
              purple: 'from-purple-500 to-purple-600 text-purple-400 border-purple-600/30 bg-purple-900/20'
            } as const
            
            const colorClasses = colorClassMap[feed.color as keyof typeof colorClassMap] || colorClassMap.blue

            return (
              <motion.div
                key={feed.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 font-playfair">{feed.name}</h3>
                </div>

                <p className="text-gray-300 font-lora mb-4">{feed.description}</p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Use Cases:</h4>
                  <ul className="space-y-1">
                    {feed.useCases.map((useCase, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreviewFeed(feed.type)}
                    disabled={loading}
                    className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadFeed(feed.type)}
                    disabled={loading}
                    className={`flex-1 bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                  >
                    <CloudArrowDownIcon className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Category Breakdown */}
        {stats?.category_breakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-100 font-playfair mb-4">Products by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stats.category_breakdown.map((cat, index) => (
                <div key={cat.category} className="bg-gray-700/30 rounded-xl p-4">
                  <p className="text-sm text-gray-400 font-medium">{cat.category}</p>
                  <p className="text-2xl font-bold text-gray-100">{cat.count}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preview Modal */}
        {previewData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewData(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-100 font-playfair">
                    XML Feed Preview - {selectedFeedType.charAt(0).toUpperCase() + selectedFeedType.slice(1)}
                  </h3>
                  <button
                    onClick={() => setPreviewData(null)}
                    className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <pre className="text-sm text-gray-300 font-mono bg-gray-900 p-4 rounded-xl overflow-x-auto">
                  {previewData}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-yellow-300 font-playfair mb-3">📋 How to Use XML Feeds</h3>
          <div className="space-y-2 text-yellow-200">
            <p><strong>General Feed:</strong> Use for custom integrations or third-party platforms</p>
            <p><strong>Google Feed:</strong> Upload to Google Merchant Center for Google Shopping</p>
            <p><strong>Facebook Feed:</strong> Use in Facebook Business Manager for product catalog</p>
          </div>
          <div className="mt-4 p-4 bg-yellow-900/30 rounded-xl">
            <p className="text-sm text-yellow-200">
              💡 <strong>Tip:</strong> Feeds are generated with all active products. Make sure your product images and descriptions are up to date before downloading.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
} 