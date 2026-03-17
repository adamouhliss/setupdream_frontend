import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  PhotoIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useAuthStore } from '../../store/authStore'
import { formatMAD } from '../../utils/currency'
import { getImageUrl } from '../../utils/imageUrl'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'  // Production

interface Subcategory {
  id: number
  name: string
  description?: string
  category_id: number
  is_active: boolean
  sort_order: number
}

interface Category {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  subcategories?: Subcategory[]
}

interface Product {
  id: number
  name: string
  description?: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  category_id: number
  subcategory_id?: number
  brand?: string
  sizes?: string[]  // Changed from size?: string to sizes?: string[]
  color?: string
  material?: string
  weight?: number
  dimensions?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  image_url?: string
  category?: Category
  subcategory?: Subcategory
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
  sizes: string[]  // Changed from size: string to sizes: string[]
  color: string
  material: string
  weight?: number
  dimensions: string
  is_active: boolean
  is_featured: boolean
  images: (File | null)[]  // Array of 3 images
}

interface CategoryFormData {
  name: string
  description: string
  is_active: boolean
}

interface SubcategoryFormData {
  name: string
  description: string
  category_id: number
  is_active: boolean
  sort_order: number
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  // UI state
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'subcategories'>('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null)
  const [subcategoryFilter, setSubcategoryFilter] = useState<number | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  
  // Bulk operations state
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Image preview state for 3 images
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null])
  
  // Size input state
  const [newSize, setNewSize] = useState('')
  
  const { token } = useAuthStore()

  // Product form state
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    sale_price: undefined,
    sku: '',
    stock_quantity: 0,
    category_id: 0,
    subcategory_id: undefined,
    brand: '',
    sizes: [], // Initialize with empty array
    color: '',
    material: '',
    weight: undefined,
    dimensions: '',
    is_active: true,
    is_featured: false,
    images: [null, null, null] // Initialize with 3 nulls
  })

  // Category form state
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    description: '',
    is_active: true
  })

  // Subcategory form state
  const [subcategoryForm, setSubcategoryForm] = useState<SubcategoryFormData>({
    name: '',
    description: '',
    category_id: 0,
    is_active: true,
    sort_order: 0
  })

  // Fetch data
  useEffect(() => {
    fetchCategories()
    fetchProducts()
    fetchSubcategories()
  }, [])

  // Filter products
  useEffect(() => {
    let filtered = products

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category_id === categoryFilter)
    }

    if (subcategoryFilter) {
      filtered = filtered.filter(product => product.subcategory_id === subcategoryFilter)
    }

    setFilteredProducts(filtered)
    setShowBulkActions(selectedProducts.size > 0)
  }, [products, searchQuery, categoryFilter, subcategoryFilter, selectedProducts])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/subcategories/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSubcategories(data)
      }
    } catch (err) {
      console.error('Failed to fetch subcategories:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.items)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct 
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products/`
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      console.log(`🔄 ${method} product to: ${url}`)
      
      // Always use FormData since backend expects multipart/form-data
      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('description', productForm.description)
      formData.append('price', productForm.price.toString())
      if (productForm.sale_price) formData.append('sale_price', productForm.sale_price.toString())
      formData.append('sku', productForm.sku)
      formData.append('stock_quantity', productForm.stock_quantity.toString())
      formData.append('category_id', productForm.category_id.toString())
      if (productForm.subcategory_id) formData.append('subcategory_id', productForm.subcategory_id.toString())
      formData.append('brand', productForm.brand)
      formData.append('sizes', JSON.stringify(productForm.sizes)) // Append sizes as JSON array
      formData.append('color', productForm.color)
      formData.append('material', productForm.material)
      if (productForm.weight) formData.append('weight', productForm.weight.toString())
      formData.append('dimensions', productForm.dimensions)
      formData.append('is_active', productForm.is_active.toString())
      formData.append('is_featured', productForm.is_featured.toString())
      
      // For product creation/update, only send the first image (if any) as primary image
      if (productForm.images[0]) {
        console.log(`📎 Adding primary image: ${productForm.images[0].name}`)
        formData.append('image', productForm.images[0])
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formData
      })

      console.log(`📥 Product ${method} response status: ${response.status}`)

      if (response.ok) {
        const savedProduct = await response.json()
        console.log('✅ Product saved successfully:', savedProduct)
        
        // If we have multiple images, upload them to the separate images endpoint
        const imagesToUpload = productForm.images.filter(img => img !== null)
        console.log(`📸 Images to upload: ${imagesToUpload.length}`)
        
        if (imagesToUpload.length > 0) {
          await uploadMultipleImages(savedProduct.id, imagesToUpload)
        }
        
        await fetchProducts()
        setShowProductModal(false)
        resetProductForm()
        setError(null)
        
        console.log('🎉 Product creation/update process completed successfully')
      } else {
        const errorData = await response.json()
        console.error('❌ Product save failed:', errorData)
        setError(errorData.detail || 'Failed to save product')
      }
    } catch (err) {
      console.error('❌ Product submission error:', err)
      setError('Failed to save product')
    }
  }

  const uploadMultipleImages = async (productId: number, images: File[]) => {
    setUploadingImages(true)
    try {
      console.log(`🔄 Starting upload of ${images.length} images for product ${productId}`)
      
      const formData = new FormData()
      images.forEach((image, index) => {
        console.log(`📎 Adding image ${index + 1}: ${image.name} (${image.size} bytes)`)
        formData.append('images', image)
      })
      
      const uploadUrl = `${API_BASE_URL}/products/${productId}/images`
      console.log(`📤 Uploading to: ${uploadUrl}`)
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })
      
      console.log(`📥 Upload response status: ${response.status}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Upload failed:', errorData)
        throw new Error(errorData.detail || 'Failed to upload images')
      }
      
      const responseData = await response.json()
      console.log('✅ Upload successful:', responseData)
      console.log(`Successfully uploaded ${images.length} images to Railway volume`)
      
      // Refresh the product list to show the new images
      await fetchProducts()
      
    } catch (error) {
      console.error('❌ Error uploading images:', error)
      setError(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory 
        ? `${API_BASE_URL}/products/categories/${editingCategory.id}`
        : `${API_BASE_URL}/products/categories/`
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        await fetchCategories()
        setShowCategoryModal(false)
        resetCategoryForm()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to save category')
      }
    } catch (err) {
      setError('Failed to save category')
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchProducts()
      }
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const toggleProductStatus = async (id: number, field: 'active' | 'featured') => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/toggle-${field}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchProducts()
      }
    } catch (err) {
      setError(`Failed to update product ${field} status`)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      sale_price: undefined,
      sku: '',
      stock_quantity: 0,
      category_id: 0,
      subcategory_id: undefined,
      brand: '',
      sizes: [], // Reset sizes
      color: '',
      material: '',
      weight: undefined,
      dimensions: '',
      is_active: true,
      is_featured: false,
      images: [null, null, null] // Reset images
    })
    setEditingProduct(null)
    setImagePreviews([null, null, null]) // Reset previews
    setNewSize('') // Reset the size input field
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      is_active: true
    })
    setEditingCategory(null)
  }

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        brand: product.brand || '',
        sizes: product.sizes || [], // Set sizes
        color: product.color || '',
        material: product.material || '',
        weight: product.weight,
        dimensions: product.dimensions || '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        images: [null, null, null] // Reset images
      })
    } else {
      resetProductForm()
    }
    setShowProductModal(true)
  }

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active
      })
    } else {
      resetCategoryForm()
    }
    setShowCategoryModal(true)
  }

  const openSubcategoryModal = (subcategory?: Subcategory) => {
    if (subcategory) {
      setEditingSubcategory(subcategory)
      setSubcategoryForm({
        name: subcategory.name,
        description: subcategory.description || '',
        category_id: subcategory.category_id,
        is_active: subcategory.is_active,
        sort_order: subcategory.sort_order
      })
    } else {
      resetSubcategoryForm()
    }
    setShowSubcategoryModal(true)
  }

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingSubcategory 
        ? `${API_BASE_URL}/products/subcategories/${editingSubcategory.id}`
        : `${API_BASE_URL}/products/subcategories/`
      
      const method = editingSubcategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subcategoryForm)
      })

      if (response.ok) {
        await fetchSubcategories()
        setShowSubcategoryModal(false)
        resetSubcategoryForm()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to save subcategory')
      }
    } catch (err) {
      setError('Failed to save subcategory')
    }
  }

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      name: '',
      description: '',
      category_id: 0,
      is_active: true,
      sort_order: 0
    })
    setEditingSubcategory(null)
  }

  // Bulk operations functions
  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const handleSelectProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return
    
    try {
      const deletePromises = Array.from(selectedProducts).map(id =>
        fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      )
      
      await Promise.all(deletePromises)
      await fetchProducts()
      setSelectedProducts(new Set())
    } catch (err) {
      setError('Failed to delete products')
    }
  }

  const handleBulkStatusChange = async (field: 'active' | 'featured', value: boolean) => {
    try {
      const updatePromises = Array.from(selectedProducts).map(id =>
        fetch(`${API_BASE_URL}/products/${id}/bulk-update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value })
        })
      )
      
      await Promise.all(updatePromises)
      await fetchProducts()
      setSelectedProducts(new Set())
    } catch (err) {
      setError(`Failed to update product ${field} status`)
    }
  }

  // Image upload functions
  const handleImageUpload = (file: File, index: number) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Update form state with the file
    const newImages = [...productForm.images]
    newImages[index] = file
    setProductForm({...productForm, images: newImages})
    
    // Create preview URL using FileReader
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (result && typeof result === 'string') {
        const newPreviews = [...imagePreviews]
        newPreviews[index] = result
        setImagePreviews(newPreviews)
      }
    }
    reader.onerror = () => {
      setError('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    const newImages = [...productForm.images]
    newImages[index] = null
    setProductForm({...productForm, images: newImages})
    
    const newPreviews = [...imagePreviews]
    newPreviews[index] = null
    setImagePreviews(newPreviews)
    
    // Reset the file input
    const fileInput = document.getElementById(`image-upload-${index}`) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
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
            Product Management
          </h1>
          <p className="text-gray-300 font-lora">Manage your store's products and categories</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-red-400"
          >
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-300">×</button>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { key: 'products', label: 'Products', count: products.length },
            { key: 'categories', label: 'Categories', count: categories.length },
            { key: 'subcategories', label: 'Subcategories', count: subcategories.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-medium font-montserrat transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gold-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gold-400 border border-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <>
            {/* Products Controls */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter || ''}
                    onChange={(e) => setCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Subcategory Filter */}
                  <select
                    value={subcategoryFilter || ''}
                    onChange={(e) => setSubcategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                  >
                    <option value="">All Subcategories</option>
                    {subcategories
                      .filter(sub => !categoryFilter || sub.category_id === categoryFilter)
                      .map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={() => openProductModal()}
                  className="btn-primary px-6 py-3 flex items-center gap-2 font-montserrat"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Product
                </button>
              </div>

              {/* Bulk Actions */}
              {showBulkActions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-300">
                      {selectedProducts.size} products selected
                    </span>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-montserrat text-sm"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('active', true)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-montserrat text-sm"
                    >
                      Activate Selected
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('active', false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-montserrat text-sm"
                    >
                      Deactivate Selected
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('featured', true)}
                      className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-montserrat text-sm"
                    >
                      Feature Selected
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Products Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300 font-lora">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-playfair text-gray-100 mb-2">No products found</h3>
                  <p className="text-gray-300 font-lora">Start by creating your first product</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700 border-b border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-gold-600 border-gray-500 rounded focus:ring-gold-500 bg-gray-600"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Stock</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold font-montserrat text-gray-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                              className="w-4 h-4 text-gold-600 border-gray-500 rounded focus:ring-gold-500 bg-gray-600"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                  <img 
                                    src={getImageUrl(product.image_url)} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold font-playfair text-gray-100">{product.name}</p>
                                <p className="text-sm text-gray-300 font-montserrat">SKU: {product.sku}</p>
                                {product.is_featured && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <StarSolidIcon className="w-4 h-4 text-gold-500" />
                                    <span className="text-xs text-gold-400 font-medium">Featured</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-sm text-gray-100 font-montserrat">
                                {product.category?.name || 'No Category'}
                              </span>
                              {product.subcategory && (
                                <div className="text-xs text-gray-400 font-montserrat">
                                  {product.subcategory.name}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="font-bold text-gray-100 font-playfair">
                                {formatMAD(product.price)}
                              </span>
                              {product.sale_price && (
                                <div className="text-sm text-red-400 font-montserrat">
                                  Sale: {formatMAD(product.sale_price)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-montserrat ${
                              product.stock_quantity <= 5 ? 'text-red-400' : 'text-gray-100'
                            }`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleProductStatus(product.id, 'active')}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  product.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                }`}
                              >
                                {product.is_active ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => toggleProductStatus(product.id, 'featured')}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  product.is_featured ? 'bg-gold-900/30 text-gold-400' : 'bg-gray-700 text-gray-400'
                                }`}
                              >
                                <StarIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openProductModal(product)}
                                className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gold-900/20 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'categories' && (
          <>
            {/* Categories Controls */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-playfair text-gray-100">
                  Categories ({categories.length})
                </h2>
                <button
                  onClick={() => openCategoryModal()}
                  className="btn-primary px-6 py-3 flex items-center gap-2 font-montserrat"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Category
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  layout
                  className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:shadow-md hover:border-gold-600/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                        <TagIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold font-playfair text-gray-100">{category.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-montserrat ${
                          category.is_active ? 'bg-green-900/30 text-green-400 border border-green-600/30' : 'bg-red-900/30 text-red-400 border border-red-600/30'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {category.description && (
                    <p className="text-gray-300 text-sm font-lora mb-4">{category.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-montserrat">
                      {products.filter(p => p.category_id === category.id).length} products
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCategoryModal(category)}
                        className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gold-900/20 rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'subcategories' && (
          <>
            {/* Subcategories Controls */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-playfair text-gray-100">
                  Subcategories ({subcategories.length})
                </h2>
                <button
                  onClick={() => openSubcategoryModal()}
                  className="btn-primary px-6 py-3 flex items-center gap-2 font-montserrat"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Subcategory
                </button>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((subcategory) => (
                <motion.div
                  key={subcategory.id}
                  layout
                  className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:shadow-md hover:border-gold-600/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                        <TagIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold font-playfair text-gray-100">{subcategory.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-montserrat ${
                          subcategory.is_active ? 'bg-green-900/30 text-green-400 border border-green-600/30' : 'bg-red-900/30 text-red-400 border border-red-600/30'
                        }`}>
                          {subcategory.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {subcategory.description && (
                    <p className="text-gray-300 text-sm font-lora mb-4">{subcategory.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-montserrat">
                      {products.filter(p => p.subcategory_id === subcategory.id).length} products
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openSubcategoryModal(subcategory)}
                        className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gold-900/20 rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={() => setShowProductModal(false)}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <form onSubmit={handleProductSubmit} className="p-8">
                    <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
                      {editingProduct ? 'Edit Product' : 'Create New Product'}
                    </h2>

                    {/* SUPER OBVIOUS WARNING BANNER */}
                    <div className="mb-4 bg-red-600 text-white p-4 rounded-lg text-center font-bold text-xl animate-pulse">
                      🚨 IMAGE UPLOAD SECTION IS RIGHT BELOW THIS! 🚨
                    </div>
                    
                    {/* IMAGE UPLOAD SECTION - FIRST THING AT TOP */}
                    <div className="mb-8 bg-gradient-to-r from-gold-900/20 to-yellow-900/20 border-2 border-gold-600/30 rounded-2xl p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold text-gold-400 font-montserrat mb-2">
                          📸 Upload Product Images (Up to 3)
                        </h3>
                        <p className="text-gold-300 font-medium">Click the boxes below to add images for your product</p>
                      </div>
                      
                      {/* Always show 3 image slots - LARGE AND PROMINENT */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="relative">
                            {imagePreviews[index] ? (
                              // Image preview
                              <div className="relative">
                                <img
                                  src={imagePreviews[index]!}
                                  alt={`Product preview ${index + 1}`}
                                  className="w-full h-40 object-cover rounded-xl border-4 border-gold-400 hover:border-gold-500 transition-all duration-200 shadow-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
                                >
                                  ✕
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-2 left-2 bg-gold-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                    ⭐ PRIMARY
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Upload placeholder
                              <button
                                type="button"
                                onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                                className="w-full h-40 border-4 border-dashed border-gold-400 rounded-xl flex flex-col items-center justify-center hover:border-gold-600 hover:bg-gold-900/10 transition-all duration-200 group bg-gray-700 shadow-lg hover:shadow-xl"
                              >
                                <div className="text-gold-500 group-hover:text-gold-400 mb-3">
                                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </div>
                                <span className="text-lg font-bold text-gold-400 group-hover:text-gold-300 mb-1">
                                  {index === 0 ? '📸 Primary Image' : `📷 Image ${index + 1}`}
                                </span>
                                <span className="text-sm text-gold-300 group-hover:text-gold-200 font-medium">
                                  Click to upload
                                </span>
                              </button>
                            )}
                            
                            {/* Hidden file input for each slot */}
                            <input
                              id={`image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleImageUpload(file, index)
                                }
                              }}
                              className="hidden"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Instructions */}
                      <div className="mt-6 bg-gray-700/70 rounded-xl p-4">
                        <div className="text-sm text-gold-300 space-y-2 text-center">
                          <p className="font-bold">📋 Instructions:</p>
                          <p>• Click any box above to upload an image</p>
                          <p>• First image becomes the PRIMARY product image</p>
                          <p>• Supported formats: PNG, JPG, GIF (max 5MB each)</p>
                          <p>• Images are uploaded after you save the product</p>
                        </div>
                      </div>
                      
                      {/* Upload Progress */}
                      {uploadingImages && (
                        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg font-bold text-blue-400">📤 Uploading images...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold font-montserrat text-gray-100">Basic Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                            placeholder="Enter product name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={productForm.description}
                            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora resize-none"
                            placeholder="Product description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                            SKU *
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.sku}
                            onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                            placeholder="Product SKU"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Category *
                            </label>
                            <select
                              required
                              value={productForm.category_id}
                              onChange={(e) => {
                                const categoryId = parseInt(e.target.value)
                                setProductForm({...productForm, category_id: categoryId, subcategory_id: undefined})
                              }}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                            >
                              <option value={0}>Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Subcategory
                            </label>
                            <select
                              value={productForm.subcategory_id || ''}
                              onChange={(e) => setProductForm({...productForm, subcategory_id: e.target.value ? parseInt(e.target.value) : undefined})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                              disabled={!productForm.category_id}
                            >
                              <option value="">Select subcategory</option>
                              {subcategories
                                .filter(sub => sub.category_id === productForm.category_id)
                                .map((subcategory) => (
                                  <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Inventory */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold font-montserrat text-gray-100">Pricing & Inventory</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Price (MAD) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Sale Price (MAD)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={productForm.sale_price || ''}
                              onChange={(e) => setProductForm({...productForm, sale_price: e.target.value ? parseFloat(e.target.value) : undefined})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                            Stock Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={productForm.stock_quantity}
                            onChange={(e) => setProductForm({...productForm, stock_quantity: parseInt(e.target.value)})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Brand
                            </label>
                            <input
                              type="text"
                              value={productForm.brand}
                              onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Color
                            </label>
                            <input
                              type="text"
                              value={productForm.color}
                              onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Material
                            </label>
                            <input
                              type="text"
                              value={productForm.material}
                              onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                              Sizes
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {productForm.sizes.map((size, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-600 text-gray-200 rounded-full text-sm font-medium">
                                  {size}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSizes = [...productForm.sizes];
                                      newSizes.splice(index, 1);
                                      setProductForm({...productForm, sizes: newSizes});
                                    }}
                                    className="ml-2 text-red-400 hover:text-red-300"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Add sizes (e.g., S, M, L, XL)"
                              value={newSize}
                              onChange={(e) => setNewSize(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  if (newSize.trim() && !productForm.sizes.includes(newSize.trim())) {
                                    setProductForm(prev => ({
                                      ...prev,
                                      sizes: [...prev.sizes, newSize.trim()]
                                    }))
                                    setNewSize('')
                                  }
                                }
                              }}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora mt-2"
                            />
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (newSize.trim() && !productForm.sizes.includes(newSize.trim())) {
                                    setProductForm(prev => ({
                                      ...prev,
                                      sizes: [...prev.sizes, newSize.trim()]
                                    }))
                                    setNewSize('')
                                  }
                                }}
                                className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Add Size
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Fields */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.weight || ''}
                          onChange={(e) => setProductForm({...productForm, weight: e.target.value ? parseFloat(e.target.value) : undefined})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={productForm.dimensions}
                          onChange={(e) => setProductForm({...productForm, dimensions: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                          placeholder="L x W x H"
                        />
                      </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="mt-6 flex items-center gap-6">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={productForm.is_active}
                          onChange={(e) => setProductForm({...productForm, is_active: e.target.checked})}
                          className="w-5 h-5 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                        />
                        <span className="font-medium font-montserrat text-gray-300">Active</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={productForm.is_featured}
                          onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})}
                          className="w-5 h-5 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                        />
                        <span className="font-medium font-montserrat text-gray-300">Featured</span>
                      </label>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex items-center gap-4">
                      <button
                        type="submit"
                        className="btn-primary px-6 py-3 font-montserrat"
                      >
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductModal(false)}
                        className="btn-outline px-6 py-3 font-montserrat"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Modal */}
        <AnimatePresence>
          {showCategoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={() => setShowCategoryModal(false)}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <form onSubmit={handleCategorySubmit} className="p-8">
                    <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
                      {editingCategory ? 'Edit Category' : 'Create New Category'}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                          placeholder="Enter category name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora resize-none"
                          placeholder="Category description"
                        />
                      </div>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={categoryForm.is_active}
                          onChange={(e) => setCategoryForm({...categoryForm, is_active: e.target.checked})}
                          className="w-5 h-5 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                        />
                        <span className="font-medium font-montserrat text-gray-300">Active</span>
                      </label>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <button
                        type="submit"
                        className="btn-primary px-6 py-3 font-montserrat"
                      >
                        {editingCategory ? 'Update Category' : 'Create Category'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(false)}
                        className="btn-outline px-6 py-3 font-montserrat"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subcategory Modal */}
        <AnimatePresence>
          {showSubcategoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={() => setShowSubcategoryModal(false)}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <form onSubmit={handleSubcategorySubmit} className="p-8">
                    <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
                      {editingSubcategory ? 'Edit Subcategory' : 'Create New Subcategory'}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Subcategory Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={subcategoryForm.name}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, name: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                          placeholder="Enter subcategory name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Parent Category *
                        </label>
                        <select
                          required
                          value={subcategoryForm.category_id}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, category_id: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 font-lora"
                        >
                          <option value={0}>Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={subcategoryForm.description}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, description: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora resize-none"
                          placeholder="Subcategory description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={subcategoryForm.sort_order}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, sort_order: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 placeholder-gray-400 font-lora"
                          placeholder="0"
                        />
                      </div>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={subcategoryForm.is_active}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, is_active: e.target.checked})}
                          className="w-5 h-5 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                        />
                        <span className="font-medium font-montserrat text-gray-300">Active</span>
                      </label>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <button
                        type="submit"
                        className="btn-primary px-6 py-3 font-montserrat"
                      >
                        {editingSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSubcategoryModal(false)}
                        className="btn-outline px-6 py-3 font-montserrat"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 