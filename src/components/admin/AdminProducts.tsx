import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {

  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PhotoIcon,

  FunnelIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TagIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import { formatMAD } from '../../utils/currency'
import { getImageUrl } from '../../utils/imageUrl'
import SessionExpiredModal from './SessionExpiredModal'
import ProductFormModal from './ProductFormModal'


// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'
  : 'https://carre-sport-production.up.railway.app/api/v1'

interface Category {
  id: number
  name: string
  parentId?: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  category?: Category
  subcategory?: Category
  brand: string
  sizes: string[]
  color: string
  material: string
  images: string[]
  is_active: boolean
  is_featured: boolean
}

interface ProductFormData {
  name: string
  description: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  category_id: number
  subcategory_id?: number
  brand: string
  sizes: string[]
  color: string
  material: string
  weight?: number;
  dimensions: string;
  is_active: boolean
  is_featured: boolean
  images: (File | string | null)[]
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI State
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'subcategories'>('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<number | null>(null)

  // Session State
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null)

  const [categoryForm, setCategoryForm] = useState({ name: '', parentId: undefined as number | undefined })

  const { token } = useAuthStore()

  // Initial Data Fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Filter Logic
  useEffect(() => {
    let result = products

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?.id === selectedCategory)
    }

    setFilteredProducts(result)
  }, [products, searchQuery, selectedCategory])

  const handleApiError = (err: any, retryAction?: () => Promise<void>) => {
    // Check for 401 in various formats depending on how fetch throws/returns
    if (err.message?.includes('401') || err.status === 401 || err.message === '401 Unauthorized') {
      if (retryAction) setPendingAction(() => retryAction)
      setShowSessionModal(true)
      return true
    }
    return false
  }

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products/admin/all`, { headers }),
        fetch(`${API_BASE_URL}/categories/`, { headers })
      ])

      if (productsRes.status === 401 || categoriesRes.status === 401) {
        throw new Error('401 Unauthorized')
      }

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData.items || [])
      setCategories(categoriesData.filter((c: any) => !c.parent_id))
      setSubcategories(categoriesData.filter((c: any) => c.parent_id))
      setError(null)
    } catch (err: any) {
      if (err.message === '401 Unauthorized') {
        setShowSessionModal(true)
        // For fetchData, we can just retry getting data once re-authed
        setPendingAction(() => fetchData)
      } else {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data')
      }
    } finally {
      setLoading(false)
    }
  }

  // --- Product Handlers ---



  const submitProduct = async (data: ProductFormData) => {
    if (!token) return

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') return
        if (key === 'sizes') {
          formData.append('sizes', JSON.stringify(value)) // Send as JSON string
          return
        }
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      const url = editingProduct
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products/`

      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.status === 401) throw new Error('401 Unauthorized')
      if (!response.ok) throw new Error('Failed to save product')

      const savedProduct = await response.json()

      // Handle Image Uploads
      if (data.images.some(img => img !== null && img instanceof File)) {
        await uploadImages(savedProduct.id, data.images.filter(img => img instanceof File) as File[])
      }

      await fetchData()
      setShowProductModal(false)
      setEditingProduct(null)
      setError(null)
    } catch (err: any) {
      // Need to wrap submitProduct to avoid argument issues in retry
      if (!handleApiError(err, () => submitProduct(data))) {
        console.error('Save error:', err)
        setError('Failed to save product')
      }
    }
  }

  const uploadImages = async (productId: number, images: File[]) => {
    if (!token) return
    const formData = new FormData()
    images.forEach((img) => {
      formData.append('images', img)
    })

    const response = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    if (response.status === 401) throw new Error('401 Unauthorized')
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure?') || !token) return
    await deleteProduct(id)
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.status === 401) throw new Error('401 Unauthorized')

      await fetchData()
    } catch (err: any) {
      if (!handleApiError(err, () => deleteProduct(id))) {
        console.error('Delete error:', err)
        setError('Failed to delete product')
      }
    }
  }

  // --- Category Handlers ---

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitCategory()
  }

  const submitCategory = async () => {
    if (!token) return

    try {
      const url = editingCategory
        ? `${API_BASE_URL}/categories/${editingCategory.id}`
        : `${API_BASE_URL}/categories/`

      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: categoryForm.name,
          parent_id: activeTab === 'subcategories' ? categoryForm.parentId : null
        })
      })

      if (response.status === 401) throw new Error('401 Unauthorized')
      if (!response.ok) throw new Error('Failed to save category')

      await fetchData()
      setShowCategoryModal(false)
      setCategoryForm({ name: '', parentId: undefined })
      setError(null)
    } catch (err: any) {
      if (!handleApiError(err, submitCategory)) {
        console.error('Category save error:', err)
        setError('Failed to save category')
      }
    }
  }

  // --- Helpers ---

  const openProductModal = (product?: Product) => {
    setEditingProduct(product || null)
    setShowProductModal(true)
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-playfair">Products & Inventory</h1>
          <p className="text-gray-400 font-light">Manage your catalog, stock, and categories.</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={() => {
            if (activeTab === 'products') openProductModal()
            else {
              setEditingCategory(null)
              setCategoryForm({ name: '', parentId: undefined })
              setShowCategoryModal(true)
            }
          }}
          className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Add {activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Category' : 'Subcategory'}
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex overflow-x-auto pb-2 gap-2 border-b border-white/5">
          {['products', 'categories', 'subcategories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${activeTab === tab ? 'text-gold-400 bg-white/5' : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div layoutId="activeTabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all"
              />
            </div>
            <div className="relative w-full md:w-64">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white appearance-none focus:ring-1 focus:ring-gold-500 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading data...</div>
      ) : activeTab === 'products' ? (
        <div className="grid grid-cols-1 gap-4">
          {/* Desktop Table */}
          <div className="hidden md:block bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><PhotoIcon className="w-6 h-6" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{product.category?.name || '-'}</td>
                    <td className="px-6 py-4 font-medium text-gold-400">{formatMAD(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock_quantity > 10 ? 'bg-green-500/10 text-green-400' :
                        product.stock_quantity > 0 ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                        {product.stock_quantity > 10 ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <ExclamationCircleIcon className="w-3.5 h-3.5" />}
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.is_active && <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>}
                        {product.is_featured && <span className="w-2 h-2 rounded-full bg-gold-500" title="Featured"></span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openProductModal(product)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex items-start gap-4 active:bg-gray-800">
                <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600"><PhotoIcon className="w-8 h-8" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white truncate pr-2">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                    <button onClick={() => setMobileMenuOpen(mobileMenuOpen === product.id ? null : product.id)} className="p-1 text-gray-400">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-gold-400 font-bold">{formatMAD(product.price)}</span>
                    <span className="text-xs text-gray-500">• {product.category?.name}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs font-medium ${product.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock_quantity} left
                    </span>
                    <div className="flex gap-2">
                      {mobileMenuOpen === product.id && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                          <button onClick={() => openProductModal(product)} className="p-1.5 bg-gray-700 rounded-lg text-white"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 bg-red-500/20 text-red-500 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Categories & Subcategories List
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'categories' ? categories : subcategories).map((category) => (
            <div key={category.id} className="bg-gray-900/40 p-6 rounded-xl border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500">
                  {activeTab === 'categories' ? <TagIcon className="w-5 h-5" /> : <ArchiveBoxIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-white">{category.name}</h3>
                  {category.parentId && <p className="text-xs text-gray-500">ID: {category.id}</p>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingCategory(category)
                    setCategoryForm({ name: category.name, parentId: category.parentId })
                    setShowCategoryModal(true)
                  }}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={async (formData) => {
          // Convert to expected format for submitProduct logic or call it directly
          await submitProduct(formData)
        }}
        initialData={editingProduct}
        categories={categories}
      />

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative z-10">
              <h2 className="text-xl font-bold text-white mb-4">{editingCategory ? 'Edit' : 'New'} Category</h2>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    value={categoryForm.name}
                    onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                    required
                  />
                </div>
                {activeTab === 'subcategories' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Parent Category</label>
                    <select
                      value={categoryForm.parentId || ''}
                      onChange={e => setCategoryForm({ ...categoryForm, parentId: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                    >
                      <option value="">Select Parent...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gold-500 text-white rounded-lg font-medium">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <SessionExpiredModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSuccess={() => {
          setShowSessionModal(false)
          if (pendingAction) {
            pendingAction()
            setPendingAction(null)
          } else {
            fetchData()
          }
        }}
      />
    </div>
  )
}
