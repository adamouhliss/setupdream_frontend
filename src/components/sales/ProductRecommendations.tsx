import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  StarIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import ProductCard from '../ProductCard'

interface ProductRecommendationsProps {
  title?: string
  currentProductId?: number
  category?: string
  type?: 'related' | 'trending' | 'bestsellers' | 'customers_also_bought'
  limit?: number
  onAddToCart?: (productId: number) => void
  onToggleWishlist?: (productId: number) => void
  wishlistItems?: number[]
}

export default function ProductRecommendations({
  title,
  currentProductId,
  category,
  type = 'related',
  limit = 6,
  onAddToCart,
  onToggleWishlist,
  wishlistItems = []
}: ProductRecommendationsProps) {

  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        let fetchedProducts: DatabaseProduct[] = []

        // Fetch products based on recommendation type
        switch (type) {
          case 'bestsellers':
            fetchedProducts = await productAPI.getFeaturedProducts()
            break

          case 'trending':
            fetchedProducts = await productAPI.getTrendingProducts(limit)
            break

          case 'customers_also_bought':
          case 'related':
            fetchedProducts = await productAPI.getRandomProducts(limit, currentProductId)
            break

          default:
            fetchedProducts = await productAPI.getRandomProducts(limit, currentProductId)
        }

        // Take only the requested limit
        setProducts(fetchedProducts.slice(0, limit))

      } catch (err) {
        console.error('Failed to fetch recommendation products:', err)
        setError('Failed to load recommendations')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type, currentProductId, category, limit])

  const getTitle = () => {
    if (title) return title

    switch (type) {
      case 'trending':
        return 'Trending Now'
      case 'bestsellers':
        return 'Best Sellers'
      case 'customers_also_bought':
        return 'Customers Also Bought'
      default:
        return 'You Might Also Like'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'trending':
        return ChartBarIcon
      case 'bestsellers':
        return StarIcon
      case 'customers_also_bought':
        return UserGroupIcon
      default:
        return SparklesIcon
    }
  }

  /* helpers removed */

  // Don't render if loading failed or no products
  if (error || (!loading && products.length === 0)) return null

  const IconComponent = getIcon()

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/30 p-6">
      <div className="flex items-center gap-2 mb-6">
        <IconComponent className="w-6 h-6 text-gold-400" />
        <h3 className="text-xl font-bold text-gray-100">{getTitle()}</h3>
        {type === 'bestsellers' && (
          <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full border border-red-500/30">
            Hot
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-gold-700 border-t-gold-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <ProductCard
                  product={product}
                  className="h-full"
                  showQuickAdd={false}
                  showWishlist={true}
                  isWishlisted={wishlistItems.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              </motion.div>
            ))}
          </div>

          {/* View More Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <Link
              to={`/products${category ? `?category=${category}` : ''}`}
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors"
            >
              View More Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </>
      )}
    </div>
  )
}

