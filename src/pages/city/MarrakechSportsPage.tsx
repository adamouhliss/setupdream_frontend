import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TruckIcon, ClockIcon, StarIcon, SunIcon } from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import { formatMAD } from '../../utils/currency'
import { getProductPrimaryImage } from '../../utils/productImages'
import { getProductUrl } from '../../utils/productUrls'
import MoroccoSEOOptimizer from '../../components/MoroccoSEOOptimizer'

export default function MarrakechSportsPage() {
  const { i18n } = useTranslation()
  const [featuredProducts, setFeaturedProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const products = await productAPI.getFeaturedProducts()
      setFeaturedProducts(products.slice(0, 8))
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const marrakechFeatures = [
    {
      icon: SunIcon,
      title: i18n.language === 'fr' ? 'Refroidissement optimal' : 'Optimal cooling',
      description: i18n.language === 'fr' 
        ? 'PC montés avec un refroidissement adapté au climat chaud de Marrakech.'
        : 'PCs built with advanced cooling adapted to Marrakech\'s warm climate.',
    },
    {
      icon: TruckIcon,
      title: i18n.language === 'fr' ? 'Livraison Marrakech' : 'Marrakech delivery',
      description: i18n.language === 'fr'
        ? 'Livraison dans toute la région de Marrakech-Safi en 24h.'
        : '24h delivery throughout the Marrakech-Safi region.',
    },
    {
      icon: ClockIcon,
      title: i18n.language === 'fr' ? 'Service d\'assemblage' : 'Assembly service',
      description: i18n.language === 'fr'
        ? 'Formation sur l\'optimisation de vos composants informatiques.'
        : 'Training on optimizing your computer components.',
    },
    {
      icon: StarIcon,
      title: i18n.language === 'fr' ? 'Conseils d\'experts' : 'Expert advice',
      description: i18n.language === 'fr'
        ? 'Conseils pour l\'assemblage parfait d\'un setup puissant et durable.'
        : 'Advice for the perfect build of a powerful and durable setup.',
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Marrakech-specific SEO */}
      <MoroccoSEOOptimizer 
        pageType="city" 
        cityName="Marrakech"
        customTitle={i18n.language === 'fr' 
          ? "PC Gamer Marrakech | Matériel Gaming Marrakech - SetupDream"
          : "Gaming PCs Marrakech | Gaming Hardware Marrakech - SetupDream"
        }
        customDescription={i18n.language === 'fr'
          ? "🌴 SetupDream Marrakech - Votre boutique gaming ! Setups sur mesure, refroidissement optimal, conseil d'experts et montage pro."
          : "🌴 SetupDream Marrakech - Your gaming store! Custom setups, optimal cooling, expert advice and pro assembly."
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                {i18n.language === 'fr' ? 'SetupDream' : 'SetupDream'}
              <br />
              <span className="text-white">
                {i18n.language === 'fr' ? 'Marrakech' : 'Marrakech'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {i18n.language === 'fr'
                ? "Votre spécialiste PC Gamer à Marrakech ! PC sur mesure avec refroidissement performant, conseils d'experts et montage personnalisé. Votre setup de rêve sous le soleil de Marrakech."
                : "Your gaming PC specialist in Marrakech! Custom PCs with optimal cooling, expert advice and personalized assembly. Your dream setup under the Marrakech sun."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {i18n.language === 'fr' ? 'Nos équipements' : 'Our equipment'}
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-400 font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200"
              >
                {i18n.language === 'fr' ? 'Conseils experts' : 'Expert advice'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marrakech Features */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {i18n.language === 'fr' 
                ? 'L\'expertise SetupDream à Marrakech'
                : 'SetupDream expertise in Marrakech'
              }
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marrakechFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-xl p-6 text-center hover:bg-gray-700/70 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {i18n.language === 'fr' 
                ? 'Matériel recommandé à Marrakech'
                : 'Recommended equipment in Marrakech'
              }
            </h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-700/50 rounded-xl p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-6 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700/70 transition-all duration-300 group"
                >
                  <Link to={getProductUrl(product)} className="block">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img
                        src={getProductPrimaryImage(product.id, product.image_url)}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <h3 className="text-white font-medium mb-2 group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-orange-400 font-bold">
                        {formatMAD(product.sale_price || product.price)}
                      </span>
                      {product.sale_price && (
                        <span className="text-gray-400 line-through text-sm">
                          {formatMAD(product.price)}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 
