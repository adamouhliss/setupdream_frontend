import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ShoppingBagIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    BellAlertIcon,
    CubeIcon,
    TagIcon,
    ClockIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { format, startOfDay, endOfDay, subDays, eachDayOfInterval } from 'date-fns'
import { formatMAD, formatMADCompact } from '../../utils/currency'
import { useAuthStore } from '../../store/authStore'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
)

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'  // Development
    : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'  // Production

interface Order {
    id: number
    status: 'pending' | 'confirmed' | 'shipped' | 'paid' | 'returned'
    total: number
    shippingInfo: {
        firstName: string
        lastName: string
        email: string
        phone: string
        address: string
        city: string
        postalCode: string
        country: string
    }
    items: Array<{
        productId: number
        productName: string
        quantity: number
        price: number
        total: number
    }>
    createdAt: string
}

interface Product {
    id: number
    name: string
    stock_quantity: number
    low_stock_threshold: number
    is_low_stock: boolean
    needs_reorder: boolean
    view_count: number
    sales_count: number
    price: number
    category?: {
        name: string
    }
}

interface InventoryReport {
    total_products: number
    active_products: number
    total_stock_value: number
    low_stock_alerts: Array<{
        product_id: number
        product_name: string
        current_stock: number
        threshold: number
    }>
    reorder_alerts: Array<{
        product_id: number
        product_name: string
        current_stock: number
        threshold: number
    }>
    out_of_stock_count: number
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const { token, user } = useAuthStore()

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token || !user?.is_superuser) {
                setError('Admin access required')
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Fetch orders, products, and inventory data in parallel
                const [ordersResponse, productsResponse, inventoryResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/orders/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/products/admin/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/products/inventory/report`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ])

                if (!ordersResponse.ok || !productsResponse.ok || !inventoryResponse.ok) {
                    throw new Error('Failed to fetch dashboard data')
                }

                const [ordersData, productsData, inventoryData] = await Promise.all([
                    ordersResponse.json(),
                    productsResponse.json(),
                    inventoryResponse.json()
                ])

                // Format orders data
                const formattedOrders: Order[] = ordersData.map((order: any) => ({
                    id: order.id,
                    status: order.status,
                    total: order.total,
                    shippingInfo: order.shippingInfo,
                    items: order.items,
                    createdAt: order.createdAt,
                }))

                setOrders(formattedOrders)
                setProducts(productsData.items || [])
                setInventoryReport(inventoryData)
                setError(null)
                setLastUpdated(new Date())
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()

        // Refresh every 2 minutes for real-time data
        const interval = setInterval(fetchDashboardData, 120000)
        return () => clearInterval(interval)
    }, [token, user, timeRange])

    // Calculate enhanced statistics
    const getDashboardStats = () => {
        const now = new Date()
        const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        const startDate = subDays(now, daysBack)

        const filteredOrders = orders.filter(order =>
            new Date(order.createdAt) >= startDate
        )

        const previousPeriodOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt)
            return orderDate >= subDays(startDate, daysBack) && orderDate < startDate
        })

        // Revenue calculations
        const currentRevenue = filteredOrders
            .filter(order => order.status === 'paid')
            .reduce((sum, order) => sum + order.total, 0)

        const previousRevenue = previousPeriodOrders
            .filter(order => order.status === 'paid')
            .reduce((sum, order) => sum + order.total, 0)

        const revenueChange = previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue * 100)
            : 0

        // Order calculations
        const currentOrderCount = filteredOrders.length
        const previousOrderCount = previousPeriodOrders.length
        const orderChange = previousOrderCount > 0
            ? ((currentOrderCount - previousOrderCount) / previousOrderCount * 100)
            : 0

        // Conversion rate
        const totalOrders = filteredOrders.length
        const paidOrders = filteredOrders.filter(o => o.status === 'paid').length
        const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders * 100) : 0

        // Previous conversion rate
        const prevTotalOrders = previousPeriodOrders.length
        const prevPaidOrders = previousPeriodOrders.filter(o => o.status === 'paid').length
        const prevConversionRate = prevTotalOrders > 0 ? (prevPaidOrders / prevTotalOrders * 100) : 0
        const conversionChange = prevConversionRate > 0
            ? ((conversionRate - prevConversionRate) / prevConversionRate * 100)
            : 0

        // Average order value
        const avgOrderValue = paidOrders > 0 ? currentRevenue / paidOrders : 0
        const prevAvgOrderValue = prevPaidOrders > 0 ? previousRevenue / prevPaidOrders : 0
        const avgOrderChange = prevAvgOrderValue > 0
            ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue * 100)
            : 0

        return {
            revenue: { value: currentRevenue, change: revenueChange },
            orders: { value: currentOrderCount, change: orderChange },
            conversion: { value: conversionRate, change: conversionChange },
            avgOrder: { value: avgOrderValue, change: avgOrderChange },
            pending: orders.filter(order => order.status === 'pending').length,
            inventory: inventoryReport?.total_stock_value || 0,
            lowStock: inventoryReport?.low_stock_alerts.length || 0,
            outOfStock: inventoryReport?.out_of_stock_count || 0
        }
    }

    const stats = getDashboardStats()

    // Generate sales chart data
    const getSalesChartData = () => {
        const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        const days = eachDayOfInterval({
            start: subDays(new Date(), daysBack - 1),
            end: new Date()
        })

        const salesByDay = days.map(day => {
            const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate >= startOfDay(day) && orderDate <= endOfDay(day) && order.status === 'paid'
            })

            return {
                date: format(day, 'MMM dd'),
                revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
                orders: dayOrders.length
            }
        })

        return {
            labels: salesByDay.map(d => d.date),
            datasets: [
                {
                    label: 'Revenue (MAD)',
                    data: salesByDay.map(d => d.revenue),
                    borderColor: '#EAB308', // gold-500
                    backgroundColor: (context: any) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, 'rgba(234, 179, 8, 0.4)');
                        gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
                        return gradient;
                    },
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#EAB308',
                    pointBorderColor: '#1F2937', // gray-800
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y'
                }
            ]
        }
    }

    // Generate category performance data
    const getCategoryPerformance = () => {
        const categoryStats: { [key: string]: { revenue: number; orders: number } } = {}

        orders.forEach(order => {
            if (order.status === 'paid') {
                order.items.forEach(item => {
                    const product = products.find(p => p.id === item.productId)
                    const category = product?.category?.name || 'Other'

                    if (!categoryStats[category]) {
                        categoryStats[category] = { revenue: 0, orders: 0 }
                    }

                    categoryStats[category].revenue += item.total
                    categoryStats[category].orders += 1
                })
            }
        })

        const sortedCategories = Object.entries(categoryStats)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 5)

        return {
            labels: sortedCategories.map(([name]) => name),
            datasets: [
                {
                    label: 'Revenue by Category',
                    data: sortedCategories.map(([, data]) => data.revenue),
                    backgroundColor: [
                        'rgba(234, 179, 8, 0.8)', // gold-500
                        'rgba(59, 130, 246, 0.8)', // blue-500
                        'rgba(16, 185, 129, 0.8)', // emerald-500
                        'rgba(239, 68, 68, 0.8)',  // red-500
                        'rgba(139, 92, 246, 0.8)', // violet-500
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }
            ]
        }
    }

    const mainStats = [
        {
            title: 'Total Revenue',
            value: formatMADCompact(stats.revenue.value),
            change: `${stats.revenue.change >= 0 ? '+' : ''}${stats.revenue.change.toFixed(1)}%`,
            trend: stats.revenue.change >= 0 ? 'up' : 'down',
            icon: CurrencyDollarIcon,
            bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
            textColor: 'text-green-400',
            period: timeRange
        },
        {
            title: 'Total Orders',
            value: stats.orders.value.toString(),
            change: `${stats.orders.change >= 0 ? '+' : ''}${stats.orders.change.toFixed(1)}%`,
            trend: stats.orders.change >= 0 ? 'up' : 'down',
            icon: ShoppingBagIcon,
            bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
            textColor: 'text-blue-400',
            period: timeRange
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversion.value.toFixed(1)}%`,
            change: `${stats.conversion.change >= 0 ? '+' : ''}${stats.conversion.change.toFixed(1)}%`,
            trend: stats.conversion.change >= 0 ? 'up' : 'down',
            icon: ArrowTrendingUpIcon,
            bgColor: 'bg-white/5',
            textColor: 'text-purple-400',
            period: timeRange
        },
        {
            title: 'Avg Order Value',
            value: formatMADCompact(stats.avgOrder.value),
            change: `${stats.avgOrder.change >= 0 ? '+' : ''}${stats.avgOrder.change.toFixed(1)}%`,
            trend: stats.avgOrder.change >= 0 ? 'up' : 'down',
            icon: ChartBarIcon,
            bgColor: 'bg-gradient-to-br from-gold-500/20 to-gold-600/20',
            textColor: 'text-gold-400',
            period: timeRange
        }
    ]

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#111827',
                titleColor: '#F3F4F6',
                bodyColor: '#D1D5DB',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `${formatMAD(context.raw)}`,
                }
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9CA3AF',
                    callback: (value: any) => formatMADCompact(value),
                    font: {
                        family: 'Inter',
                        size: 10
                    }
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        family: 'Inter',
                        size: 10
                    }
                },
                border: {
                    display: false
                }
            }
        },
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#9CA3AF',
                    font: {
                        family: 'Inter',
                        size: 11
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: '#111827',
                bodyColor: '#D1D5DB',
                borderColor: '#374151',
                borderWidth: 1,
            }
        },
        cutout: '70%',
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gold-900 border-t-gold-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading dashboard data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
                    <p className="text-red-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-900/20"
                    >
                        Retry Request
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-playfair tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 font-light">
                        Overview of your store's performance and activity.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm self-start lg:self-auto">
                    {(['7d', '30d', '90d'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${timeRange === range
                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-900/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 px-2">
                        <ArrowPathIcon className="w-3.5 h-3.5" />
                        <span>Updated {format(lastUpdated, 'HH:mm')}</span>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

                {/* Main Stats Cards */}
                {mainStats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-gray-900/60 transition-colors group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon className={`w-24 h-24 ${stat.textColor}`} />
                        </div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                            </div>
                            <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-white/5 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.title}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Sales Chart - Spans 2 cols on tablet, 3 on desktop */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl md:col-span-2 lg:col-span-3 min-h-[350px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-gold-500" />
                            Revenue Trend
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-gold-500"></span> Revenue
                        </div>
                    </div>
                    <div className="flex-1 w-full h-full min-h-[250px] relative">
                        <Line data={getSalesChartData()} options={chartOptions} />
                    </div>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl md:col-span-2 lg:col-span-1 min-h-[350px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <TagIcon className="w-5 h-5 text-blue-500" />
                            Top Categories
                        </h3>
                    </div>
                    <div className="flex-1 w-full h-full relative flex items-center justify-center">
                        <Doughnut data={getCategoryPerformance()} options={doughnutOptions} />
                    </div>
                </motion.div>

                {/* Inventory Stats - Row of small cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2 lg:col-span-4">
                    <div className="bg-gray-900/60 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <ClockIcon className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{stats.pending}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Pending Orders</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/60 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <CubeIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{formatMADCompact(stats.inventory)}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Inventory Value</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/60 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{stats.lowStock}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Low Stock</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/60 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                            <BellAlertIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{stats.outOfStock}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Out of Stock</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl md:col-span-2 lg:col-span-3 overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-white">Recent Orders</h3>
                        <a href="/admin/orders" className="text-xs font-medium text-gold-400 hover:text-gold-300 flex items-center gap-1">
                            View All <EyeIcon className="w-3 h-3" />
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                                                order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                                                    order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400' :
                                                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-red-500/10 text-red-400'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gold-400">
                                            {formatMAD(order.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="md:col-span-2 lg:col-span-1 space-y-4"
                >
                    <div className="bg-gradient-to-br from-gold-600 to-gold-800 rounded-2xl p-6 shadow-lg shadow-gold-900/20 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                            <CubeIcon className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold font-playfair mb-2">New Product</h3>
                            <p className="text-gold-100 text-sm mb-6">Add a new item to your store inventory.</p>
                            <a href="/admin/products" className="inline-flex items-center px-4 py-2 bg-white text-gold-900 rounded-lg text-sm font-bold hover:bg-gold-50 transition-colors">
                                Add Product
                            </a>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 hover:bg-gray-800 transition-colors">
                        <h3 className="font-bold text-white mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <a href="/admin/orders" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                <span className="text-sm text-gray-300 group-hover:text-white">Process Orders</span>
                                <ArrowUpIcon className="w-4 h-4 text-gray-500 group-hover:text-white rotate-45" />
                            </a>
                            <a href="/admin/users" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                <span className="text-sm text-gray-300 group-hover:text-white">Manage Users</span>
                                <ArrowUpIcon className="w-4 h-4 text-gray-500 group-hover:text-white rotate-45" />
                            </a>
                            <a href="/admin/settings" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                <span className="text-sm text-gray-300 group-hover:text-white">Store Settings</span>
                                <ArrowUpIcon className="w-4 h-4 text-gray-500 group-hover:text-white rotate-45" />
                            </a>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
