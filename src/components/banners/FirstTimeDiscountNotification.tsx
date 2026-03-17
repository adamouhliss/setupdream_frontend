import { motion } from 'framer-motion'
import { XMarkIcon, GiftIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { discountService } from '../../services/discountService'

export default function FirstTimeDiscountNotification() {
  const [isVisible, setIsVisible] = useState(true)
  const { isAuthenticated, user } = useAuthStore()

  // Don't show if not logged in
  if (!isAuthenticated || !user) {
    return null
  }

  // Only show to users who haven't used their first-time discount
  if (!discountService.isEligibleForFirstTimeDiscount(user)) {
    return null
  }

  // Don't show if user dismissed it
  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4 }}
      className="fixed top-20 right-4 z-50 max-w-sm"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl border border-green-400/20 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-1">
                <GiftIcon className="w-6 h-6 text-green-100" />
                <SparklesIcon className="w-5 h-5 text-green-100" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold font-playfair text-lg mb-1">
                  🎉 Your 10% OFF is Ready!
                </h3>
                <p className="font-lora text-green-100 text-sm leading-relaxed">
                  Welcome, {user.first_name}! Your first-time customer discount is automatically applied at checkout.
                </p>
                <div className="mt-2 bg-green-400/20 backdrop-blur-sm rounded-lg p-2">
                  <p className="text-xs font-montserrat font-medium text-green-100">
                    💡 No code needed - discount applies automatically!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="ml-2 p-1 rounded-full hover:bg-green-600 transition-colors duration-200 flex-shrink-0"
              aria-label="Close notification"
            >
              <XMarkIcon className="w-4 h-4 text-green-100 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Animated border */}
        <div className="h-1 bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 animate-pulse"></div>
      </div>
    </motion.div>
  )
} 