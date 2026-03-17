import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  ClockIcon, 
  ExclamationTriangleIcon, 
  FireIcon,
  EyeIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface UrgencyIndicatorsProps {
  stockQuantity?: number
  viewersCount?: number
  soldCount?: number
  isLimitedTime?: boolean
  freeShippingThreshold?: number
  currentCartValue?: number
  productId?: number
  compact?: boolean
}

export default function UrgencyIndicators({
  stockQuantity = 10,
  viewersCount = Math.floor(Math.random() * 15) + 3,
  soldCount = Math.floor(Math.random() * 50) + 10,
  isLimitedTime = false,
  freeShippingThreshold = 500,
  currentCartValue = 0,
  productId = 1,
  compact = false
}: UrgencyIndicatorsProps) {
  const { t } = useTranslation()
  const [timeRemaining, setTimeRemaining] = useState('')
  const isLowStock = stockQuantity <= 5
  const remainingForFreeShipping = freeShippingThreshold - currentCartValue

  const generateRandomCountdown = () => {
    const seed = productId || Math.floor(Math.random() * 1000)
    const randomDays = (seed % 7) + 1
    const randomHours = (seed * 3) % 24
    const randomMinutes = (seed * 7) % 60
    const now = new Date()
    const endTime = new Date(now.getTime() + (randomDays * 24 * 60 * 60 * 1000) + (randomHours * 60 * 60 * 1000) + (randomMinutes * 60 * 1000))
    return endTime
  }

  const calculateTimeRemaining = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return t('urgency.saleEndingSoon')
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (compact) {
      if (days > 0) return `${days}d ${hours}h`
      if (hours > 0) return `${hours}h ${minutes}m`
      return `${minutes}m`
    } else {
      if (days > 0) return `${days} ${days > 1 ? t('time.days') : t('time.day')}, ${hours} ${hours > 1 ? t('time.hours') : t('time.hour')}`
      if (hours > 0) return `${hours} ${hours > 1 ? t('time.hours') : t('time.hour')}, ${minutes} ${minutes > 1 ? t('time.minutes') : t('time.minute')}`
      return `${minutes} ${minutes > 1 ? t('time.minutes') : t('time.minute')}`
    }
  }

  useEffect(() => {
    if (!isLimitedTime) return
    
    const endTime = generateRandomCountdown()
    setTimeRemaining(calculateTimeRemaining(endTime))
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(endTime))
    }, 60000)
    
    return () => clearInterval(interval)
  }, [isLimitedTime, productId, compact])

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {isLowStock && (
          <span className="bg-red-500 text-white text-xs font-bold font-montserrat px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <ExclamationTriangleIcon className="w-3 h-3" />
            <span>{stockQuantity} left</span>
          </span>
        )}
        
        <span className="bg-blue-500 text-white text-xs font-bold font-montserrat px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          <EyeIcon className="w-3 h-3" />
          <span>{viewersCount}</span>
        </span>

        {isLimitedTime && (
          <span className="bg-orange-500 text-white text-xs font-bold font-montserrat px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            <span>{timeRemaining}</span>
          </span>
        )}

        {soldCount > 30 && (
          <span className="bg-gold-500 text-white text-xs font-bold font-montserrat px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <FireIcon className="w-3 h-3" />
            <span>Hot</span>
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {isLowStock && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-3"
        >
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-semibold text-sm">
                {t('urgency.lowStock', { count: stockQuantity })}
              </p>
              <p className="text-red-600 text-xs">
                {t('urgency.highDemand')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-3"
      >
        <div className="flex items-center gap-2">
          <EyeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium text-sm">
              {t('urgency.viewersCount', { count: viewersCount })}
            </p>
            <p className="text-blue-600 text-xs">
              {t('urgency.soldInLast24h', { count: soldCount })}
            </p>
          </div>
        </div>
      </motion.div>

      {isLimitedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-3"
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-orange-500 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-orange-800 font-semibold text-sm">
                {t('urgency.limitedTimeOffer')}
              </p>
              <p className="text-orange-600 text-xs font-medium">
                {timeRemaining ? t('urgency.saleEndsIn', { time: timeRemaining }) : t('urgency.saleEndingSoon')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {remainingForFreeShipping > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 border border-green-200 rounded-xl p-3"
        >
          <div className="flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium text-sm">
                {t('urgency.addForFreeShipping', { amount: remainingForFreeShipping })}
              </p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((currentCartValue / freeShippingThreshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {soldCount > 30 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gold-50 border border-gold-200 rounded-xl p-3"
        >
          <div className="flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-gold-500 flex-shrink-0" />
            <div>
              <p className="text-gold-800 font-semibold text-sm">
                {t('urgency.bestSeller')}
              </p>
              <p className="text-gold-600 text-xs">
                {t('urgency.topRated')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 