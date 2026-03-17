import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { XMarkIcon, SparklesIcon, TagIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'

export default function FirstTimeDiscountBanner() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(true)
  const { isAuthenticated, user } = useAuthStore()

  // Check localStorage for dismissal on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('discount-banner-dismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
    }
  }, [])

  // Don't show banner if user is logged in AND has already used their discount
  if (isAuthenticated && user && user.has_used_first_time_discount === true) {
    return null
  }

  // Don't show if user dismissed it
  if (!isVisible) {
    return null
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('discount-banner-dismissed', 'true')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 text-white shadow-lg z-40"
    >
      <div className="container mx-auto px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            {/* Icon - Hidden on mobile, smaller on larger screens */}
            <div className="hidden sm:flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-gold-100" />
              <TagIcon className="w-5 h-5 text-gold-100" />
            </div>
            
            {/* Banner Content */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
              <div className="flex-1">
                <h3 className="font-bold font-playfair text-sm sm:text-base leading-tight">
                  🎉 {isAuthenticated ? t('discount.banner.authenticatedTitle') : t('discount.banner.newCustomerTitle')}
                </h3>
                <p className="font-lora text-gold-100 text-xs sm:text-sm leading-tight">
                  {isAuthenticated 
                    ? t('discount.banner.authenticatedDescription')
                    : t('discount.banner.newCustomerDescription')
                  }
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                {isAuthenticated ? (
                  <Link
                    to="/products"
                    className="bg-white text-gold-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold font-montserrat text-xs sm:text-sm hover:bg-gold-50 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    {t('discount.banner.shopNow')}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-white text-gold-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold font-montserrat text-xs sm:text-sm hover:bg-gold-50 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      {t('discount.banner.signUpNow')}
                    </Link>
                    <Link
                      to="/login"
                      className="hidden sm:inline-block border-2 border-white text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium font-montserrat text-xs sm:text-sm hover:bg-white hover:text-gold-600 transition-colors duration-200"
                    >
                      {t('discount.banner.signIn')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 rounded-full hover:bg-gold-600 transition-colors duration-200 flex-shrink-0"
            aria-label="Close banner"
          >
            <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-100 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Animated background pattern - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gold-400/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gold-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-gold-400/10 rounded-full animate-pulse delay-500"></div>
      </div>
    </motion.div>
  )
} 