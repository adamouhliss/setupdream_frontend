import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  ArrowPathIcon,
  StarIcon,
  LockClosedIcon,
  CheckBadgeIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

interface TrustBadgesProps {
  layout?: 'horizontal' | 'vertical' | 'grid'
  showAll?: boolean
}

export default function TrustBadges({ 
  layout = 'vertical',
  showAll = true 
}: TrustBadgesProps) {
  
  const badges = [
    {
      icon: ShieldCheckIcon,
      title: '100% Secure Payment',
      subtitle: 'SSL encryption & fraud protection',
      color: 'green'
    },
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      subtitle: 'On orders over 500 MAD',
      color: 'blue'
    },
    {
      icon: ArrowPathIcon,
      title: '30-Day Returns',
      subtitle: 'Easy returns & exchanges',
      color: 'purple'
    },
    {
      icon: CheckBadgeIcon,
      title: 'Quality Guaranteed',
      subtitle: 'Premium gaming components',
      color: 'gold'
    },
    {
      icon: StarIcon,
      title: '5-Star Rated',
      subtitle: 'Trusted by 10,000+ customers',
      color: 'yellow'
    },
    {
      icon: GiftIcon,
      title: 'Gift Wrapping',
      subtitle: 'Free gift wrapping available',
      color: 'pink'
    }
  ]

  const displayBadges = showAll ? badges : badges.slice(0, 4)

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4'
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 gap-4'
      default:
        return 'space-y-3'
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      gold: 'bg-gold-50 border-gold-200 text-gold-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      pink: 'bg-pink-50 border-pink-200 text-pink-700'
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="w-full">
      <div className={getLayoutClasses()}>
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              ${getColorClasses(badge.color)}
              border rounded-xl p-4 flex items-center gap-3
              ${layout === 'horizontal' ? 'flex-1 min-w-fit' : ''}
            `}
          >
            <badge.icon className="w-6 h-6 flex-shrink-0" />
            <div className={layout === 'horizontal' ? 'text-center' : ''}>
              <h4 className="font-semibold text-sm">{badge.title}</h4>
              <p className="text-xs opacity-80 mt-0.5">{badge.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <LockClosedIcon className="w-4 h-4" />
          <span className="text-xs">
            Your personal information is protected by 256-bit SSL encryption
          </span>
        </div>
      </motion.div>
    </div>
  )
} 