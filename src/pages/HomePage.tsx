import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  TrophyIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline'


import { productAPI, DatabaseCategory } from '../services/productApi'
import OrganizationSchema from '../components/OrganizationSchema'
import RecentlyViewedProducts from '../components/sales/RecentlyViewedProducts'
import OptimizedHero from '../components/OptimizedHero'
import TrustStrip from '../components/home/TrustStrip'
import FeaturedCollection from '../components/home/FeaturedCollection'
import TrendingSection from '../components/home/TrendingSection'
import FlashSale from '../components/home/FlashSale'
import Testimonials from '../components/home/Testimonials'
import InfiniteMarquee from '../components/home/InfiniteMarquee'
import LuxuryNewsletter from '../components/home/LuxuryNewsletter'
import { useSEO } from '../hooks/useSEO'
import { generateWebSiteSchema, generateLocalBusinessSchema } from '../utils/seoUtils'
import ScrollProgress from '../components/ui/ScrollProgress'

const CATEGORY_COLORS: { [key: string]: string } = {
  'PC Gamer': 'border-l-gold-500',
  'Composants': 'border-l-green-500',
  'Consoles': 'border-l-blue-500',
  'Accessoires': 'border-l-purple-500'
}



export default function HomePage() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState<DatabaseCategory[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await productAPI.getCategories()
        const activeCategories = categoriesData.filter((cat: any) => cat.is_active).slice(0, 4)
        setCategories(activeCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // SEO Implementation
  useSEO({
    title: t('seo.home.title') || 'SetupDream - PC Gamer et Setups Premium au Maroc',
    description: t('seo.home.description') || 'Le N°1 du PC Gamer au Maroc. PC sur mesure, composants et accessoires gaming. Livraison partout au Maroc.',
    url: window.location.origin,
    canonical: window.location.origin,
    type: 'website',
    keywords: t('seo.home.keywords') || 'pc gamer maroc, composants pc casablanca, setup gamer rabat, matériel gaming',
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        generateWebSiteSchema(),
        generateLocalBusinessSchema()
      ]
    }
  })


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ScrollProgress />
      {/* Temporary debug components to test language switching */}
      <OrganizationSchema />

      {/* Hero Section */}
      <OptimizedHero />

      {/* Trust & Authority Strip */}
      <TrustStrip />

      {/* Infinite Marquee Strip */}
      <InfiniteMarquee />

      {/* Featured Collection (Vedette) - New Design */}
      <FeaturedCollection />

      {/* Flash Sale Section */}
      <FlashSale />



      {/* Premium Minimalist Categories */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-playfair text-gray-100 mb-6 relative inline-block">
              {t('categories.title', 'Collections Premium')}
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </h2>
          </motion.div>

          {/* Minimalist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const accentClass = CATEGORY_COLORS[category.name] || 'border-l-gray-600'

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/categories?category=${category.id}`}
                    className="group block h-full"
                  >
                    <div className={`h-full flex flex-col justify-center bg-gray-900/50 border border-gray-800 ${accentClass} border-l-4 rounded-xl p-8 relative overflow-hidden transition-all duration-300 group-hover:bg-gray-900 group-hover:-translate-y-1 group-hover:shadow-lg`}>

                      <h3 className="text-2xl font-playfair font-bold text-gray-200 group-hover:text-white transition-colors duration-300 z-10 mb-2">
                        {i18n.language === 'fr' && (category as any).name_fr ? (category as any).name_fr : category.name}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-gold-400 transition-colors text-xs font-montserrat font-bold tracking-widest uppercase">
                        <span>{t('hero.exploreCollection')}</span>
                        <span className="transform transition-transform group-hover:translate-x-1">→</span>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-3 text-gold-400 hover:text-gold-300 transition-colors group"
            >
              <span className="font-montserrat font-medium tracking-widest uppercase text-sm">{t('categories.viewAll')}</span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trending Products - Redesigned */}
      <TrendingSection />

      {/* Recently Viewed (if any) */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <RecentlyViewedProducts />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-playfair text-gray-100 mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-lora">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                id: "01",
                icon: TrophyIcon,
                title: t('features.quality.title'),
                description: t('features.quality.description'),
                color: "text-gold-400",
                bgGradient: "from-gold-400/20 via-gold-500/5 to-transparent",
                borderColor: "group-hover:border-gold-500/50",
                hoverShadow: "group-hover:shadow-gold/20"
              },
              {
                id: "02",
                icon: ShieldCheckIcon,
                title: t('features.authentic.title'),
                description: t('features.authentic.description'),
                color: "text-blue-400",
                bgGradient: "from-blue-400/20 via-blue-500/5 to-transparent",
                borderColor: "group-hover:border-blue-500/50",
                hoverShadow: "group-hover:shadow-blue/20"
              },
              {
                id: "03",
                icon: TruckIcon,
                title: t('features.delivery.title'),
                description: t('features.delivery.description'),
                color: "text-green-400",
                bgGradient: "from-green-400/20 via-green-500/5 to-transparent",
                borderColor: "group-hover:border-green-500/50",
                hoverShadow: "group-hover:shadow-green/20"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative p-8 rounded-[2rem] border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden transition-all duration-500 ${feature.borderColor} ${feature.hoverShadow} hover:shadow-2xl hover:-translate-y-2`}
              >
                {/* Background Gradient Blob */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${feature.bgGradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                {/* Big Number */}
                <span className="absolute top-6 right-8 text-7xl font-black text-gray-800/40 group-hover:text-gray-700/40 transition-colors duration-500 font-montserrat select-none z-0">
                  {feature.id}
                </span>

                {/* Content Container */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 mb-8 rounded-2xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center ${feature.color} group-hover:scale-110 group-hover:bg-gray-800 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8" />
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold text-white mb-4 font-playfair group-hover:text-gold-100 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-lora leading-relaxed group-hover:text-gray-300 transition-colors text-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Luxury Newsletter */}
      <LuxuryNewsletter />

      <Testimonials />

      {/* Final CTA Section - Dark Luxury Redesign */}
      <section className="relative py-16 md:py-24 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/90 to-gray-900/80"></div>
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
            alt="Gaming Setup Atmosphere"
            className="w-full h-full object-cover opacity-30 select-none"
          />
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-playfair text-white leading-tight">
              {t('cta.titlePrefix')} <span className="text-gold-500 italic">{t('cta.titleHighlight')}</span>{t('cta.titleSuffix')}
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 font-lora max-w-2xl mx-auto">
              {t('cta.subtitlePremium')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-gold-500 rounded-full text-gray-900 font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] font-montserrat"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('cta.shopEmoji')}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>

              <Link
                to="/contact"
                className="group px-8 py-4 bg-transparent border border-white/20 rounded-full text-white font-bold text-lg hover:bg-white/5 hover:border-white/40 transition-all font-montserrat backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  {t('cta.contactEmoji')}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 
