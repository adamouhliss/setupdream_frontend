import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { productAPI, DatabaseProduct, DatabaseCategory } from '../services/productApi'
import { useSEO } from '../hooks/useSEO'
import { generateBreadcrumbSchema } from '../utils/seoUtils'
import ProductRecommendations from '../components/sales/ProductRecommendations'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/products/ProductFilters'
import ProductSort, { SortOption } from '../components/products/ProductSort'
import ProductGridSkeleton from '../components/products/ProductGridSkeleton'

export default function ProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  // State - Initialize from URL params to prevent race conditions
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(() => {
    const param = searchParams.get('category')
    return param ? parseInt(param) : null
  })
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(() => {
    const param = searchParams.get('subcategory')
    return param ? parseInt(param) : null
  })
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [currentSort, setCurrentSort] = useState<SortOption>(() => {
    const param = searchParams.get('sort') as SortOption
    if (param) return param
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    return (categoryParam || subcategoryParam) ? 'price_asc' : 'newest'
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Data State
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [categories, setCategories] = useState<DatabaseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const isFirstLoad = useRef(true)
  const [error, setError] = useState<string | null>(null)

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const PRODUCTS_PER_PAGE = 12

  // Category Helpers
  const selectedCategoryObj = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)
    : null

  const selectedSubcategoryObj = selectedSubcategory && selectedCategoryObj?.subcategories
    ? selectedCategoryObj.subcategories.find(sub => sub.id === selectedSubcategory) || null
    : null

  // SEO
  useSEO({
    title: selectedCategoryObj
      ? `${selectedCategoryObj.name}${selectedSubcategoryObj ? ` - ${selectedSubcategoryObj.name}` : ''} - ${t('seo.products.title')}`
      : t('seo.products.title'),
    description: selectedCategoryObj
      ? `${t('seo.products.description')} - ${selectedCategoryObj.name}${selectedSubcategoryObj ? ` - ${selectedSubcategoryObj.name}` : ''}`
      : t('seo.products.description'),
    keywords: `${t('seo.products.keywords')}${selectedCategoryObj ? `, ${selectedCategoryObj.name}` : ''}${selectedSubcategoryObj ? `, ${selectedSubcategoryObj.name}` : ''}`,
    type: 'website',
    canonical: window.location.href,
    noindex: !!searchTerm,
    structuredData: generateBreadcrumbSchema([
      { name: t('navigation.home'), url: window.location.origin },
      { name: t('navigation.products'), url: `${window.location.origin}/products` },
      ...(selectedCategoryObj ? [{
        name: selectedCategoryObj.name,
        url: `${window.location.origin}/products?category=${selectedCategoryObj.id}`
      }] : []),
      ...(selectedSubcategoryObj ? [{
        name: selectedSubcategoryObj.name,
        url: `${window.location.origin}/products?category=${selectedCategoryObj?.id}&subcategory=${selectedSubcategoryObj.id}`
      }] : [])
    ])
  })

  // URL Params Sync (Handle Back/Forward navigation)
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    const searchParam = searchParams.get('search')
    const sortParam = searchParams.get('sort') as SortOption

    const newCategory = categoryParam ? parseInt(categoryParam) : null
    const newSubcategory = subcategoryParam ? parseInt(subcategoryParam) : null
    const newSearch = searchParam || ''

    // Only update state if different to prevent loops
    if (newCategory !== selectedCategory) setSelectedCategory(newCategory)
    if (newSubcategory !== selectedSubcategory) setSelectedSubcategory(newSubcategory)
    if (newSearch !== searchTerm) setSearchTerm(newSearch)

    if (sortParam && sortParam !== currentSort) {
      setCurrentSort(sortParam)
    }

    if (!categoryParam && !subcategoryParam && !searchParam) {
      // Optional: Scrol to top if parameters are cleared externally
      // if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [searchParams])

  // Fetch Logic
  const fetchProducts = useCallback(async (
    pageNum: number = 0,
    reset: boolean = true,
    category?: number | null,
    subcategory?: number | null,
    search?: string,
    sort?: SortOption
  ) => {
    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      if (reset) {
        if (isFirstLoad.current) {
          setLoading(true)
        } else {
          setFiltering(true)
        }
        setError(null)
      } else {
        setLoadingMore(true)
      }

      const params: any = {
        skip: pageNum * PRODUCTS_PER_PAGE,
        limit: PRODUCTS_PER_PAGE,
      }

      if (category) params.category_id = category
      if (subcategory) params.subcategory_id = subcategory
      if (search && search.trim()) params.search = search.trim()

      const response = await productAPI.getProducts(params)

      // Check if aborted (though standard fetch throws, we add safety)
      if (controller.signal.aborted) return

      let fetchedItems = response.items

      // Client-side Sort Fallback
      if (sort === 'price_asc') fetchedItems.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
      if (sort === 'price_desc') fetchedItems.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
      if (sort === 'name_asc') fetchedItems.sort((a, b) => a.name.localeCompare(b.name))
      if (sort === 'newest') fetchedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      if (reset) {
        setProducts(fetchedItems)
        setPage(1)
      } else {
        setProducts(prev => [...prev, ...fetchedItems])
        setPage(pageNum + 1)
      }

      setHasMore(fetchedItems.length === PRODUCTS_PER_PAGE && response.total > (pageNum + 1) * PRODUCTS_PER_PAGE)
      setError(null)
    } catch (err: any) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      console.error('❌ Failed to fetch products:', err)
      setError(t('products.loadError'))
      if (!reset) setPage(prev => prev - 1)
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
        setFiltering(false)
        setLoadingMore(false)
        isFirstLoad.current = false
      }
    }
  }, [t])

  // Categories Fetch
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await productAPI.getCategories()
      setCategories(categoriesData)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  // Fetch categories only once on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(0, true, selectedCategory, selectedSubcategory, searchTerm, currentSort)
  }, [fetchProducts, selectedCategory, selectedSubcategory, currentSort])

  // Debounced Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(0, true, selectedCategory, selectedSubcategory, searchTerm, currentSort)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Infinite Scroll Utils
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchProducts(page, false, selectedCategory, selectedSubcategory, searchTerm, currentSort)
      }
    }, { threshold: 0.1, rootMargin: '200px' })
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return () => observerRef.current?.disconnect()
  }, [hasMore, loading, loadingMore, page, fetchProducts, selectedCategory, selectedSubcategory, searchTerm, currentSort])

  // Handlers
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(null)
    setIsMobileFilterOpen(false)
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (categoryId) newParams.set('category', categoryId.toString())
      else newParams.delete('category')
      newParams.delete('subcategory')
      return newParams
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubcategoryChange = (subcategoryId: number | null) => {
    setSelectedSubcategory(subcategoryId)
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (subcategoryId) newParams.set('subcategory', subcategoryId.toString())
      else newParams.delete('subcategory')
      return newParams
    })
  }

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort)
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('sort', sort)
      return newParams
    })
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) newFavorites.delete(productId)
      else newFavorites.add(productId)
      return newFavorites
    })
  }

  return (
    <div className="min-h-screen bg-dark-950 pb-24 text-gray-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={topRef}>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-dark-700 pb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display uppercase tracking-wider text-white mb-2">
              {searchTerm
                ? `${t('common.resultsFor', 'Results for')} "${searchTerm}"`
                : selectedCategoryObj
                  ? selectedCategoryObj.name
                  : t('products.allProducts', 'All Products')}
            </h1>
            <p className="text-gray-400 font-sans text-lg max-w-xl">
              {selectedCategoryObj?.description || t('products.pageDescription')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={t('products.searchPlaceholder', 'Search...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-none py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600/50 transition-all font-display tracking-widest uppercase text-sm"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-dark-900 border border-dark-700 text-white px-4 py-2.5 rounded-none font-medium"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-600" />
              {t('products.filters', 'Filters')}
            </button>

            {/* Sort Dropdown */}
            <div className="hidden lg:block">
              <ProductSort currentSort={currentSort} onSortChange={handleSortChange} />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
                mobileOpen={true}
                onMobileClose={() => setIsMobileFilterOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Product Grid Area */}
          <main className="flex-1 min-w-0">
            {/* Mobile Sort Bar (Sticky) */}
            <div className="lg:hidden mb-6 flex justify-end">
              <ProductSort currentSort={currentSort} onSortChange={handleSortChange} />
            </div>

            {/* Loading State */}
            {loading && products.length === 0 ? (
              <ProductGridSkeleton />
            ) : error ? (
              <div className="text-center py-20 bg-dark-900 rounded-none border border-red-900/30">
                <h3 className="text-xl font-bold font-display tracking-wider uppercase text-red-500 mb-2">{t('products.errorTitle')}</h3>
                <p className="text-gray-400 mb-6 font-sans">{error}</p>
                <button
                  onClick={() => fetchProducts(0, true, selectedCategory, selectedSubcategory, searchTerm, currentSort)}
                  className="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-none hover:bg-red-900/30 transition-colors shadow-neon"
                >
                  {t('common.retry')}
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-dark-900 rounded-none border border-dashed border-dark-700">
                <p className="text-2xl text-gray-400 font-display uppercase tracking-wider mb-2">{t('products.noResults')}</p>
                <p className="text-gray-500 font-sans">{t('products.tryAdjusting')}</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    handleCategoryChange(null)
                  }}
                  className="mt-6 px-6 py-2 text-primary-500 border border-primary-600/30 rounded-none hover:bg-primary-600/10 hover:border-primary-500 hover:shadow-neon transition-colors font-display tracking-widest uppercase text-sm"
                >
                  {t('products.clearFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className={`transition-opacity duration-200 ${filtering ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
                  >
                    <AnimatePresence>
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <ProductCard
                            product={product}
                            isWishlisted={favorites.has(product.id)}
                            onToggleWishlist={toggleFavorite}
                            showRating={true}
                            className="h-full"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Load More Trigger */}
                {loadingMore && (
                  <div className="mt-12">
                    <ProductGridSkeleton />
                  </div>
                )}

                <div ref={loadMoreRef} className="h-20 mt-8 flex items-center justify-center">
                  {!hasMore && products.length > 0 && (
                    <span className="text-gray-500 font-display uppercase tracking-widest text-sm border-b border-dark-700 pb-1">
                      {t('products.allProductsLoaded')}
                    </span>
                  )}
                </div>
              </>
            )}
          </main>
        </div>

        {/* Recommendations */}
        <section className="mt-24 pt-12 border-t border-dark-700">
          <ProductRecommendations type="trending" limit={4} />
        </section>

      </div>
    </div>
  )
}
