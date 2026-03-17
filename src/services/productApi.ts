// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

import { getProductPrimaryImage } from '../utils/productImages'

export interface DatabaseSubcategory {
  id: number
  name: string
  name_fr?: string
  description?: string
  description_fr?: string
  category_id: number
  is_active: boolean
}

export interface DatabaseProduct {
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
  image_url?: string  // Primary product image URL
  created_at: string
  category?: {
    id: number
    name: string
    name_fr?: string
    description?: string
    description_fr?: string
    is_active: boolean
  }
  subcategory?: {
    id: number
    name: string
    name_fr?: string
    description?: string
    description_fr?: string
    category_id: number
    is_active: boolean
  }
  images?: Array<{
    id: number
    image_url: string
    alt_text?: string
    is_primary: boolean
    sort_order: number
  }>
  variants?: Array<{
    id: number
    sku: string
    size?: string
    color?: string
    stock_quantity: number
    reserved_quantity: number
    price_override?: number
    is_active: boolean
  }>
}

export interface DatabaseCategory {
  id: number
  name: string
  name_fr?: string
  description?: string
  description_fr?: string
  is_active: boolean
  created_at: string
  subcategories?: DatabaseSubcategory[]
}

export interface ProductListResponse {
  items: DatabaseProduct[]
  total: number
  page: number
  per_page: number
  pages: number
}

// Convert database product to frontend cart format
export const convertToCartProduct = (dbProduct: DatabaseProduct) => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description || '',
  price: dbProduct.sale_price || dbProduct.price, // Use sale price if available
  originalPrice: dbProduct.sale_price ? dbProduct.price : undefined,
  rating: 4.5, // Default rating since it's not in database yet
  reviews: Math.floor(Math.random() * 300) + 50, // Random reviews for now
  isNew: dbProduct.is_featured,
  colors: dbProduct.color ? dbProduct.color.split('/') : ['Black'], // Split colors
  sizes: dbProduct.sizes || [], // Include sizes array
  category: (dbProduct.category?.name || 'equipment').toLowerCase(),
  image: getProductPrimaryImage(dbProduct.id, dbProduct.image_url),
  stock_quantity: dbProduct.stock_quantity // Map stock quantity
})

class ProductAPI {
  async getProducts(params?: {
    skip?: number
    limit?: number
    category_id?: number
    subcategory_id?: number
    is_featured?: boolean
    search?: string
    sort?: string
  }): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString())
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString())
    if (params?.category_id) searchParams.set('category_id', params.category_id.toString())
    if (params?.subcategory_id) searchParams.set('subcategory_id', params.subcategory_id.toString())
    if (params?.is_featured !== undefined) searchParams.set('is_featured', params.is_featured.toString())
    if (params?.search) searchParams.set('search', params.search)

    const response = await fetch(`${API_BASE_URL}/products/?${searchParams}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    return response.json()
  }

  async getProductById(id: number): Promise<DatabaseProduct> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }
    return response.json()
  }

  async getFeaturedProducts(): Promise<DatabaseProduct[]> {
    try {
      const response = await this.getProducts({ is_featured: true, limit: 10 })
      return response.items
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      // Fallback: get any products if featured products fail
      try {
        const response = await this.getProducts({ limit: 10 })
        return response.items
      } catch (fallbackError) {
        console.error('Failed to fetch fallback products:', fallbackError)
        return []
      }
    }
  }

  async getTrendingProducts(limit: number = 6): Promise<DatabaseProduct[]> {
    try {
      const response = await this.getProducts({ limit: limit * 2 })
      // Sort by featured status and creation date
      return response.items
        .sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to fetch trending products:', error)
      return []
    }
  }

  async getRandomProducts(limit: number = 6, excludeId?: number): Promise<DatabaseProduct[]> {
    try {
      const response = await this.getProducts({ limit: limit * 2 })
      let products = response.items

      if (excludeId) {
        products = products.filter(p => p.id !== excludeId)
      }

      // Shuffle and return requested number
      return products.sort(() => Math.random() - 0.5).slice(0, limit)
    } catch (error) {
      console.error('Failed to fetch random products:', error)
      return []
    }
  }

  async getCategories(): Promise<DatabaseCategory[]> {
    const response = await fetch(`${API_BASE_URL}/products/categories/`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    return response.json()
  }

  async searchProducts(query: string): Promise<DatabaseProduct[]> {
    const response = await this.getProducts({ search: query, limit: 100 })
    return response.items
  }
}

export const productAPI = new ProductAPI() 