import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  PhoneIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import { formatMAD } from '../../utils/currency'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
  selectedColor?: string
  selectedSize?: string  // Added selectedSize field
  productImage?: string  // Added productImage field
  total: number
}

interface Order {
  id: number
  customerId: string
  items: OrderItem[]
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
  paymentMethod: string
  subtotal: number
  discountAmount?: number
  discountCode?: string
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'paid' | 'returned'
  createdAt: string
  estimatedDelivery?: string
  notes?: string
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showDetails, setShowDetails] = useState(false)

  // Load user's orders from API
  useEffect(() => {
    const loadUserOrders = async () => {
      if (!user) return

      try {
        // Get auth token from storage
        const authStorage = localStorage.getItem('auth-storage')
        const authData = authStorage ? JSON.parse(authStorage) : null
        const token = authData?.state?.token

        if (!token) {
          console.error('No auth token found')
          return
        }

        // Fetch user's orders from API
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`)
        }

        const apiOrders = await response.json()

        // Convert API format to frontend format
        const frontendOrders = apiOrders.map((order: any) => ({
          id: order.id,
          customerId: order.customerId || user.id.toString(),
          items: order.items,
          shippingInfo: order.shippingInfo,
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          discountAmount: order.discount_amount || 0,
          discountCode: order.discount_code || null,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          estimatedDelivery: order.estimatedDelivery,
          notes: order.notes
        }))

        setOrders(frontendOrders)
        setFilteredOrders(frontendOrders)
      } catch (error) {
        console.error('Failed to load user orders:', error)
        // Fallback to empty array on error
        setOrders([])
        setFilteredOrders([])
      }
    }

    loadUserOrders()
  }, [user])

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order =>
        order.id.toString().includes(query) ||
        order.items.some(item => item.productName.toLowerCase().includes(query))
      )
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'returned': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />
      case 'confirmed': return <PhoneIcon className="w-4 h-4" />
      case 'shipped': return <TruckIcon className="w-4 h-4" />
      case 'paid': return <CheckCircleIcon className="w-4 h-4" />
      case 'returned': return <XCircleIcon className="w-4 h-4" />
      default: return <ClockIcon className="w-4 h-4" />
    }
  }

  const getStatusProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25
      case 'confirmed': return 50
      case 'shipped': return 75
      case 'paid': return 100
      case 'returned': return 0
      default: return 0
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-gold-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-lora">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-400 font-lora">
            Track and manage your order history
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-600 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-montserrat appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="paid">Delivered</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <TruckIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold font-playfair text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400 font-lora mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : "No orders match your search criteria. Try adjusting your filters."
              }
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="btn-primary px-6 py-3 font-montserrat"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl hover:border-gray-600 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold font-montserrat">
                          #{order.id.toString().slice(-3)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-playfair text-white">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-400 font-lora">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium font-montserrat border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowDetails(true)
                        }}
                        className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-montserrat text-gray-400 mb-2">
                      <span>Order Progress</span>
                      <span>{getStatusProgress(order.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-semibold font-montserrat text-gray-200 mb-2">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-600">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = `<span class="text-xs font-semibold font-montserrat text-gray-500">${item.productName.split(' ')[0]}</span>`;
                                  }}
                                />
                              ) : (
                                <span className="text-xs font-semibold font-montserrat text-gray-500">
                                  {item.productName.split(' ')[0]}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium font-playfair text-gray-200 truncate">{item.productName}</p>
                              <p className="text-xs text-gray-400 font-montserrat">
                                {item.selectedColor && `${item.selectedColor} • `}
                                {item.selectedSize && `${item.selectedSize} • `}
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-500 font-montserrat">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h4 className="text-sm font-semibold font-montserrat text-gray-200 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-400 font-lora">
                        <p className="font-medium text-gray-200">
                          {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                        </p>
                        <p>{order.shippingInfo.address}</p>
                        <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                        <p>{order.shippingInfo.country}</p>
                      </div>
                    </div>

                    {/* Total */}
                    <div>
                      <h4 className="text-sm font-semibold font-montserrat text-gray-200 mb-2">Order Total</h4>
                      <div className="space-y-1 text-sm font-lora">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="text-gray-200">{formatMAD(order.subtotal)}</span>
                        </div>

                        {/* First-time customer discount */}
                        {order.discountAmount && order.discountAmount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span className="flex items-center gap-1">
                              🎁 Discount {order.discountCode && `(${order.discountCode})`}:
                            </span>
                            <span>-{formatMAD(order.discountAmount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping:</span>
                          <span className="text-gray-200">
                            {order.shipping === 0 ? 'Free' : formatMAD(order.shipping)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax:</span>
                          <span className="text-gray-200">{formatMAD(order.tax)}</span>
                        </div>
                        <div className="border-t border-gray-600 pt-1 mt-2">
                          <div className="flex justify-between font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-gold-400 text-lg">{formatMAD(order.total)}</span>
                          </div>
                          {order.discountAmount && order.discountAmount > 0 && (
                            <div className="text-xs text-green-400 text-right mt-1">
                              You saved {formatMAD(order.discountAmount)}!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  {order.estimatedDelivery && order.status !== 'paid' && order.status !== 'returned' && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium font-montserrat text-blue-300">
                          Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDetails(false)} />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold font-playfair text-white">
                        Order #{selectedOrder.id}
                      </h2>
                      <p className="text-gray-400 font-lora">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <XCircleIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Detailed Order Items */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold font-playfair text-white mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-600">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = `<span class="text-xs font-semibold font-montserrat text-gray-500">${item.productName.split(' ')[0]}</span>`;
                                }}
                              />
                            ) : (
                              <span className="text-xs font-semibold font-montserrat text-gray-500">
                                {item.productName.split(' ')[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold font-playfair text-white">{item.productName}</h4>
                            <p className="text-sm text-gray-400 font-montserrat">
                              {item.selectedColor && `Color: ${item.selectedColor} • `}
                              {item.selectedSize && `Size: ${item.selectedSize} • `}
                              Qty: {item.quantity} • {formatMAD(item.price)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold font-playfair text-gold-400">
                              {formatMAD(item.total)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary and Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold font-playfair text-white mb-4">Shipping Information</h3>
                      <div className="bg-gray-900/50 rounded-xl p-4 space-y-2 text-sm font-lora border border-gray-700/50">
                        <p className="font-semibold text-white">
                          {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}
                        </p>
                        <p className="text-gray-400">{selectedOrder.shippingInfo.email}</p>
                        <p className="text-gray-400">{selectedOrder.shippingInfo.phone}</p>
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-gray-300">{selectedOrder.shippingInfo.address}</p>
                          <p className="text-gray-300">
                            {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.postalCode}
                          </p>
                          <p className="text-gray-300">{selectedOrder.shippingInfo.country}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-playfair text-white mb-4">Order Summary</h3>
                      <div className="bg-gray-900/50 rounded-xl p-4 space-y-3 text-sm font-lora border border-gray-700/50">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="text-white font-semibold">{formatMAD(selectedOrder.subtotal)}</span>
                        </div>

                        {/* First-time customer discount */}
                        {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span className="flex items-center gap-1">
                              🎁 Discount {selectedOrder.discountCode && `(${selectedOrder.discountCode})`}:
                            </span>
                            <span className="font-semibold">-{formatMAD(selectedOrder.discountAmount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping:</span>
                          <span className="text-white font-semibold">
                            {selectedOrder.shipping === 0 ? 'Free' : formatMAD(selectedOrder.shipping)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax:</span>
                          <span className="text-white font-semibold">{formatMAD(selectedOrder.tax)}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-3">
                          <div className="flex justify-between">
                            <span className="font-bold text-white">Total:</span>
                            <span className="font-bold text-gold-400 text-lg">{formatMAD(selectedOrder.total)}</span>
                          </div>
                          {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                            <div className="text-xs text-green-400 text-right mt-1">
                              You saved {formatMAD(selectedOrder.discountAmount)}!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="btn-primary px-6 py-3 font-montserrat"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 