import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  PhoneIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
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

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface Order {
  id: number
  customerId: string
  items: OrderItem[]
  shippingInfo: ShippingInfo
  paymentMethod: string
  subtotal: number
  discountAmount?: number
  discountCode?: string
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'paid' | 'returned'
  createdAt: string
  estimatedDelivery: string
  notes?: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showDetails, setShowDetails] = useState(false)

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Get auth token from storage
        const authStorage = localStorage.getItem('auth-storage')
        const authData = authStorage ? JSON.parse(authStorage) : null
        const token = authData?.state?.token

        if (!token) {
          console.error('No auth token found')
          return
        }

        // Fetch orders from API
        const response = await fetch(`${API_BASE_URL}/orders/`, {
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
          customerId: order.customerId || 'guest',
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
        console.error('Failed to load orders:', error)
        // Fallback to empty array on error
        setOrders([])
        setFilteredOrders([])
      }
    }

    loadOrders()
    // Refresh every 30 seconds to catch new orders
    const interval = setInterval(loadOrders, 30000)
    return () => clearInterval(interval)
  }, [])

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
        order.shippingInfo.firstName.toLowerCase().includes(query) ||
        order.shippingInfo.lastName.toLowerCase().includes(query) ||
        order.shippingInfo.email.toLowerCase().includes(query) ||
        order.shippingInfo.phone.includes(query)
      )
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const updateOrderStatus = async (orderId: number, newStatus: Order['status'], notes?: string) => {
    try {
      // Get auth token from storage
      const authStorage = localStorage.getItem('auth-storage')
      const authData = authStorage ? JSON.parse(authStorage) : null
      const token = authData?.state?.token

      if (!token) {
        console.error('No auth token found')
        return
      }

      // Update order via API
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`)
      }

      await response.json()

      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus, 
              notes: notes || order.notes 
            }
          : order
      )
      
      setOrders(updatedOrders)
      
      // Update selected order if it's currently viewed
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ 
          ...selectedOrder, 
          status: newStatus, 
          notes: notes || selectedOrder.notes 
        })
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30'
      case 'confirmed': return 'bg-blue-900/30 text-blue-400 border-blue-600/30'
      case 'shipped': return 'bg-purple-900/30 text-purple-400 border-purple-600/30'
      case 'paid': return 'bg-green-900/30 text-green-400 border-green-600/30'
      case 'returned': return 'bg-red-900/30 text-red-400 border-red-600/30'
      default: return 'bg-gray-700 text-gray-300 border-gray-600'
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

  const getNextActions = (status: Order['status']) => {
    switch (status) {
      case 'pending': return [{ action: 'confirmed', label: 'Confirm Order', color: 'blue' }]
      case 'confirmed': return [{ action: 'shipped', label: 'Mark as Shipped', color: 'purple' }]
      case 'shipped': return [
        { action: 'paid', label: 'Mark as Paid', color: 'green' },
        { action: 'returned', label: 'Mark as Returned', color: 'red' }
      ]
      default: return []
    }
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    paid: orders.filter(o => o.status === 'paid').length,
    returned: orders.filter(o => o.status === 'returned').length,
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-playfair text-gray-100 mb-2">
            Order Management
          </h1>
          <p className="text-gray-300 font-lora">Manage all customer orders and track their status</p>
        </motion.div>

        {/* Status Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
        >
          {[
            { key: 'all', label: 'All Orders', color: 'gray' },
            { key: 'pending', label: 'Pending', color: 'yellow' },
            { key: 'confirmed', label: 'Confirmed', color: 'blue' },
            { key: 'shipped', label: 'Shipped', color: 'purple' },
            { key: 'paid', label: 'Paid', color: 'green' },
            { key: 'returned', label: 'Returned', color: 'red' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                statusFilter === item.key
                  ? 'border-gold-500 bg-gold-900/20'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800'
              }`}
            >
              <div className="text-2xl font-bold font-playfair text-gray-100">
                {statusCounts[item.key as keyof typeof statusCounts]}
              </div>
              <div className="text-sm font-medium font-montserrat text-gray-300">
                {item.label}
              </div>
            </button>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 font-lora text-gray-100 bg-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium font-montserrat text-gray-300">
                {filteredOrders.length} orders
              </span>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 overflow-hidden"
        >
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold font-playfair text-gray-100 mb-2">No orders found</h3>
              <p className="text-gray-300 font-lora">
                {statusFilter !== 'all' 
                  ? `No orders with status "${statusFilter}" found.`
                  : 'No orders have been placed yet.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold font-montserrat text-gold-400">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold font-playfair text-gray-100">
                            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                          </p>
                          <p className="text-sm text-gray-300 font-lora">{order.shippingInfo.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-montserrat text-gray-300">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-bold font-playfair text-gray-100">
                            {formatMAD(order.total)}
                          </span>
                          {order.discountAmount && order.discountAmount > 0 && (
                            <div className="text-xs text-green-400 font-montserrat">
                              🎁 -{formatMAD(order.discountAmount)} saved
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium font-montserrat border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-montserrat text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowDetails(true)
                            }}
                            className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gold-900/20 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          
                          {getNextActions(order.status).map((action) => (
                            <button
                              key={action.action}
                              onClick={() => updateOrderStatus(order.id, action.action as Order['status'])}
                              className={`px-3 py-1 text-xs font-medium font-montserrat rounded-lg transition-colors duration-200 ${
                                action.color === 'blue' ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-600/30' :
                                action.color === 'purple' ? 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50 border border-purple-600/30' :
                                action.color === 'green' ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-600/30' :
                                action.color === 'red' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-600/30' :
                                'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {showDetails && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={() => setShowDetails(false)}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold font-playfair text-gray-100">
                          Order #{selectedOrder.id}
                        </h2>
                        <p className="text-gray-300 font-lora">
                          Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium font-montserrat border ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Customer Information */}
                      <div>
                        <h3 className="text-lg font-bold font-playfair text-gray-100 mb-4">Customer Information</h3>
                        <div className="space-y-3 text-sm font-lora">
                          <div>
                            <span className="font-medium text-gray-400">Name:</span>
                            <span className="ml-2 text-gray-100">
                              {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Email:</span>
                            <span className="ml-2 text-gray-100">{selectedOrder.shippingInfo.email}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Phone:</span>
                            <span className="ml-2 text-gray-100">{selectedOrder.shippingInfo.phone}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Address:</span>
                            <span className="ml-2 text-gray-100">
                              {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.postalCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h3 className="text-lg font-bold font-playfair text-gray-100 mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm font-lora">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Subtotal:</span>
                            <span className="text-gray-100 font-semibold">{formatMAD(selectedOrder.subtotal)}</span>
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
                            <span className="text-gray-100 font-semibold">
                              {selectedOrder.shipping === 0 ? 'Free' : formatMAD(selectedOrder.shipping)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tax:</span>
                            <span className="text-gray-100 font-semibold">{formatMAD(selectedOrder.tax)}</span>
                          </div>
                          <div className="border-t border-gray-600 pt-3">
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-100">Total:</span>
                              <span className="font-bold text-gold-400 text-lg">{formatMAD(selectedOrder.total)}</span>
                            </div>
                            {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                              <div className="text-xs text-green-400 text-right mt-1">
                                Customer saved {formatMAD(selectedOrder.discountAmount)}!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-8">
                      <h3 className="text-lg font-bold font-playfair text-gray-100 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-gray-700 rounded-xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.productImage ? (
                                <img 
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = `<span class="text-xs font-semibold font-montserrat text-gray-300">${item.productName.split(' ')[0]}</span>`;
                                  }}
                                />
                              ) : (
                                <span className="text-xs font-semibold font-montserrat text-gray-300">
                                  {item.productName.split(' ')[0]}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold font-playfair text-gray-100">{item.productName}</h4>
                              <p className="text-sm text-gray-300 font-montserrat">
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

                    {/* Status Actions */}
                    <div className="mt-8 flex gap-4">
                      {getNextActions(selectedOrder.status).map((action) => (
                        <button
                          key={action.action}
                          onClick={() => {
                            updateOrderStatus(selectedOrder.id, action.action as Order['status'])
                            setShowDetails(false)
                          }}
                          className={`px-6 py-3 font-medium font-montserrat rounded-xl transition-colors duration-200 ${
                            action.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                            action.color === 'purple' ? 'bg-purple-600 text-white hover:bg-purple-700' :
                            action.color === 'green' ? 'bg-green-600 text-white hover:bg-green-700' :
                            action.color === 'red' ? 'bg-red-600 text-white hover:bg-red-700' :
                            'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowDetails(false)}
                        className="px-6 py-3 bg-gray-600 text-gray-300 font-medium font-montserrat rounded-xl hover:bg-gray-700 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 