import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useTranslation, Trans } from 'react-i18next'
import { formatMAD } from '../../utils/currency'
import { format } from 'date-fns'
import {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    BanknotesIcon,
    TagIcon,
    ClockIcon
} from '@heroicons/react/24/outline'

const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'

interface DashboardStats {
    total_revenue: number
    total_commission: number
    total_uses: number
    commission_rate: number
    customer_discount_rate: number
    recent_orders: any[]
}

export default function InfluencerDashboard() {
    const { user, token } = useAuthStore()
    const { t } = useTranslation()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return

            try {
                const response = await fetch(`${API_BASE_URL}/influencers/dashboard-stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats')
                }

                const data = await response.json()
                setStats(data)
            } catch (err) {
                console.error('Error fetching influencer stats:', err)
                setError(t('influencerDashboard.error'))
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [token])

    if (!user?.is_influencer) {
        return (
            <div className="min-h-screen bg-gray-900 px-4 py-20 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3.L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold font-playfair text-white">{t('influencerDashboard.accessDenied.title')}</h1>
                    <p className="text-gray-400">{t('influencerDashboard.accessDenied.message')}</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 px-4 py-20 flex justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-2">
                            {t('influencerDashboard.header.title')}
                        </h1>
                        <p className="text-gray-400 font-lora">
                            {t('influencerDashboard.header.subtitle', { name: user.first_name })}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <div className="bg-gray-800/80 backdrop-blur-sm border border-gold-500/20 px-6 py-4 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
                            <p className="text-xs text-gold-400 font-medium mb-1 uppercase tracking-wider">{t('influencerDashboard.header.promoCode')}</p>
                            <div className="flex items-center gap-3">
                                <TagIcon className="w-6 h-6 text-gold-500" />
                                <span className="text-2xl font-bold font-montserrat text-white tracking-widest">{user.promo_code}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            {
                                title: t('influencerDashboard.stats.revenue'),
                                value: formatMAD(stats.total_revenue || 0),
                                icon: CurrencyDollarIcon,
                                color: 'text-blue-400',
                                bg: 'bg-blue-500/10',
                                border: 'border-blue-500/20'
                            },
                            {
                                title: t('influencerDashboard.stats.commission'),
                                value: formatMAD(stats.total_commission || 0),
                                icon: BanknotesIcon,
                                color: 'text-green-400',
                                bg: 'bg-green-500/10',
                                border: 'border-green-500/20'
                            },
                            {
                                title: t('influencerDashboard.stats.uses'),
                                value: (stats.total_uses || 0).toString(),
                                icon: ShoppingCartIcon,
                                color: 'text-purple-400',
                                bg: 'bg-purple-500/10',
                                border: 'border-purple-500/20'
                            },
                            {
                                title: t('influencerDashboard.stats.structure'),
                                value: `${stats.commission_rate}% / ${stats.customer_discount_rate}%`,
                                subtext: t('influencerDashboard.stats.structureSubtext'),
                                icon: TagIcon,
                                color: 'text-gold-400',
                                bg: 'bg-gold-500/10',
                                border: 'border-gold-500/20'
                            }
                        ].map((stat, idx) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border ${stat.border} shadow-lg relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 p-4 opacity-20 ${stat.color}`}>
                                    <stat.icon className="w-16 h-16 -mr-4 -mt-4" />
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 relative z-10`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium mb-1 relative z-10">{stat.title}</p>
                                <p className="text-2xl font-bold font-montserrat text-white relative z-10">{stat.value}</p>
                                {stat.subtext && <p className="text-xs text-gray-500 mt-1 relative z-10">{stat.subtext}</p>}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Recent Orders List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700 p-6 md:p-8 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold font-playfair text-white mb-1">{t('influencerDashboard.referrals.title')}</h2>
                            <p className="text-gray-400 text-sm">{t('influencerDashboard.referrals.subtitle')}</p>
                        </div>
                        <ClockIcon className="w-8 h-8 text-gray-600" />
                    </div>

                    {!stats?.recent_orders || stats.recent_orders.length === 0 ? (
                        <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-700/50 border-dashed">
                            <ShoppingCartIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">{t('influencerDashboard.referrals.empty.title')}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                <Trans i18nKey="influencerDashboard.referrals.empty.message" values={{ code: user.promo_code }} components={{ strong: <strong className="text-gold-400" /> }} />
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left bg-transparent">
                                <thead className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">{t('influencerDashboard.referrals.table.orderId')}</th>
                                        <th className="px-6 py-4 font-medium">{t('influencerDashboard.referrals.table.date')}</th>
                                        <th className="px-6 py-4 font-medium">{t('influencerDashboard.referrals.table.customer')}</th>
                                        <th className="px-6 py-4 font-medium">{t('influencerDashboard.referrals.table.total')}</th>
                                        <th className="px-6 py-4 font-medium text-right">{t('influencerDashboard.referrals.table.commission')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {stats.recent_orders.map((order, idx) => {
                                        const commissionEarned = order.total * (stats.commission_rate / 100);
                                        return (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + (idx * 0.05) }}
                                                className="hover:bg-gray-700/20 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                                    #{order.id.toString().padStart(6, '0')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {order.customer_name || 'Guest User'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                                                    {formatMAD(order.total)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400 text-right bg-green-500/5">
                                                    +{formatMAD(commissionEarned)}
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
