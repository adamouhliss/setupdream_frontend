import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DatabaseCategory } from '../../services/productApi'
import { useTranslation } from 'react-i18next'

interface ProductFiltersProps {
    categories: DatabaseCategory[]
    selectedCategory: number | null
    selectedSubcategory: number | null
    onCategoryChange: (categoryId: number | null) => void
    onSubcategoryChange: (subcategoryId: number | null) => void
    className?: string
    mobileOpen?: boolean
    onMobileClose?: () => void
}

export default function ProductFilters({
    categories,
    selectedCategory,
    selectedSubcategory,
    onCategoryChange,
    onSubcategoryChange,
    className = '',
    mobileOpen = false,
    onMobileClose
}: ProductFiltersProps) {
    const { t, i18n } = useTranslation()
    const [expandedCategory, setExpandedCategory] = useState<number | null>(selectedCategory)

    // Deskop view standard classes
    const desktopClasses = `bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 h-fit ${className}`

    // Update expanded category when selection changes externally
    useEffect(() => {
        if (selectedCategory) {
            setExpandedCategory(selectedCategory)
        }
    }, [selectedCategory])

    const handleCategoryClick = (categoryId: number | null) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null)
        } else {
            setExpandedCategory(categoryId)
        }
        onCategoryChange(categoryId)
    }

    const filterContent = (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-playfair text-white flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gold-500" />
                    {t('products.filters', 'Filters')}
                </h3>
                {onMobileClose && (
                    <button onClick={onMobileClose} className="p-2 -mr-2 text-gray-400 hover:text-white lg:hidden">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Categories Accordion */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-montserrat">
                    {t('products.categories', 'Categories')}
                </h4>

                <div className="space-y-2">
                    {/* All Categories Option */}
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`w-full text-left py-2 px-3 rounded-xl transition-all duration-200 font-medium ${selectedCategory === null
                            ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                            }`}
                    >
                        {t('products.allCategories', 'All Categories')}
                    </button>

                    {categories.map((category) => (
                        <div key={category.id} className="space-y-1">
                            <div className={`w-full flex items-center justify-between rounded-xl transition-all duration-200 ${selectedCategory === category.id
                                ? 'bg-gold-500/5'
                                : 'hover:bg-gray-700/50'
                                }`}>
                                <button
                                    onClick={() => onCategoryChange(category.id)}
                                    className={`flex-1 text-left py-2 px-3 font-medium ${selectedCategory === category.id
                                        ? 'text-gold-400'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {i18n.language === 'fr' && category.name_fr ? category.name_fr : category.name}
                                </button>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setExpandedCategory(expandedCategory === category.id ? null : category.id)
                                        }}
                                        className="p-2 mr-1 text-gray-500 hover:text-gold-400 transition-colors"
                                    >
                                        <ChevronDownIcon
                                            className={`w-4 h-4 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180 text-gold-400' : ''
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>

                            {/* Subcategories Animation */}
                            <AnimatePresence>
                                {expandedCategory === category.id && category.subcategories && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-4 py-2 space-y-1 border-l-2 border-gray-700 ml-3">
                                            <button
                                                onClick={() => onSubcategoryChange(null)}
                                                className={`w-full text-left py-1.5 px-3 rounded-lg text-sm transition-colors ${selectedSubcategory === null
                                                    ? 'text-gold-400 font-medium'
                                                    : 'text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                {t('common.all', 'All')}
                                            </button>
                                            {category.subcategories.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => onSubcategoryChange(sub.id)}
                                                    className={`w-full text-left py-1.5 px-3 rounded-lg text-sm transition-colors ${selectedSubcategory === sub.id
                                                        ? 'text-gold-400 font-medium bg-gold-500/5'
                                                        : 'text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    {i18n.language === 'fr' && sub.name_fr ? sub.name_fr : sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )

    // Mobile Drawer
    if (mobileOpen) {
        return (
            <div className="fixed inset-0 z-50 lg:hidden focus:outline-none">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onMobileClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Drawer Content */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto"
                >
                    {filterContent}
                </motion.div>
            </div>
        )
    }

    // Desktop Sidebar
    return (
        <div className={`hidden lg:block ${desktopClasses}`}>
            {filterContent}
        </div>
    )
}
