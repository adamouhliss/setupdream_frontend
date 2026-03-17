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
    FunnelIcon,
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
    selectedSize?: string
    productImage?: string
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
                const authStorage = localStorage.getItem('auth-storage')
                const authData = authStorage ? JSON.parse(authStorage) : null
                const token = authData?.state?.token

                if (!token) return

                const response = await fetch(`${API_BASE_URL}/orders/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`)

                const apiOrders = await response.json()

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
                setOrders([])
                setFilteredOrders([])
            }
        }

        loadOrders()
        const interval = setInterval(loadOrders, 30000)
        return () => clearInterval(interval)
    }, [])

    // Filter orders
    useEffect(() => {
        let filtered = orders

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter)
        }

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
            const authStorage = localStorage.getItem('auth-storage')
            const authData = authStorage ? JSON.parse(authStorage) : null
            const token = authData?.state?.token

            if (!token) return

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

            if (!response.ok) throw new Error(`Failed to update order`)

            await response.json()

            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus, notes: notes || order.notes } : order
            )

            setOrders(updatedOrders)

            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus, notes: notes || selectedOrder.notes })
            }
        } catch (error) {
            console.error('Failed to update order status:', error)
            alert('Failed to update order status')
        }
    }

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20'
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20'
            case 'shipped': return 'bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20'
            case 'paid': return 'bg-green-500/10 text-green-500 ring-1 ring-green-500/20'
            case 'returned': return 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20'
            default: return 'bg-gray-500/10 text-gray-500 ring-1 ring-gray-500/20'
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
            case 'pending': return [{ action: 'confirmed', label: 'Confirm', color: 'blue' }]
            case 'confirmed': return [{ action: 'shipped', label: 'Ship', color: 'purple' }]
            case 'shipped': return [
                { action: 'paid', label: 'Paid', color: 'green' },
                { action: 'returned', label: 'Return', color: 'red' }
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
        <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold font-playfair text-white mb-2">
                        Orders
                    </h1>
                    <p className="text-gray-400 font-light">Track and manage customer orders.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                    { key: 'all', label: 'All', color: 'gray' },
                    { key: 'pending', label: 'Pending', color: 'yellow' },
                    { key: 'confirmed', label: 'Confirmed', color: 'blue' },
                    { key: 'shipped', label: 'Shipped', color: 'purple' },
                    { key: 'paid', label: 'Paid', color: 'green' },
                    { key: 'returned', label: 'Returned', color: 'red' }
                ].map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setStatusFilter(item.key)}
                        className={`p-3 rounded-xl border transition-all duration-200 text-left ${statusFilter === item.key
                            ? 'border-gold-500 bg-gold-500/10'
                            : 'border-white/5 hover:border-white/20 bg-gray-900/40'
                            }`}
                    >
                        <div className={`text-xl font-bold font-playfair ${statusFilter === item.key ? 'text-gold-400' : 'text-white'}`}>
                            {statusCounts[item.key as keyof typeof statusCounts]}
                        </div>
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            {item.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-white/10 text-gray-400">
                        <FunnelIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">{filteredOrders.length} orders</span>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <TruckIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <table className="w-full hidden md:table">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gold-400">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-white">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                                                <p className="text-xs text-gray-500">{order.shippingInfo.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {formatMAD(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center gap-2">
                                                {getNextActions(order.status).map((action) => (
                                                    <button
                                                        key={action.action}
                                                        onClick={() => updateOrderStatus(order.id, action.action as Order['status'])}
                                                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${action.color === 'blue' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                                                            action.color === 'purple' ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' :
                                                                action.color === 'green' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                                                    'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            }`}
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setShowDetails(true)
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4 p-4">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-gray-800/50 rounded-xl border border-white/5 p-4 active:bg-gray-800 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="font-bold text-gold-400">#{order.id}</span>
                                            <p className="font-medium text-white text-sm">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                                        </div>
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm mb-4">
                                        <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="text-white font-bold">{formatMAD(order.total)}</span>
                                    </div>

                                    <div className="flex gap-2 border-t border-white/5 pt-3">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order)
                                                setShowDetails(true)
                                            }}
                                            className="flex-1 py-2 bg-gray-700 rounded-lg text-xs font-medium text-white hover:bg-gray-600"
                                        >
                                            View Details
                                        </button>
                                        {getNextActions(order.status).length > 0 && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, getNextActions(order.status)[0].action as Order['status'])}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold text-white ${getNextActions(order.status)[0].color === 'blue' ? 'bg-blue-600' :
                                                    getNextActions(order.status)[0].color === 'purple' ? 'bg-purple-600' :
                                                        getNextActions(order.status)[0].color === 'green' ? 'bg-green-600' :
                                                            'bg-red-600'
                                                    }`}
                                            >
                                                {getNextActions(order.status)[0].label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {showDetails && selectedOrder && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="min-h-screen px-4 text-center">
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDetails(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="inline-block w-full max-w-4xl my-8 text-left align-middle bg-gray-900 border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden"
                            >
                                {/* Modal Header */}
                                <div className="bg-gray-800/50 p-6 border-b border-white/5 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-playfair mb-1">
                                            Order #{selectedOrder.id}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Customer Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gold-400 mb-4 font-playfair">Customer Details</h3>
                                        <div className="space-y-4 bg-gray-800/30 p-4 rounded-xl border border-white/5">
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-1">Name</label>
                                                <p className="text-white">{selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-1">Email</label>
                                                <p className="text-white">{selectedOrder.shippingInfo.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-1">Phone</label>
                                                <p className="text-white">{selectedOrder.shippingInfo.phone}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block mb-1">Address</label>
                                                <p className="text-white">{selectedOrder.shippingInfo.address}</p>
                                                <p className="text-white">{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gold-400 mb-4 font-playfair">Payment Summary</h3>
                                        <div className="space-y-3 bg-gray-800/30 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Subtotal</span>
                                                <span className="text-white">{formatMAD(selectedOrder.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Shipping</span>
                                                <span className="text-white">{selectedOrder.shipping === 0 ? 'Free' : formatMAD(selectedOrder.shipping)}</span>
                                            </div>
                                            {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                                                <div className="flex justify-between text-sm text-green-400">
                                                    <span>Discount</span>
                                                    <span>-{formatMAD(selectedOrder.discountAmount)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                                                <span className="font-bold text-white">Total</span>
                                                <span className="font-bold text-xl text-gold-400">{formatMAD(selectedOrder.total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="lg:col-span-2">
                                        <h3 className="text-lg font-bold text-gold-400 mb-4 font-playfair">Items ({selectedOrder.items.length})</h3>
                                        <div className="bg-gray-800/30 rounded-xl border border-white/5 overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-white/5 text-gray-400">
                                                    <tr>
                                                        <th className="px-4 py-3">Product</th>
                                                        <th className="px-4 py-3 text-center">Qty</th>
                                                        <th className="px-4 py-3 text-right">Price</th>
                                                        <th className="px-4 py-3 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {selectedOrder.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    {item.productImage && (
                                                                        <img src={item.productImage} className="w-10 h-10 rounded bg-gray-700 object-cover" />
                                                                    )}
                                                                    <div>
                                                                        <p className="font-medium text-white">{item.productName}</p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {item.selectedSize && `Size: ${item.selectedSize}`}
                                                                            {item.selectedColor && ` • Color: ${item.selectedColor}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center text-white">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right text-gray-300">{formatMAD(item.price)}</td>
                                                            <td className="px-4 py-3 text-right font-medium text-gold-400">{formatMAD(item.total)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-gray-800/50 p-6 border-t border-white/5 flex gap-4 justify-end">
                                    <button onClick={() => setShowDetails(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors">
                                        Close
                                    </button>
                                    {getNextActions(selectedOrder.status).map(action => (
                                        <button
                                            key={action.action}
                                            onClick={() => {
                                                updateOrderStatus(selectedOrder.id, action.action as Order['status'])
                                                setShowDetails(false)
                                            }}
                                            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20' :
                                                action.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/20' :
                                                    action.color === 'green' ? 'bg-green-600 hover:bg-green-700 shadow-green-900/20' :
                                                        'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                                                }`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
