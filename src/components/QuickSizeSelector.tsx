import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../store/cartStore'
import { convertToCartProduct } from '../services/productApi'
import { DatabaseProduct } from '../services/productApi'
import { getProductUrl } from '../utils/productUrls'

interface QuickSizeSelectorProps {
  product: DatabaseProduct
  selectedColor?: string
  onAddToCart?: () => void
}

export default function QuickSizeSelector({ 
  product, 
  selectedColor = '',
  onAddToCart 
}: QuickSizeSelectorProps) {
  const { t } = useTranslation()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const { addItem } = useCartStore()

  const cartProduct = convertToCartProduct(product)
  const sizes = product.sizes || []

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      setShowSizeSelector(true)
      return
    }

    addItem(cartProduct, 1, selectedColor, selectedSize || undefined)
    
    // Visual feedback
    if (onAddToCart) onAddToCart()
    
    // Reset state
    setSelectedSize('')
    setShowSizeSelector(false)
  }

  const handleQuickAdd = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (sizes.length === 0) {
      // No sizes available, add directly
      handleAddToCart()
    } else {
      // Show size selector
      setShowSizeSelector(true)
    }
  }

  // Handle touch events for mobile
  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault()
    handleQuickAdd(event)
  }

  return (
    <div className="relative mt-4">
      {/* Quick Add Button */}
      <button
        onClick={handleQuickAdd}
        onTouchStart={handleTouchStart}
        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 active:from-gold-600 active:to-gold-700 text-white py-2 px-4 rounded-xl font-medium font-montserrat transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
        style={{
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <ShoppingCartIcon className="w-4 h-4" />
        <span className="sm:hidden">{sizes.length > 0 ? t('products.size') : t('products.addToCart')}</span>
        <span className="hidden sm:inline">{sizes.length > 0 ? t('products.selectSize') : t('products.addToCart')}</span>
      </button>

      {/* Size Selector Modal */}
      <AnimatePresence>
        {showSizeSelector && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 shadow-xl z-50"
          >
            <div className="space-y-3">
              <h4 className="font-semibold font-montserrat text-gray-100 text-sm mb-2 text-center sm:text-left">
                {t('products.selectSize')}
              </h4>
              
              {/* Size buttons - Better mobile layout */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSizeSelect(size)
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handleSizeSelect(size)
                    }}
                    className={`min-w-[44px] h-9 px-3 border rounded-lg font-medium font-montserrat text-sm transition-all duration-200 touch-manipulation flex items-center justify-center ${
                      selectedSize === size
                        ? 'border-gold-500 bg-gold-500/20 text-gold-300'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 active:border-gray-500 active:bg-gray-600/50'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowSizeSelector(false)
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    setShowSizeSelector(false)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg font-medium font-montserrat text-sm active:bg-gray-700/50 transition-colors touch-manipulation"
                  style={{
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart()
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    if (selectedSize) {
                      handleAddToCart()
                    }
                  }}
                  disabled={!selectedSize}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 active:from-gold-600 active:to-gold-700 text-white px-3 py-2 rounded-lg font-medium font-montserrat text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1 touch-manipulation"
                  style={{
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <ShoppingCartIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('products.add')}</span>
                </button>
              </div>
            </div>

            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternative: Link to Product Detail */}
      {sizes.length > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            window.location.href = getProductUrl(product)
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            window.location.href = getProductUrl(product)
          }}
          className="w-full mt-2 border border-gray-600 text-gray-300 active:bg-gray-700/50 active:text-gray-100 py-2 px-4 rounded-xl font-medium font-montserrat text-sm transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <span className="sm:hidden">{t('products.details')}</span>
          <span className="hidden sm:inline">{t('products.viewDetails')}</span>
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  )
} 