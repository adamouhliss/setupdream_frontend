import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cartStore'
import { useStoreSettingsStore } from '../store/storeSettingsStore'
import { formatMAD } from '../utils/currency'
import { getProductUrl } from '../utils/productUrls'
import { getProductPrimaryImage } from '../utils/productImages'
import ProductRecommendations from '../components/sales/ProductRecommendations'

export default function CartPage() {
  const { t } = useTranslation()
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore()
  const { settings, fetchSettings } = useStoreSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const subtotal = getTotalPrice()
  const freeShippingThreshold = settings.free_shipping_threshold
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold

  const handleQuantityChange = (productId: number, newQuantity: number, selectedColor?: string, selectedSize?: string) => {
    if (newQuantity <= 0) {
      removeItem(productId, selectedColor, selectedSize)
    } else {
      updateQuantity(productId, newQuantity, selectedColor, selectedSize)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors mb-6 font-montserrat"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {t('cart.continueShopping')}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-100">
              {t('cart.title')}
            </h1>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-4">{t('cart.empty')}</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto font-lora">
              {t('cart.emptyDescription')}
            </p>
            <Link
              to="/products"
              className="btn-primary px-8 py-4 text-lg font-montserrat"
            >
              {t('cart.startShopping')}
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors mb-6 font-montserrat"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t('cart.continueShopping')}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-100">
                {t('cart.title')}
              </h1>
              <p className="text-gray-300 font-lora mt-2">
                {getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')} {t('cart.inYourCart')}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 font-medium font-montserrat transition-colors"
            >
              {t('cart.clearCart')}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {items.map((item, _index) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedColor}`}
                  variants={itemVariants}
                  className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                        <span className="text-gray-300 font-semibold font-montserrat text-center">
                          {item.product.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <Link
                          to={getProductUrl(item.product)}
                          className="text-xl font-bold font-playfair text-gray-100 hover:text-gold-400 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex flex-col gap-1 mt-2">
                          {item.selectedColor && (
                            <p className="text-gold-400 font-medium font-montserrat text-sm">
                              {t('products.color')}: {item.selectedColor}
                            </p>
                          )}
                          {item.selectedSize && (
                            <p className="text-gold-400 font-medium font-montserrat text-sm">
                              {t('products.size')}: {item.selectedSize}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium font-montserrat text-gray-300">{t('cart.qty')}:</span>
                          <div className="flex items-center border border-gray-600 rounded-xl">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                              className="p-2 hover:bg-gray-700 transition-colors duration-200 rounded-l-xl"
                            >
                              <MinusIcon className="w-4 h-4 text-gray-300" />
                            </button>
                            <span className="px-4 py-2 font-semibold font-montserrat bg-gray-700 min-w-[3rem] text-center text-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                              className="p-2 hover:bg-gray-700 transition-colors duration-200 rounded-r-xl"
                            >
                              <PlusIcon className="w-4 h-4 text-gray-300" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold font-playfair text-gold-400">
                                {formatMAD(item.product.price)}
                              </span>
                              {item.product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through font-montserrat">
                                  {formatMAD(item.product.originalPrice)}
                                </span>
                              )}
                            </div>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-300 font-montserrat">
                                {t('common.total')}: {formatMAD(item.product.price * item.quantity)}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                            className="p-2 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                            title={t('cart.removeItem')}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 p-6 sticky top-8"
            >
              <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
                {t('cart.summary')}
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300 font-montserrat">
                  <span>{t('common.subtotal')} ({getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')})</span>
                  <span>{formatMAD(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-300 font-montserrat">
                  <span>{t('cart.shipping')}</span>
                  <span>{getTotalPrice() >= settings.free_shipping_threshold ? t('cart.free') : formatMAD(settings.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-gray-300 font-montserrat">
                  <span>{t('cart.tax')}</span>
                  <span>{formatMAD(Math.round(getTotalPrice() * (settings.tax_rate / 100)))}</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-xl font-bold font-playfair text-gray-100">
                    <span>{t('common.total')}</span>
                    <span className="text-gold-400">
                      {formatMAD(getTotalPrice() + (getTotalPrice() >= settings.free_shipping_threshold ? 0 : settings.shipping_cost) + Math.round(getTotalPrice() * (settings.tax_rate / 100)))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {!qualifiesForFreeShipping && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-montserrat text-gray-300 mb-2">
                    <span>{t('cart.freeShippingAt')} {formatMAD(freeShippingThreshold)}</span>
                    <span>{formatMAD(remainingForFreeShipping)} {t('cart.toGo')}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {qualifiesForFreeShipping && (
                <div className="bg-green-900/30 rounded-2xl p-4 border border-green-600/30 mb-6">
                  <div className="flex items-center gap-2 text-green-400">
                    <TruckIcon className="w-5 h-5" />
                    <span className="font-medium">🎉 {t('cart.qualifiesForFreeShipping')}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full btn-primary py-4 text-lg font-montserrat text-center block"
                >
                  {t('cart.proceedToCheckout')}
                </Link>
                <Link
                  to="/products"
                  className="w-full btn-outline py-3 font-montserrat text-center block"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-montserrat">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {t('cart.secureCheckout')}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recommended Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <ProductRecommendations
            type="customers_also_bought"
            title={t('cart.youMightAlsoLike')}
            limit={4}
          />
        </motion.div>
      </div>
    </div>
  )
} 