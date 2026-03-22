import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  CloudArrowDownIcon,
  ShoppingBagIcon,
  ShareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct, DatabaseCategory } from '../../services/productApi'
import {
  generateSitemap,
  generateRobotsTxt,
  downloadSitemap,
  downloadRobotsTxt,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateSitemapXml,
  SitemapUrl
} from '../../utils/seoUtils'
import { getProductUrl } from '../../utils/productUrls'
import { useAuthStore } from '../../store/authStore'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'  // Production

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

export default function SEOManager() {
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [categories, setCategories] = useState<DatabaseCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [sitemapContent, setSitemapContent] = useState<string>('')
  const [robotsContent, setRobotsContent] = useState<string>('')
  const [structuredDataPreview, setStructuredDataPreview] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'sitemap' | 'robots' | 'structured' | 'feeds' | 'analytics'>('sitemap')
  const [feedStats, setFeedStats] = useState<FeedStats | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeTab === 'feeds') {
      fetchFeedStats()
    }
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsResponse, categoriesData] = await Promise.all([
        productAPI.getProducts({ limit: 1000 }),
        productAPI.getCategories()
      ])
      setProducts(productsResponse.items)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to fetch SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/xml-feed/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeedStats(data)
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

  const handleGenerateSitemap = async () => {
    try {
      setLoading(true)
      const sitemap = await generateSitemap(products, categories)
      setSitemapContent(sitemap)
    } catch (error) {
      console.error('Failed to generate sitemap:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePublicSitemap = async () => {
    try {
      setLoading(true)
      // Generate sitemap with actual domain instead of localhost
      const actualBaseUrl = 'https://setupdream.ma'
      const currentDate = new Date().toISOString().split('T')[0]

      const urls: SitemapUrl[] = [
        // Static pages
        { loc: `${actualBaseUrl}/`, lastmod: currentDate, changefreq: 'daily', priority: 1.0 },
        { loc: `${actualBaseUrl}/products`, lastmod: currentDate, changefreq: 'daily', priority: 0.9 },
        { loc: `${actualBaseUrl}/new-arrivals`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
        { loc: `${actualBaseUrl}/sale`, lastmod: currentDate, changefreq: 'daily', priority: 0.8 },
        { loc: `${actualBaseUrl}/about`, lastmod: currentDate, changefreq: 'monthly', priority: 0.6 },
        { loc: `${actualBaseUrl}/contact`, lastmod: currentDate, changefreq: 'monthly', priority: 0.6 },
        { loc: `${actualBaseUrl}/privacy`, lastmod: currentDate, changefreq: 'yearly', priority: 0.3 },
        { loc: `${actualBaseUrl}/terms`, lastmod: currentDate, changefreq: 'yearly', priority: 0.3 }
      ]

      // Add category pages
      categories.forEach(category => {
        urls.push({
          loc: `${actualBaseUrl}/products?category=${category.id}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.7
        })

        // Add subcategory pages if they exist
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            urls.push({
              loc: `${actualBaseUrl}/products?category=${category.id}&subcategory=${subcategory.id}`,
              lastmod: currentDate,
              changefreq: 'weekly',
              priority: 0.6
            })
          })
        }
      })

      // Add product pages
      products.forEach(product => {
        urls.push({
          loc: `${actualBaseUrl}${getProductUrl(product)}`,
          lastmod: product.created_at.split('T')[0],
          changefreq: 'weekly',
          priority: product.is_featured ? 0.8 : 0.7
        })
      })

      // Generate complete sitemap XML
      const completeSitemap = generateSitemapXml(urls)
      setSitemapContent(completeSitemap)

      // Upload to server
      const response = await fetch(`${API_BASE_URL}/seo/sitemap.xml`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/xml'
        },
        body: completeSitemap
      })

      if (!response.ok) {
        throw new Error('Failed to upload sitemap to server')
      }

      alert('Sitemap successfully generated and uploaded directly to the server! It is now live.')
    } catch (error) {
      console.error('Failed to generate public sitemap:', error)
      alert('Failed to upload sitemap to the server.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRobots = () => {
    const robots = generateRobotsTxt()
    setRobotsContent(robots)
  }

  const handleGenerateStructuredData = () => {
    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [
        generateOrganizationSchema(),
        generateWebSiteSchema(),
        generateLocalBusinessSchema()
      ]
    }
    setStructuredDataPreview(combinedSchema)
  }

  const seoStats = {
    totalPages: products.length + categories.length + 8, // products + categories + static pages
    indexablePages: products.filter(p => p.is_active).length + categories.filter(c => c.is_active).length + 8,
    productPages: products.length,
    categoryPages: categories.length,
    structuredDataImplemented: true
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
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700/30 p-8">
      <div className="flex items-center gap-3 mb-8">
        <GlobeAltIcon className="w-8 h-8 text-gold-400" />
        <h2 className="text-3xl font-bold font-playfair text-gray-100">SEO Management</h2>
      </div>

      {/* SEO Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Pages',
            value: seoStats.totalPages,
            icon: DocumentTextIcon,
            color: 'blue'
          },
          {
            label: 'Indexable Pages',
            value: seoStats.indexablePages,
            icon: CheckCircleIcon,
            color: 'green'
          },
          {
            label: 'Product Pages',
            value: seoStats.productPages,
            icon: ChartBarIcon,
            color: 'gold'
          },
          {
            label: 'Category Pages',
            value: seoStats.categoryPages,
            icon: CogIcon,
            color: 'purple'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600/30"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              <span className={`text-3xl font-bold font-playfair text-${stat.color}-400`}>
                {stat.value}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 font-montserrat">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-700/30 rounded-2xl p-2 overflow-x-auto">
        {[
          { key: 'sitemap', label: 'Sitemap', icon: DocumentTextIcon },
          { key: 'robots', label: 'Robots.txt', icon: CogIcon },
          { key: 'structured', label: 'Structured Data', icon: ChartBarIcon },
          { key: 'feeds', label: 'Product Feeds', icon: CloudArrowDownIcon },
          { key: 'analytics', label: 'SEO Analytics', icon: GlobeAltIcon }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium font-montserrat transition-all duration-200 ${activeTab === tab.key
              ? 'bg-gold-500 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-600/50 hover:text-gold-400'
              }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'sitemap' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-playfair text-gray-100">XML Sitemap Generator</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateSitemap}
                  disabled={loading}
                  className="btn-primary px-6 py-3 font-montserrat disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Sitemap'}
                </button>
                {sitemapContent && (
                  <button
                    onClick={() => downloadSitemap(sitemapContent)}
                    className="btn-outline px-6 py-3 font-montserrat flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download
                  </button>
                )}
                <button
                  onClick={handleSavePublicSitemap}
                  disabled={loading}
                  className="btn-outline px-6 py-3 font-montserrat flex items-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Save Public Sitemap
                </button>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-100 mb-4">Sitemap Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total URLs:</span>
                  <span className="text-gray-100 ml-2 font-semibold">{seoStats.totalPages}</span>
                </div>
                <div>
                  <span className="text-gray-400">Product URLs:</span>
                  <span className="text-gray-100 ml-2 font-semibold">{seoStats.productPages}</span>
                </div>
                <div>
                  <span className="text-gray-400">Category URLs:</span>
                  <span className="text-gray-100 ml-2 font-semibold">{seoStats.categoryPages}</span>
                </div>
              </div>
            </div>

            {sitemapContent && (
              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-100">Generated Sitemap Preview</h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sitemapContent)
                    }}
                    className="text-sm text-gold-400 hover:text-gold-300 font-montserrat"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <pre className="text-xs text-gray-300 overflow-x-auto bg-gray-800 p-4 rounded-lg max-h-64">
                  {sitemapContent.substring(0, 1000)}...
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'robots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-playfair text-gray-100">Robots.txt Generator</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateRobots}
                  className="btn-primary px-6 py-3 font-montserrat"
                >
                  Generate Robots.txt
                </button>
                {robotsContent && (
                  <button
                    onClick={() => downloadRobotsTxt(robotsContent)}
                    className="btn-outline px-6 py-3 font-montserrat flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-100 mb-4">Robots.txt Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Allow all crawlers:</span>
                  <span className="text-green-400 font-semibold">✓ Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Block admin pages:</span>
                  <span className="text-green-400 font-semibold">✓ Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sitemap reference:</span>
                  <span className="text-green-400 font-semibold">✓ Included</span>
                </div>
              </div>
            </div>

            {robotsContent && (
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-100 mb-4">Generated Robots.txt</h4>
                <pre className="text-sm text-gray-300 bg-gray-800 p-4 rounded-lg">
                  {robotsContent}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'structured' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-playfair text-gray-100">Structured Data</h3>
              <button
                onClick={handleGenerateStructuredData}
                className="btn-primary px-6 py-3 font-montserrat"
              >
                Generate Schema
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Organization Schema',
                  description: 'Company information and contact details',
                  status: 'Active'
                },
                {
                  title: 'Website Schema',
                  description: 'Site-wide search functionality',
                  status: 'Active'
                },
                {
                  title: 'Product Schema',
                  description: 'Individual product information',
                  status: 'Active'
                }
              ].map((schema) => (
                <div key={schema.title} className="bg-gray-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-100 mb-2">{schema.title}</h4>
                  <p className="text-gray-300 text-sm mb-4">{schema.description}</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">
                    <CheckCircleIcon className="w-4 h-4" />
                    {schema.status}
                  </span>
                </div>
              ))}
            </div>

            {structuredDataPreview && (
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-100 mb-4">Schema Preview</h4>
                <pre className="text-xs text-gray-300 overflow-x-auto bg-gray-800 p-4 rounded-lg max-h-64">
                  {JSON.stringify(structuredDataPreview, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feeds' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold font-playfair text-gray-100">XML Product Feeds</h3>

            {/* Feed Stats */}
            {feedStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBagIcon className="w-6 h-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">Total Products</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{feedStats.total_active_products}</p>
                </div>

                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300 font-medium">In Stock</span>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{feedStats.in_stock}</p>
                </div>

                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                    <span className="text-gray-300 font-medium">Out of Stock</span>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{feedStats.out_of_stock}</p>
                </div>

                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <ChartBarIcon className="w-6 h-6 text-purple-400" />
                    <span className="text-gray-300 font-medium">Image Coverage</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">{feedStats.image_coverage_percentage}%</p>
                </div>
              </motion.div>
            )}

            {/* Feed Types Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`bg-gray-700/30 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-100 font-playfair">{feed.name}</h3>
                    </div>

                    <p className="text-gray-300 font-lora mb-4 h-12">{feed.description}</p>

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

                    <button
                      onClick={() => handleDownloadFeed(feed.type)}
                      disabled={loading}
                      className={`w-full bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} text-white px-4 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-bold shadow-lg`}
                    >
                      <CloudArrowDownIcon className="w-5 h-5" />
                      Download Feed
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-yellow-300 font-playfair mb-3">📋 How to Use XML Feeds</h3>
              <div className="space-y-2 text-yellow-200">
                <p><strong>General Feed:</strong> Use for custom integrations or third-party platforms</p>
                <p><strong>Google Feed:</strong> Upload to Google Merchant Center for Google Shopping</p>
                <p><strong>Facebook Feed:</strong> Use in Facebook Business Manager for product catalog</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-playfair text-gray-100">SEO Analytics Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-100 mb-4">SEO Health Score</h4>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">85%</span>
                  </div>
                  <div>
                    <p className="text-gray-300">Your site has good SEO optimization</p>
                    <p className="text-sm text-gray-400">Meta tags, structured data, and sitemaps are configured</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-100 mb-4">Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Meta descriptions implemented
                  </li>
                  <li className="flex items-center gap-2 text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Structured data configured
                  </li>
                  <li className="flex items-center gap-2 text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Mobile-friendly design
                  </li>
                  <li className="flex items-center gap-2 text-gold-400">
                    <EyeIcon className="w-4 h-4" />
                    Consider adding more product reviews
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-100 mb-4">Target Keywords Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">"pc gamer maroc"</span>
                  <span className="text-green-400 font-semibold">Ranking Well</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">"gaming pc morocco"</span>
                  <span className="text-gold-400 font-semibold">Improving</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">"setup gamer casablanca"</span>
                  <span className="text-green-400 font-semibold">Ranking Well</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">"composants pc pas cher"</span>
                  <span className="text-gold-400 font-semibold">Needs Work</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}