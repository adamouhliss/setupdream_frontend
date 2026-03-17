import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  SparklesIcon,
  ClockIcon,
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
import newBg from '../assets/hero-bg.png' // Utilizing existing asset for now

export default function NewArrivalsPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  // SEO Optimization
  useSEO({
    title: t('seo.newArrivals.title') || 'Nouveaux Arrivages & Collections 2024 | Carré Sport',
    description: t('seo.newArrivals.description') || 'Découvrez les dernières nouveautés en équipement sportif. Machines de musculation, cardio et accessoires fraîchement arrivés.',
    keywords: t('seo.newArrivals.keywords') || 'nouveauté sport, équipement musculation 2024, matériel fitness récent, arrivage sport maroc',
    type: 'website',
    canonical: window.location.href
  })

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true)
        const response = await productAPI.getProducts({ limit: 100 })
        // Sort by creation date (newest first)
        const sortedProducts = response.items.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setProducts(sortedProducts.slice(0, 50))
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err)
        setError('Failed to load new arrivals')
      } finally {
        setLoading(false)
      }
    }
    fetchNewArrivals()
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

  return (
    <div className="min-h-screen bg-gray-900">

      {/* Premium Hero Section - Gold Theme */}
      <PageHero
        title={t('newArrivals.hero.title') || "Just Dropped"}
        subtitle={t('newArrivals.hero.subtitle') || "Be the first to experience the future of fitness. Our latest collection defines the cutting edge of performance."}
        bgImage={newBg}
        themeColor="gold"
        badgeText={t('newArrivals.hero.badge') || "LATEST COLLECTION"}
      />

      {/* Trust Strip */}
      <TrustStrip />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Intro Block */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 text-gold-500 mb-4 px-4 py-2 bg-gold-500/10 rounded-full border border-gold-500/20">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs font-bold font-montserrat tracking-widest uppercase">{t('newArrivals.intro.badge') || "Updated Daily"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-playfair mb-6">
              {t('newArrivals.intro.title') || "Experience the Innovation"}
            </h2>
            <p className="text-gray-400 font-lora text-lg leading-relaxed">
              {t('newArrivals.intro.subtitle') || "Each new arrival is selected for its superior quality, durability, and performance. Upgrade your training with the latest professional-grade equipment."}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 font-lora animate-pulse">Curating latest arrivals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
              <SparklesIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
              <SparklesIcon className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white font-playfair mb-3">No new arrivals yet</h3>
            <p className="text-gray-400 font-lora mb-8">We're restocking soon. Stay tuned for the next drop.</p>
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
                  isNew={true}
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
