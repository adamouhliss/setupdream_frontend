import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TruckIcon, ClockIcon, StarIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import { formatMAD } from '../../utils/currency'
import { getProductPrimaryImage } from '../../utils/productImages'
import { getProductUrl } from '../../utils/productUrls'
import MoroccoSEOOptimizer from '../../components/MoroccoSEOOptimizer'

export default function RabatSportsPage() {
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

  const rabatFeatures = [
    {
      icon: BuildingLibraryIcon,
      title: i18n.language === 'fr' ? 'Au cœur de la capitale' : 'In the heart of the capital',
      description: i18n.language === 'fr' 
        ? 'Magasin situé près du centre-ville de Rabat. Accès facile et parking.'
        : 'Store located near downtown Rabat. Easy access and parking.',
    },
    {
      icon: TruckIcon,
      title: i18n.language === 'fr' ? 'Livraison Rabat-Salé' : 'Rabat-Salé delivery',
      description: i18n.language === 'fr'
        ? 'Livraison rapide dans toute la région Rabat-Salé-Kénitra.'
        : 'Fast delivery throughout the Rabat-Salé-Kénitra region.',
    },
    {
      icon: ClockIcon,
      title: i18n.language === 'fr' ? 'Service après-vente' : 'After-sales service',
      description: i18n.language === 'fr'
        ? 'Réparation et maintenance de vos équipements sportifs.'
        : 'Repair and maintenance of your sports equipment.',
    },
    {
      icon: StarIcon,
      title: i18n.language === 'fr' ? 'Clients entreprises' : 'Corporate clients',
      description: i18n.language === 'fr'
        ? 'Devis gratuit pour administrations et entreprises.'
        : 'Free quotes for administrations and businesses.',
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Rabat-specific SEO */}
      <MoroccoSEOOptimizer 
        pageType="city" 
        cityName="Rabat"
        customTitle={i18n.language === 'fr' 
          ? "Équipements Sportifs Rabat | Magasin Sport Rabat - Carré Sport"
          : "Sports Equipment Rabat | Sports Store Rabat - Carré Sport"
        }
        customDescription={i18n.language === 'fr'
          ? "🏛️ Carré Sport Rabat - Spécialiste équipements sportifs. Proche centre-ville, accès facile. Service après-vente, réparation matériel. Devis gratuit entreprises."
          : "🏛️ Carré Sport Rabat - Sports equipment specialist. Near downtown, easy access. After-sales service, equipment repair. Free business quotes."
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {i18n.language === 'fr' ? 'Carré Sport' : 'Carré Sport'}
              </span>
              <br />
              <span className="text-white">
                {i18n.language === 'fr' ? 'Rabat' : 'Rabat'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {i18n.language === 'fr'
                ? "Votre partenaire sport dans la capitale ! Équipements fitness, musculation et accessoires. Service privilégié pour administrations et entreprises de Rabat."
                : "Your sports partner in the capital! Fitness equipment, gym gear and accessories. Premium service for Rabat administrations and businesses."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {i18n.language === 'fr' ? 'Découvrir nos produits' : 'Discover our products'}
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-500 text-blue-400 font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
              >
                {i18n.language === 'fr' ? 'Devis entreprise' : 'Business quote'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rabat Features */}
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
                ? 'Carré Sport Rabat, votre spécialiste'
                : 'Carré Sport Rabat, your specialist'
              }
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rabatFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-xl p-6 text-center hover:bg-gray-700/70 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
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
                ? 'Équipements disponibles à Rabat'
                : 'Equipment available in Rabat'
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
                    
                    <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold">
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
