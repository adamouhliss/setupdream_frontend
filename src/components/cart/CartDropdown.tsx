import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../../store/cartStore'
import { formatMAD } from '../../utils/currency'
import { getProductPrimaryImage } from '../../utils/productImages'

export default function CartDropdown() {
  const { t } = useTranslation()
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
        onClick={toggleCart}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold font-playfair text-gray-900 dark:text-gray-100">
              {t('cart.title')} ({getTotalItems()})
            </h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="px-6 pt-4">
              {getTotalPrice() >= 500 ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-2 rounded-lg text-sm font-semibold text-center font-montserrat">
                  🎉 {t('cart.qualifiesForFreeShipping') || "You've qualified for Free Shipping!"}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                    Add <span className="font-bold text-gold-500">{formatMAD(500 - getTotalPrice())}</span> for Free Shipping
                  </p>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(getTotalPrice() / 500) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold font-playfair text-gray-900 dark:text-gray-100 mb-2">{t('cart.empty')}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-lora mb-6">{t('cart.addProducts')}</p>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <Link
                    to="/products"
                    onClick={toggleCart}
                    className="inline-block btn-primary px-6 py-3 font-montserrat relative overflow-hidden group"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      {t('cart.shopNow')}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-700"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product.image || item.product.id ? (
                        <img
                          src={getProductPrimaryImage(item.product.id, item.product.image)}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none'
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                            if (nextElement) nextElement.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ display: item.product.image || item.product.id ? 'none' : 'flex' }}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold font-montserrat text-center">
                          {item.product.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold font-playfair text-gray-900 dark:text-gray-100 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-lora truncate">
                        {item.product.description}
                      </p>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-montserrat">
                          {t('products.color')}: {item.selectedColor}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold font-playfair text-gold-600 dark:text-gold-400">
                          {formatMAD(item.product.price)}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 line-through font-montserrat">
                            {formatMAD(item.product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 dark:text-red-400 transition-colors duration-200"
                        title={t('cart.removeItem')}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <MinusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        <span className="w-8 text-center font-semibold font-montserrat dark:text-gray-100">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold font-playfair text-gray-900 dark:text-gray-100">{t('common.total')}:</span>
                <span className="text-2xl font-bold font-playfair text-gold-600 dark:text-gold-400">
                  {formatMAD(getTotalPrice())}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={toggleCart}
                  className="btn-outline py-3 text-center font-montserrat"
                >
                  {t('cart.viewCart')}
                </Link>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="btn-primary py-3 text-center font-montserrat"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 