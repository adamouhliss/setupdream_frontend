import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  ExclamationTriangleIcon,
  CubeIcon,
  ArrowPathIcon,
  BellAlertIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
  PlusIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import { formatMAD } from '../../utils/currency'
import { format } from 'date-fns'
import LanguageSwitcher from '../../components/LanguageSwitcher'

interface Product {
  id: number
  name: string
  sku: string
  stock_quantity: number
  low_stock_threshold: number
  reorder_level: number
  max_stock_level?: number
  price: number
  cost_price?: number
  is_low_stock: boolean
  needs_reorder: boolean
  category?: {
    name: string
  }
  subcategory?: {
    name: string
  }
  last_restocked?: string
  sales_count: number
  view_count: number
}

interface InventoryAlert {
  product_id: number
  product_name: string
  current_stock: number
  threshold: number
  category?: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

interface RestockModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onRestock: (productId: number, quantity: number, cost?: number) => void
}

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'  // Production

function RestockModal({ product, isOpen, onClose, onRestock }: RestockModalProps) {
  const [quantity, setQuantity] = useState('')
  const [cost, setCost] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !quantity) return

    onRestock(product.id, parseInt(quantity), cost ? parseFloat(cost) : undefined)
    setQuantity('')
    setCost('')
    onClose()
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-gray-100 mb-4">
          Restock {product.name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity to Add *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cost Price per Unit (MAD)
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              step="0.01"
              min="0"
              placeholder="Optional"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Restock
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

interface ThresholdModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onUpdateThresholds: (productId: number, lowStockThreshold: number, reorderLevel: number) => void
}

function ThresholdModal({ product, isOpen, onClose, onUpdateThresholds }: ThresholdModalProps) {
  const [lowStockThreshold, setLowStockThreshold] = useState('')
  const [reorderLevel, setReorderLevel] = useState('')

  useEffect(() => {
    if (product) {
      setLowStockThreshold(product.low_stock_threshold.toString())
      setReorderLevel(product.reorder_level.toString())
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !lowStockThreshold || !reorderLevel) return

    onUpdateThresholds(product.id, parseInt(lowStockThreshold), parseInt(reorderLevel))
    onClose()
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-gray-100 mb-4">
          Edit Thresholds: {product.name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Low Stock Threshold *
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400"
              placeholder="When to show low stock warning"
            />
            <p className="text-xs text-gray-400 mt-1">
              Alert when stock falls below this level
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reorder Level *
            </label>
            <input
              type="number"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400"
              placeholder="When to reorder stock"
            />
            <p className="text-xs text-gray-400 mt-1">
              Critical alert when stock falls below this level
            </p>
          </div>

          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Current Stock:</strong> {product.stock_quantity} units
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Update Thresholds
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

interface DetailsModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

function DetailsModal({ product, isOpen, onClose }: DetailsModalProps) {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-100 font-playfair">
            Product Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-300 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100 font-playfair">Basic Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-400">Product Name</p>
                <p className="text-gray-100 font-playfair">{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">SKU</p>
                <p className="text-gray-100 font-mono">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Category</p>
                <p className="text-gray-100 font-playfair">{product.category?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Subcategory</p>
                <p className="text-gray-100 font-playfair">{product.subcategory?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Inventory Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100 font-playfair">Inventory</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-400">Current Stock</p>
                <p className="text-2xl font-bold text-gray-100 font-playfair">{product.stock_quantity} units</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Low Stock Threshold</p>
                <p className="text-gray-100 font-playfair">{product.low_stock_threshold} units</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Reorder Level</p>
                <p className="text-gray-100 font-playfair">{product.reorder_level} units</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Last Restocked</p>
                <p className="text-gray-100 font-playfair">
                  {product.last_restocked 
                    ? format(new Date(product.last_restocked), 'MMM dd, yyyy')
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100 font-playfair">Pricing</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-400">Selling Price</p>
                <p className="text-lg font-semibold text-gray-100 font-playfair">{formatMAD(product.price)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Cost Price</p>
                <p className="text-gray-100 font-playfair">{formatMAD(product.cost_price || 0)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Stock Value</p>
                <p className="text-lg font-semibold text-green-400 font-playfair">
                  {formatMAD(product.stock_quantity * (product.cost_price || product.price))}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100 font-playfair">Performance</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Sales</p>
                <p className="text-gray-100 font-playfair">{product.sales_count} units sold</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Page Views</p>
                <p className="text-gray-100 font-playfair">{product.view_count} views</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Status</p>
                <div className="flex gap-2">
                  {product.is_low_stock && (
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full border border-yellow-600/30">
                      Low Stock
                    </span>
                  )}
                  {product.needs_reorder && (
                    <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full border border-red-600/30">
                      Needs Reorder
                    </span>
                  )}
                  {product.stock_quantity === 0 && (
                    <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full border border-red-600/30">
                      Out of Stock
                    </span>
                  )}
                  {!product.is_low_stock && !product.needs_reorder && product.stock_quantity > 0 && (
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-600/30">
                      In Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-600 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminInventory() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'low_stock' | 'out_of_stock' | 'needs_reorder'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false)
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/admin/all?include_inventory=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.items || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleRestock = async (productId: number, quantity: number, cost?: number) => {
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity,
          cost_price: cost
        })
      })

      if (!response.ok) {
        throw new Error('Failed to restock product')
      }

      await fetchProducts()
    } catch (err) {
      console.error('Failed to restock product:', err)
      setError(err instanceof Error ? err.message : 'Failed to restock product')
    }
  }

  const handleUpdateThresholds = async (productId: number, lowStockThreshold: number, reorderLevel: number) => {
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          low_stock_threshold: lowStockThreshold,
          reorder_level: reorderLevel
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update thresholds')
      }

      await fetchProducts()
      setIsThresholdModalOpen(false)
      setSelectedProduct(null)
    } catch (err) {
      console.error('Failed to update thresholds:', err)
      setError(err instanceof Error ? err.message : 'Failed to update thresholds')
    }
  }

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'low_stock' ? product.is_low_stock :
      filterStatus === 'out_of_stock' ? product.stock_quantity === 0 :
      filterStatus === 'needs_reorder' ? product.needs_reorder : true

    return matchesSearch && matchesFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Generate alerts
  const generateAlerts = (): InventoryAlert[] => {
    const alerts: InventoryAlert[] = []
    
    products.forEach(product => {
      if (product.stock_quantity === 0) {
        alerts.push({
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock_quantity,
          threshold: 0,
          category: product.category?.name,
          urgency: 'critical'
        })
      } else if (product.needs_reorder) {
        alerts.push({
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock_quantity,
          threshold: product.reorder_level,
          category: product.category?.name,
          urgency: 'high'
        })
      } else if (product.is_low_stock) {
        alerts.push({
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock_quantity,
          threshold: product.low_stock_threshold,
          category: product.category?.name,
          urgency: product.stock_quantity <= product.low_stock_threshold / 2 ? 'medium' : 'low'
        })
      }
    })

    return alerts.sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    })
  }

  const alerts = generateAlerts()

  const inventoryStats = {
    total: products.length,
    lowStock: products.filter(p => p.is_low_stock).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    needsReorder: products.filter(p => p.needs_reorder).length,
    totalValue: products.reduce((sum, p) => sum + (p.stock_quantity * (p.cost_price || p.price)), 0)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-900/30 text-red-400 border-red-600/30'
      case 'high': return 'bg-orange-900/30 text-orange-400 border-orange-600/30'
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30'
      case 'low': return 'bg-blue-900/30 text-blue-400 border-blue-600/30'
      default: return 'bg-gray-700 text-gray-300 border-gray-600'
    }
  }

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) return { label: 'Out of Stock', color: 'text-red-400 bg-red-900/30 border border-red-600/30' }
    if (product.needs_reorder) return { label: 'Needs Reorder', color: 'text-orange-400 bg-orange-900/30 border border-orange-600/30' }
    if (product.is_low_stock) return { label: 'Low Stock', color: 'text-yellow-400 bg-yellow-900/30 border border-yellow-600/30' }
    return { label: 'In Stock', color: 'text-green-400 bg-green-900/30 border border-green-600/30' }
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
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
            <h1 className="text-4xl font-bold text-gray-100 mb-2 font-playfair">
              {t('admin.inventoryManagement')} <span className="text-gold-400">Management</span>
            </h1>
            <p className="text-gray-300 font-lora">Monitor stock levels and manage inventory alerts</p>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={fetchProducts}
              className="bg-gold-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gold-700 transition-colors flex items-center gap-2 font-montserrat"
            >
              <ArrowPathIcon className="w-5 h-5" />
              {t('admin.refresh')}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { title: 'Total Products', value: inventoryStats.total, icon: CubeIcon, color: 'blue' },
            { title: 'Low Stock', value: inventoryStats.lowStock, icon: ExclamationTriangleIcon, color: 'yellow' },
            { title: 'Out of Stock', value: inventoryStats.outOfStock, icon: XCircleIcon, color: 'red' },
            { title: 'Needs Reorder', value: inventoryStats.needsReorder, icon: BellAlertIcon, color: 'orange' },
            { title: 'Inventory Value', value: formatMAD(inventoryStats.totalValue), icon: ChartBarIcon, color: 'green' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-100 font-playfair">{stat.value}</p>
                  <p className="text-gray-300 text-sm font-montserrat">{stat.title}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-900/30 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <BellAlertIcon className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-gray-100 font-playfair">Inventory Alerts</h2>
              <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded-full text-xs font-medium border border-red-600/30">
                {alerts.length}
              </span>
            </div>
            
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {alerts.slice(0, 10).map((alert, index) => (
                <motion.div
                  key={`${alert.product_id}-${alert.urgency}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getUrgencyColor(alert.urgency)}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{alert.product_name}</span>
                      <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                        {alert.category}
                      </span>
                    </div>
                    <p className="text-sm mt-1">
                      {alert.urgency === 'critical' 
                        ? 'Out of stock' 
                        : `${alert.current_stock} units remaining (threshold: ${alert.threshold})`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const product = products.find(p => p.id === alert.product_id)
                      if (product) {
                        setSelectedProduct(product)
                        setIsRestockModalOpen(true)
                      }
                    }}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Restock
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 font-lora"
              >
                <option value="all">All Products</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="needs_reorder">Needs Reorder</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-100 font-montserrat">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-100 font-montserrat">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-100 font-montserrat">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-100 font-montserrat">Thresholds</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-100 font-montserrat">Value</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-100 font-montserrat">Last Restocked</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-100 font-montserrat">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {paginatedProducts.map((product, index) => {
                  const status = getStockStatus(product)
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-100 font-playfair">{product.name}</p>
                          <p className="text-sm text-gray-300 font-montserrat">SKU: {product.sku}</p>
                          <p className="text-xs text-gray-400 font-montserrat">{product.category?.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-100 font-playfair">{product.stock_quantity}</p>
                          <p className="text-xs text-gray-400 font-montserrat">units</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium font-montserrat ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-300 font-montserrat">
                          <p>Low: {product.low_stock_threshold}</p>
                          <p>Reorder: {product.reorder_level}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-100 font-playfair">
                            {formatMAD(product.stock_quantity * (product.cost_price || product.price))}
                          </p>
                          <p className="text-gray-400 font-montserrat">
                            @ {formatMAD(product.cost_price || product.price)}/unit
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300 font-montserrat">
                        {product.last_restocked 
                          ? format(new Date(product.last_restocked), 'MMM dd, yyyy')
                          : 'Never'
                        }
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsRestockModalOpen(true)
                            }}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Restock"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsThresholdModalOpen(true)
                            }}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Thresholds"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsDetailsModalOpen(true)
                            }}
                            className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gold-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-600 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-300 font-montserrat">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-600 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors font-montserrat"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg font-montserrat ${
                        currentPage === pageNum
                          ? 'bg-gold-600 text-white'
                          : 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-600 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors font-montserrat"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Restock Modal */}
      <RestockModal
        product={selectedProduct}
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false)
          setSelectedProduct(null)
        }}
        onRestock={handleRestock}
      />

      {/* Threshold Modal */}
      <ThresholdModal
        product={selectedProduct}
        isOpen={isThresholdModalOpen}
        onClose={() => {
          setIsThresholdModalOpen(false)
          setSelectedProduct(null)
        }}
        onUpdateThresholds={handleUpdateThresholds}
      />

      {/* Details Modal */}
      <DetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
} 