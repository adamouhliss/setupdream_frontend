import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MegaphoneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import { formatMAD } from '../../utils/currency'

interface InfluencerStat {
    id: number
    name: string
    promo_code: string
    commission_rate: number
    total_uses: number
    total_revenue: number
    total_commission: number
}

const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'

export default function AdminInfluencers() {
    const [influencers, setInfluencers] = useState<InfluencerStat[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const { token } = useAuthStore()

    useEffect(() => {
        fetchInfluencerStats()
    }, [token])

    const fetchInfluencerStats = async () => {
        if (!token) return

        try {
            setLoading(true)
            const response = await fetch(`${API_BASE_URL}/influencers/admin/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch influencer statistics')
            const data = await response.json()
            setInfluencers(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const filteredInfluencers = influencers.filter(inf =>
        inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inf.promo_code && inf.promo_code.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold-500/10 rounded-xl">
                            <MegaphoneIcon className="w-8 h-8 text-gold-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-playfair tracking-wide">Influencer KPIs</h1>
                            <p className="text-sm text-gray-400">Track performance metrics across all influencers.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 w-full md:w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl">
                    {error}
                </div>
            )}

            {/* Influencers Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 border-b border-white/5">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Influencer Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Promo Code</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-center">Comm. Rate</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-center">Uses</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-right">Revenue Generated</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gold-400 text-right">Commission Earned</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredInfluencers.length > 0 ? (
                                filteredInfluencers.map((inf) => (
                                    <tr key={inf.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-sm text-white font-medium">
                                            {inf.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-xs font-mono border border-gray-700 inline-block font-bold">
                                                {inf.promo_code || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 text-center">
                                            {inf.commission_rate}%
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white text-center font-bold">
                                            {inf.total_uses}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 text-right font-medium">
                                            {formatMAD(inf.total_revenue)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gold-400 font-bold text-right bg-gold-500/5">
                                            {formatMAD(inf.total_commission)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No influencers found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
