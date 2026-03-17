import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ClockIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import ProductCard from '../ProductCard'
import { useTranslation } from 'react-i18next'

interface RecentlyViewedProductsProps {
  currentProductId?: number
}

export default function RecentlyViewedProducts({
  currentProductId
}: RecentlyViewedProductsProps) {
  const { t } = useTranslation()
  const [recentlyViewed, setRecentlyViewed] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        setLoading(true)

        // Get a random selection of products to simulate "recently viewed"
        // In a real app, this would come from local storage or user session
        const response = await productAPI.getProducts({ limit: 8 })
        let products = response.items

        // Filter out current product if viewing
        if (currentProductId) {
          products = products.filter(product => product.id !== currentProductId)
        }

        // Shuffle and take first 4 to simulate variety
        const shuffled = products.sort(() => Math.random() - 0.5)
        setRecentlyViewed(shuffled.slice(0, 4))

      } catch (err) {
        console.error('Failed to fetch recently viewed products:', err)
        setRecentlyViewed([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyViewed()
  }, [currentProductId])

  if (loading || recentlyViewed.length === 0) return null

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 px-4 sm:px-0">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3 text-gold-500"
          >
            <ClockIcon className="w-5 h-5" />
            <span className="font-montserrat font-bold text-xs tracking-widest uppercase">
              {t('recentlyViewed.subtitle', 'Pick up where you left off')}
            </span>
          </motion.div>

          <div className="relative inline-block">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black font-playfair text-white relative z-10"
            >
              {t('recentlyViewed.title', 'Recently Viewed')}
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute bottom-1 left-0 h-3 bg-gold-900/30 -z-0 -rotate-1"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/products"
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300"
          >
            <span className="font-montserrat font-bold text-xs tracking-widest uppercase">{t('products.viewAll', 'View All')}</span>
            <ArrowLongRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gold-500" />
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {recentlyViewed.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <ProductCard
              product={product}
              showRating={false}
              className="bg-gray-900 border-gray-800 hover:border-gold-500/30 transition-all duration-500 h-full"
              priority={index < 4} // Since these are already below fold but visible on scroll, eager loading them when they mount (in view) is fine
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
