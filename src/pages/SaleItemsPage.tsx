import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FireIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import { productAPI, DatabaseProduct } from '../services/productApi'
import { useSEO } from '../hooks/useSEO'
import ProductCard from '../components/ProductCard'
import PageHero from '../components/PageHero'
import TrustStrip from '../components/home/TrustStrip'
import LuxuryNewsletter from '../components/home/LuxuryNewsletter'
// @ts-ignore
import saleBg from '../assets/hero-bg.png' // Utilizing existing asset for now

export default function SaleItemsPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  // SEO Optimization
  useSEO({
    title: t('seo.sale.title') || 'Ventes Flash & Promotions Exclusives | Carré Sport',
    description: t('seo.sale.description') || 'Profitez de remises exceptionnelles sur une sélection d\'équipements sportifs premium. Offres limitées dans le temps.',
    keywords: t('seo.sale.keywords') || 'soldes sport, promotion musculation, vente flash fitness, équipement sport pas cher',
    type: 'website',
    canonical: window.location.href
  })

  useEffect(() => {
    const fetchSaleItems = async () => {
      try {
        setLoading(true)
        const response = await productAPI.getProducts({ limit: 100 })
        // Filter and sort by discount
        const saleProducts = response.items
          .filter(product => product.sale_price && product.sale_price < product.price)
          .sort((a, b) => {
            const discountA = ((a.price - (a.sale_price || a.price)) / a.price)
            const discountB = ((b.price - (b.sale_price || b.price)) / b.price)
            return discountB - discountA
          })

        setProducts(saleProducts)
      } catch (err) {
        console.error('Failed to fetch sale items:', err)
        setError('Failed to load sale items')
      } finally {
        setLoading(false)
      }
    }
    fetchSaleItems()
  }, [])

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const getDiscountPercentage = (product: DatabaseProduct) => {
    if (!product.sale_price) return 0
    return Math.round(((product.price - product.sale_price) / product.price) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-900">

      {/* Premium Hero Section */}
      <PageHero
        title={t('sale.hero.title') || "Limited Time Offers"}
        subtitle={t('sale.hero.subtitle') || "Exceptional savings on professional-grade equipment. Don't miss out on these exclusive deals."}
        bgImage={saleBg}
        themeColor="red"
        badgeText={t('sale.hero.badge') || "FLASH SALE LIVE"}
      />

      {/* Trust Strip */}
      <TrustStrip />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Stats Section */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                label: "Items on Sale",
                value: products.length,
                icon: TagIcon,
                color: "text-red-500"
              },
              {
                label: "Max Discount",
                value: `${Math.max(...products.map(p => getDiscountPercentage(p)))}%`,
                icon: FireIcon,
                color: "text-orange-500"
              },
              {
                label: "Time Remaining",
                value: "48h 12m",
                icon: ClockIcon,
                color: "text-red-400"
              }
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur border border-white/5 rounded-2xl p-6 flex items-center gap-6 group hover:border-red-500/30 transition-colors">
                <div className={`p-4 rounded-xl bg-gray-900/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white font-playfair">{stat.value}</div>
                  <div className="text-gray-400 font-montserrat text-xs uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 font-lora animate-pulse">Loading exclusive offers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
              <FireIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
              <button onClick={() => window.location.reload()} className="text-red-400 hover:text-red-300 underline underline-offset-4">
                Try Refreshing
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <TagIcon className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white font-playfair mb-3">No active sales right now</h3>
            <p className="text-gray-400 font-lora mb-8">Sign up for our newsletter to get notified when the next flash sale drops.</p>
            <Link to="/products" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium tracking-wide border-b border-gold-400/30 pb-1 hover:border-gold-400 transition-all">
              Browse All Collections <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <ProductCard
                  product={product}
                  isWishlisted={favorites.has(product.id)}
                  onToggleWishlist={toggleFavorite}
                  showRating={true}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>

      <LuxuryNewsletter />
    </div>
  )
}
