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
  CalendarDaysIcon,
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
  ArcElement
)

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

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
          borderColor: 'rgb(217, 171, 24)',
          backgroundColor: 'rgba(217, 171, 24, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: salesByDay.map(d => d.orders),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
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
      .slice(0, 6)

    return {
      labels: sortedCategories.map(([name]) => name),
      datasets: [
        {
          label: 'Revenue by Category',
          data: sortedCategories.map(([, data]) => data.revenue),
          backgroundColor: [
            'rgba(217, 171, 24, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 101, 101, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ],
          borderWidth: 2,
          borderColor: '#fff'
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
      bgColor: 'from-green-400 to-green-600',
      period: timeRange
    },
    { 
      title: 'Total Orders',
      value: stats.orders.value.toString(),
      change: `${stats.orders.change >= 0 ? '+' : ''}${stats.orders.change.toFixed(1)}%`,
      trend: stats.orders.change >= 0 ? 'up' : 'down',
      icon: ShoppingBagIcon,
      bgColor: 'from-blue-400 to-blue-600',
      period: timeRange
    },
    { 
      title: 'Conversion Rate',
      value: `${stats.conversion.value.toFixed(1)}%`,
      change: `${stats.conversion.change >= 0 ? '+' : ''}${stats.conversion.change.toFixed(1)}%`,
      trend: stats.conversion.change >= 0 ? 'up' : 'down',
      icon: ArrowTrendingUpIcon,
      bgColor: 'from-purple-400 to-purple-600',
      period: timeRange
    },
    { 
      title: 'Avg Order Value',
      value: formatMADCompact(stats.avgOrder.value),
      change: `${stats.avgOrder.change >= 0 ? '+' : ''}${stats.avgOrder.change.toFixed(1)}%`,
      trend: stats.avgOrder.change >= 0 ? 'up' : 'down',
      icon: ChartBarIcon,
      bgColor: 'from-gold-400 to-gold-600',
      period: timeRange
    }
  ]

  const secondaryStats = [
    {
      title: 'Pending Orders',
      value: stats.pending.toString(),
      icon: ClockIcon,
      color: stats.pending > 0 ? 'text-yellow-400' : 'text-gray-400',
      bgColor: stats.pending > 0 ? 'bg-yellow-900/30' : 'bg-gray-700'
    },
    {
      title: 'Inventory Value',
      value: formatMADCompact(stats.inventory),
      icon: CubeIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock.toString(),
      icon: ExclamationTriangleIcon,
      color: stats.lowStock > 0 ? 'text-red-400' : 'text-green-400',
      bgColor: stats.lowStock > 0 ? 'bg-red-900/30' : 'bg-green-900/30'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock.toString(),
      icon: BellAlertIcon,
      color: stats.outOfStock > 0 ? 'text-red-400' : 'text-green-400',
      bgColor: stats.outOfStock > 0 ? 'bg-red-900/30' : 'bg-green-900/30'
    }
  ]

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (MAD)',
          color: '#e5e7eb'
        },
        ticks: {
          color: '#e5e7eb'
        },
        grid: {
          color: '#374151'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders Count',
          color: '#e5e7eb'
        },
        ticks: {
          color: '#e5e7eb'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          color: '#e5e7eb'
        },
        grid: {
          color: '#374151'
        }
      }
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb'
        }
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded-lg w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 bg-gray-800 rounded-2xl"></div>
              <div className="h-80 bg-gray-800 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              Analytics 
              <span className="text-gold-gradient"> Dashboard</span>
            </h1>
            <p className="text-gray-300">
              Comprehensive business analytics and insights
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex bg-gray-800 rounded-xl border border-gray-700 p-1">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'text-gray-300 hover:text-gray-100'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
            
            {/* Last Updated */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ArrowPathIcon className="w-4 h-4" />
              <span>Updated {format(lastUpdated, 'HH:mm')}</span>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="stat-card group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-100 mb-1">{stat.value}</h3>
              <p className="text-gray-300 text-sm">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-1">Last {stat.period}</p>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {secondaryStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Sales Trend</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Last {timeRange}</span>
              </div>
            </div>
            <div className="h-80">
              <Line data={getSalesChartData()} options={chartOptions} />
            </div>
          </motion.div>

          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Category Performance</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TagIcon className="w-4 h-4" />
                <span>Revenue Share</span>
              </div>
            </div>
            <div className="h-80">
              <Doughnut data={getCategoryPerformance()} options={doughnutOptions} />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Recent Orders</h2>
              <a 
                href="/admin/orders" 
                className="text-gold-400 hover:text-gold-300 font-medium text-sm flex items-center"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View All
              </a>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 8).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-100">#ORD-{order.id}</span>
                      <span className="text-lg font-bold text-gold-400">{formatMAD(order.total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'paid' ? 'bg-green-900/30 text-green-400 border border-green-600/30' :
                        order.status === 'confirmed' ? 'bg-blue-900/30 text-blue-400 border border-blue-600/30' :
                        order.status === 'shipped' ? 'bg-purple-900/30 text-purple-400 border border-purple-600/30' :
                        order.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-600/30' :
                        'bg-red-900/30 text-red-400 border border-red-600/30'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-100 mb-6">Quick Actions</h2>
            
            <motion.a
              href="/admin/products"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 block hover:shadow-md hover:border-gold-600/50 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-3">
                <CubeIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">Manage Products</h3>
              <p className="text-gray-300 text-sm">View inventory, stock alerts</p>
            </motion.a>

            <motion.a
              href="/admin/orders"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 block hover:shadow-md hover:border-gold-600/50 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-3">
                <ShoppingBagIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">Process Orders</h3>
              <p className="text-gray-300 text-sm">Manage customer orders</p>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full text-left hover:shadow-md hover:border-gold-600/50 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">View Reports</h3>
              <p className="text-gray-300 text-sm">Detailed analytics</p>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 