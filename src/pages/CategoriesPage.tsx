import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { productAPI } from '../services/productApi'

interface Subcategory {
  id: number
  name: string
  name_fr?: string
  category_id: number
}

interface Category {
  id: number
  name: string
  name_fr?: string
  description?: string
  description_fr?: string
  subcategories: Subcategory[]
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Equipment': 'border-l-gold-500',
  'Footwear': 'border-l-green-500',
  'Clothing': 'border-l-blue-500',
  'Accessories': 'border-l-purple-500'
}

export default function CategoriesPage() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const categoriesData = await productAPI.getCategories()
        const activeCategories = categoriesData
          .filter((cat: any) => cat.is_active)
          .map((cat: any) => ({
            ...cat,
            subcategories: cat.subcategories || []
          }))
        setCategories(activeCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredCategories = categories.filter(category => {
    const name = i18n.language === 'fr' && category.name_fr ? category.name_fr : category.name;
    const desc = i18n.language === 'fr' && category.description_fr ? category.description_fr : category.description;

    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (desc && desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      category.subcategories.some(sub => {
        const subName = i18n.language === 'fr' && sub.name_fr ? sub.name_fr : sub.name;
        return subName.toLowerCase().includes(searchTerm.toLowerCase());
      })
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-t-2 border-gold-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-montserrat">
      {/* Minimalist Typographic Hero */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-900 bg-gray-950 relative overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-playfair text-white mb-6 tracking-tight">
              {t('collections.title')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl font-light">
              {t('collections.subtitle')}
            </p>
          </motion.div>

          {/* Search Input - Clean & Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-12 max-w-lg"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder={t('collections.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white px-6 py-4 rounded-xl focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all outline-none pl-12 placeholder-gray-600"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-gold-500 transition-colors" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category, index) => {
            const accentClass = CATEGORY_COLORS[category.name] || 'border-l-gray-600'
            const displayName = i18n.language === 'fr' && category.name_fr ? category.name_fr : category.name;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link to={`/products?category=${category.id}`} className="block h-full">
                  <div className={`h-full bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 ${accentClass}`}>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-3xl font-playfair font-bold text-gray-100 group-hover:text-gold-400 transition-colors">
                        {displayName}
                      </h2>
                      <ArrowLongRightIcon className="w-6 h-6 text-gray-600 group-hover:text-gold-500 transform group-hover:translate-x-2 transition-all" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">
                      {i18n.language === 'fr' && category.description_fr ? category.description_fr : category.description || t('collections.defaultDescription', { category: displayName })}
                    </p>

                    {/* Subcategories Pills */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {category.subcategories.slice(0, 5).map(sub => (
                        <span
                          key={sub.id}
                          className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-lg group-hover:border-gray-600 group-hover:text-gray-300 transition-colors"
                        >
                          {i18n.language === 'fr' && sub.name_fr ? sub.name_fr : sub.name}
                        </span>
                      ))}
                      {category.subcategories.length > 5 && (
                        <span className="px-3 py-1 text-xs text-gray-500">
                          {t('collections.more', { count: category.subcategories.length - 5 })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {t('collections.noResults', { term: searchTerm })}
          </div>
        )}
      </div>
    </div>
  )
} 