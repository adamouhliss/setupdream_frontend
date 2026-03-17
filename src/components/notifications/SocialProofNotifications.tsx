import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import { formatMAD } from '../../utils/currency'

interface PurchaseNotification {
  id: string
  customerName: string
  productName: string
  location: string
  timeAgo: string
  amount?: string
}

// Moroccan cities for realistic locations
const moroccanCities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tangier', 'Agadir', 
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'Mohammedia'
]

// Common Moroccan names
const moroccanNames = [
  'Ahmed M.', 'Fatima K.', 'Youssef B.', 'Aicha L.', 'Omar R.', 'Laila S.',
  'Hassan T.', 'Khadija N.', 'Rachid H.', 'Samira A.', 'Karim Z.', 'Nadia F.',
  'Mohamed E.', 'Zineb M.', 'Abderrahim D.', 'Malika C.'
]

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<DatabaseProduct[]>([])

  // Fetch real products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts({ limit: 20 })
        setAvailableProducts(response.items)
      } catch (error) {
        console.error('Failed to fetch products for notifications:', error)
      }
    }

    fetchProducts()
  }, [])

  const generateNotification = (): PurchaseNotification => {
    const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)]
    const customerName = moroccanNames[Math.floor(Math.random() * moroccanNames.length)]
    const location = moroccanCities[Math.floor(Math.random() * moroccanCities.length)]
    const minutesAgo = Math.floor(Math.random() * 30) + 1
    
    // Calculate price (use sale price if available)
    const price = randomProduct?.sale_price || randomProduct?.price || 299
    
    return {
      id: `${Date.now()}-${Math.random()}`,
      customerName,
      productName: randomProduct?.name || 'Sports Equipment',
      location,
      timeAgo: `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`,
      amount: formatMAD(price)
    }
  }

  useEffect(() => {
    if (availableProducts.length === 0) return

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(() => {
      showNextNotification()
    }, 3000)

    return () => clearTimeout(initialTimer)
  }, [availableProducts])

  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 6 seconds
      const hideTimer = setTimeout(() => {
        hideNotification()
      }, 6000)

      return () => clearTimeout(hideTimer)
    }
  }, [isVisible])

  const showNextNotification = () => {
    if (availableProducts.length === 0) return

    const notification = generateNotification()
    setCurrentNotification(notification)
    setIsVisible(true)
    
    // Schedule next notification
    setTimeout(() => {
      if (!isVisible) {
        showNextNotification()
      }
    }, Math.random() * 30000 + 20000) // Random interval between 20-50 seconds
  }

  const hideNotification = () => {
    setIsVisible(false)
    setCurrentNotification(null)
    
    // Schedule next notification
    setTimeout(() => {
      showNextNotification()
    }, Math.random() * 30000 + 15000) // Random interval between 15-45 seconds
  }

  if (!currentNotification || availableProducts.length === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -400, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            mass: 1
          }}
          className="fixed bottom-6 left-6 z-50 max-w-sm w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-semibold">Recent Purchase</span>
                <button
                  onClick={hideNotification}
                  className="ml-auto text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-gold-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm leading-tight">
                    <span className="font-semibold">{currentNotification.customerName}</span> from{' '}
                    <span className="text-gold-600 font-medium">{currentNotification.location}</span>
                  </p>
                  
                  <p className="text-gray-600 text-sm mt-1 leading-tight">
                    purchased <span className="font-medium text-gray-900">{currentNotification.productName}</span>
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{currentNotification.timeAgo}</span>
                    {currentNotification.amount && (
                      <span className="text-sm font-bold text-green-600">{currentNotification.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 