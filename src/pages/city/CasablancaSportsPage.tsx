import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPinIcon, TruckIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import { formatMAD } from '../../utils/currency'
import { getProductPrimaryImage } from '../../utils/productImages'
import { getProductUrl } from '../../utils/productUrls'
import MoroccoSEOOptimizer from '../../components/MoroccoSEOOptimizer'

export default function CasablancaSportsPage() {
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

  const casablancaFeatures = [
    {
      icon: MapPinIcon,
      title: i18n.language === 'fr' ? 'Magasin à Casablanca' : 'Store in Casablanca',
      description: i18n.language === 'fr' 
        ? 'Showroom 500m² au cœur de Casablanca. Parking gratuit disponible.'
        : '500m² showroom in the heart of Casablanca. Free parking available.',
    },
    {
      icon: TruckIcon,
      title: i18n.language === 'fr' ? 'Livraison le jour même' : 'Same-day delivery',
      description: i18n.language === 'fr'
        ? 'Livraison dans toute la région du Grand Casablanca en moins de 4h.'
        : 'Delivery throughout Greater Casablanca region in under 4 hours.',
    },
    {
      icon: ClockIcon,
      title: i18n.language === 'fr' ? 'Ouvert 7j/7' : 'Open 7 days a week',
      description: i18n.language === 'fr'
        ? 'Lundi-Dimanche : 9h-20h. Service client disponible.'
        : 'Monday-Sunday: 9am-8pm. Customer service available.',
    },
    {
      icon: StarIcon,
      title: i18n.language === 'fr' ? 'N°1 à Casablanca' : '#1 in Casablanca',
      description: i18n.language === 'fr'
        ? 'Plus de 5000 clients satisfaits dans la région de Casablanca.'
        : 'Over 5,000 satisfied customers in the Casablanca region.',
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Casablanca-specific SEO */}
      <MoroccoSEOOptimizer 
        pageType="city" 
        cityName="Casablanca"
        customTitle={i18n.language === 'fr' 
          ? "Boutique PC Gamer Casablanca | SetupDream - Matériel Gaming Casablanca"
          : "Gaming PC Store Casablanca | SetupDream - Gaming Hardware Casablanca"
        }
        customDescription={i18n.language === 'fr'
          ? "🏪 Boutique gaming Casablanca chez SetupDream ! Showroom 500m², parking gratuit. Testez votre futur setup, conseil personnalisé. Ouvert 7j/7. Livraison le jour même."
          : "🏪 Gaming store Casablanca at SetupDream! 500m² showroom, free parking. Test your future setup, personal advice. Open 7 days. Same-day delivery available."
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-full blur-3xl"></div>
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
                {i18n.language === 'fr' ? 'Casablanca' : 'Casablanca'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {i18n.language === 'fr'
                ? "Votre spécialiste PC Gamer à Casablanca. PC sur mesure, composants de qualité et périphériques gaming. Livraison gratuite dans tout le Grand Casablanca."
                : "Your gaming PC specialist in Casablanca. Custom setups, premium components and gaming peripherals. Free delivery throughout Greater Casablanca."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-full hover:from-gold-600 hover:to-gold-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {i18n.language === 'fr' ? 'Voir nos produits' : 'View our products'}
              </Link>
              
              <a
                href="tel:+212632253960"
                className="inline-flex items-center px-8 py-4 border-2 border-gold-500 text-gold-500 font-semibold rounded-full hover:bg-gold-500 hover:text-gray-900 transition-all duration-200"
              >
                {i18n.language === 'fr' ? 'Appelez-nous' : 'Call us'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Casablanca Features */}
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
                ? 'Pourquoi choisir SetupDream Casablanca ?'
                : 'Why choose SetupDream Casablanca?'
              }
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {casablancaFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-xl p-6 text-center hover:bg-gray-700/70 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
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

      {/* Featured Products for Casablanca */}
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
                ? 'Produits populaires à Casablanca'
                : 'Popular products in Casablanca'
              }
            </h2>
            <p className="text-gray-300">
              {i18n.language === 'fr'
                ? 'Découvrez les équipements les plus demandés par nos clients casablancais'
                : 'Discover the equipment most requested by our Casablanca customers'
              }
            </p>
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
                    
                    <h3 className="text-white font-medium mb-2 group-hover:text-gold-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gold-400 font-bold">
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-full hover:from-gold-600 hover:to-gold-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              {i18n.language === 'fr' ? 'Voir tous nos produits' : 'View all products'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Info for Casablanca */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              {i18n.language === 'fr' 
                ? 'Contactez-nous à Casablanca'
                : 'Contact us in Casablanca'
              }
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPinIcon className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Adresse' : 'Address'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {i18n.language === 'fr' 
                    ? 'Avenue Mohammed V, Casablanca 20000'
                    : 'Mohammed V Avenue, Casablanca 20000'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <ClockIcon className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Horaires' : 'Hours'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {i18n.language === 'fr' 
                    ? 'Lun-Dim : 9h00-20h00'
                    : 'Mon-Sun: 9am-8pm'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <TruckIcon className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-2">
                  {i18n.language === 'fr' ? 'Téléphone' : 'Phone'}
                </h3>
                <p className="text-gray-300 text-sm">
                  <a href="tel:+212632253960" className="hover:text-gold-400 transition-colors">
                    +212 632 253 960
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 