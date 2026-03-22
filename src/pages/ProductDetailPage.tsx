import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  HeartIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '../store/cartStore'
import { useStoreSettingsStore } from '../store/storeSettingsStore'
import { formatMAD } from '../utils/currency'
import { productAPI, DatabaseProduct, convertToCartProduct } from '../services/productApi'
import { getProductPrimaryImage, productImages } from '../utils/productImages'
import { getImageUrl } from '../utils/imageUrl'
import { useSEO } from '../hooks/useSEO'
import { generateProductSchema, generateBreadcrumbSchema, generateMetaDescription } from '../utils/seoUtils'
import ImageLightbox from '../components/ImageLightbox'
import ImageCarousel from '../components/ImageCarousel'
import OptimizedImage from '../components/OptimizedImage'
import LiveViewers from '../components/sales/LiveViewers'
import TrustAccordion from '../components/common/TrustAccordion'
import SocialShare from '../components/SocialShare'
import PinterestSaveButton from '../components/PinterestSaveButton'
import { extractProductIdFromSlug } from '../utils/slugUtils'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const productId = slug ? extractProductIdFromSlug(slug) : null
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [product, setProduct] = useState<DatabaseProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showStickyBar, setShowStickyBar] = useState(false)

  const { addItem } = useCartStore()
  const { settings } = useStoreSettingsStore()
  const addToCartBtnRef = useRef<HTMLButtonElement>(null)

  // Scroll detection for Sticky Bar
  useEffect(() => {
    const handleScroll = () => {
      if (addToCartBtnRef.current) {
        const btnRect = addToCartBtnRef.current.getBoundingClientRect()
        // Show sticky bar when the main add to cart button scrolls out of view (top < 0)
        // or effectively when it's above the viewport
        setShowStickyBar(btnRect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // SEO Optimization for product page
  useSEO({
    title: product
      ? t('seo.product.titleTemplate').replace('%s', product.name)
      : t('products.loading'),
    description: product
      ? generateMetaDescription(
        t('seo.product.descriptionTemplate').replace('%s', product.name),
        160
      )
      : t('products.pageDescription'),
    keywords: product
      ? t('seo.product.keywordsTemplate')
        .replace('%s', product.name)
        .replace('%s', product.category?.name || 'equipment')
      : t('seo.products.keywords'),
    type: 'product',
    image: product ? getProductPrimaryImage(product.id, product.image_url) : undefined,
    price: product?.sale_price || product?.price,
    currency: 'MAD',
    availability: product?.stock_quantity && product.stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
    brand: product?.brand || 'SetupDream',
    category: product?.category?.name,
    structuredData: product ? {
      ...generateProductSchema(product),
      ...generateBreadcrumbSchema([
        { name: t('navigation.home'), url: window.location.origin },
        { name: t('navigation.products'), url: `${window.location.origin}/products` },
        ...(product.category ? [{
          name: product.category.name,
          url: `${window.location.origin}/products?category=${product.category_id}`
        }] : []),
        { name: product.name }
      ])
    } : undefined
  })

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      // Handle Preview Mode
      if (slug === 'preview') {
        try {
          const previewData = localStorage.getItem('product_preview')
          if (previewData) {
            const parsedData = JSON.parse(previewData)
            setProduct({
              ...parsedData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              view_count: 0,
              sales_count: 0,
              is_active: true,
              images: parsedData.images || [] // Ensure images array exists
            })

            // Set defaults for preview
            if (parsedData.colors) setSelectedColor(parsedData.colors) // Form data uses 'color' string, but might need adjustment
            else if (parsedData.color) setSelectedColor(parsedData.color)

            if (parsedData.sizes && parsedData.sizes.length > 0) {
              setSelectedSize(parsedData.sizes[0])
            }
          }
        } catch (e) {
          console.error('Failed to load preview', e)
        }
        setLoading(false)
        return
      }

      if (!productId) {
        setError('Product ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const productData = await productAPI.getProductById(productId)
        setProduct(productData)

        // Set default selected color
        const cartProduct = convertToCartProduct(productData)
        if (cartProduct.colors[0]) {
          setSelectedColor(cartProduct.colors[0])
        } else if (productData.variants && productData.variants.length > 0) {
          const firstVariantColor = productData.variants.find(v => v.color && v.is_active)?.color
          if (firstVariantColor) setSelectedColor(firstVariantColor)
        }

        // Set default selected size if available
        if (productData.sizes && productData.sizes.length > 0) {
          const parsedSizes = Array.isArray(productData.sizes) ? productData.sizes : [productData.sizes]
          if (parsedSizes[0]) setSelectedSize(parsedSizes[0])
        } else if (productData.variants && productData.variants.length > 0) {
          const firstVariantSize = productData.variants.find(v => v.size && v.is_active)?.size
          if (firstVariantSize) setSelectedSize(firstVariantSize)
        }

      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('products.notFound')}</h2>
        <Link to="/products" className="px-6 py-2 bg-primary-600 text-gray-900 rounded-xl">
          {t('products.backToProducts')}
        </Link>
      </div>
    )
  }

  const cartProduct = convertToCartProduct(product)

  // --- Variant-aware helpers ---
  const hasVariants = product.variants && product.variants.length > 0

  // Find the matching variant for the currently selected size+color
  const activeVariant = hasVariants
    ? product.variants!.find(v => {
      const sizeMatch = !v.size || !selectedSize || v.size === selectedSize
      const colorMatch = !v.color || !selectedColor || v.color === selectedColor
      return sizeMatch && colorMatch && v.is_active
    })
    : null

  // Effective stock: use variant stock if variant system is active, else product-level stock
  const effectiveStock = activeVariant
    ? activeVariant.stock_quantity - (activeVariant.reserved_quantity || 0)
    : product.stock_quantity

  // Effective price: use variant price_override if set, else product-level price
  const effectivePrice = activeVariant?.price_override ?? product.sale_price ?? product.price
  const showOriginalPrice = (activeVariant?.price_override && activeVariant.price_override !== product.price)
    || (product.sale_price && product.sale_price !== product.price)

  // Helper: get stock for a specific size (to show stock badges on size buttons)
  const getStockForSize = (size: string): number | null => {
    if (!hasVariants) return null
    const matchingVariants = product.variants!.filter(v => v.size === size && v.is_active)
    if (matchingVariants.length === 0) return null
    // If a color is selected, filter further
    if (selectedColor) {
      const exact = matchingVariants.find(v => v.color === selectedColor)
      if (exact) return exact.stock_quantity - (exact.reserved_quantity || 0)
    }
    // Otherwise sum all variants for this size
    return matchingVariants.reduce((sum, v) => sum + v.stock_quantity - (v.reserved_quantity || 0), 0)
  }

  // Get images from database first, then fallback to hardcoded images
  const images = product.images && product.images.length > 0
    ? product.images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => getImageUrl(img.image_url))
    : product.image_url
      ? [getImageUrl(product.image_url)]
      : productImages[product.id] || [getProductPrimaryImage(product.id, product.image_url)]

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case 'black': return 'bg-black'
      case 'white': return 'bg-white border-2 border-gray-300'
      case 'gold': return 'bg-gradient-to-r from-primary-500 to-gold-600'
      case 'blue': return 'bg-blue-500'
      case 'navy': return 'bg-blue-900'
      case 'purple': return 'bg-purple-500'
      case 'green': return 'bg-green-500'
      case 'pink': return 'bg-pink-500'
      case 'clear': return 'bg-gray-100 border-2 border-gray-300'
      case 'silver': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  // Strict stock limit enforcement (variant-aware)
  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    if (newQty > effectiveStock) return
    setQuantity(newQty)
  }

  const handleAddToCart = () => {
    addItem(cartProduct, quantity, selectedColor, selectedSize)

    // Show success feedback
    const buttons = document.querySelectorAll('.add-to-cart-btn')
    buttons.forEach(button => {
      const originalText = effectiveStock === 0 ? t('products.outOfStock') : t('products.addToCart')
      button.textContent = `${t('products.added')} ✓`
      button.classList.add('bg-green-600', 'border-green-600')
      setTimeout(() => {
        button.textContent = originalText
        button.classList.remove('bg-green-600', 'border-green-600')
      }, 2000)
    })
  }

  const handleWhatsAppOrder = () => {
    const whatsappNumber = settings?.store_phone?.replace(/[^0-9]/g, '') || '212632253960'
    const message = t('products.whatsappMessage', {
      name: product.name,
      price: formatMAD(product.sale_price || product.price)
    })
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setShowLightbox(true)
  }

  const discountPercentage = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-transparent text-gray-100 pb-24 md:pb-0">

      {/* Desktop Split Layout Container */}
      <div className="lg:flex lg:gap-12 max-w-[1600px] mx-auto pt-0 lg:pt-24 lg:px-12"> {/* Standardized Mobile/Desktop Padding */}

        {/* LEFT COLUMN: Image Gallery (Scrolls naturally) */}
        <div className="lg:w-[60%] space-y-4">
          {/* Back Button (Mobile Only) */}
          <div className="absolute top-4 left-4 z-30 lg:hidden"> {/* Adjusted button position */}
            <button
              onClick={() => navigate('/products')}
              className="w-8 h-8 bg-gray-50 shadow-sm rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-gray-900 transition-all shadow-sm border border-gray-200"
            >
              <ArrowLeftIcon className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          <div className="lg:hidden px-4 pt-1 pb-2 space-y-1"> {/* Reduced top padding to absolute minimum (pt-1) */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-medium text-gray-600 uppercase tracking-widest font-montserrat">
                {product.category?.name}
                <span className="text-gray-600">•</span>
                {product.subcategory?.name || t('categories.equipment')}
              </div>
              {/* Rating Badge */}
              <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                <StarSolidIcon className="w-3 h-3 text-primary-500 mr-1" />
                <span className="text-[10px] font-bold text-gray-900">4.9</span>
              </div>
            </div>

            <h1 className="text-xl font-black font-montserrat text-gray-900 uppercase leading-tight tracking-tight mt-1">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              {product.sale_price ? (
                <>
                  <span className="text-lg font-bold text-red-500 font-montserrat">{formatMAD(product.sale_price)}</span>
                  <span className="text-sm text-gray-500 line-through font-montserrat">{formatMAD(product.price)}</span>
                  <span className="bg-red-900/30 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-900/50">
                    -{discountPercentage}%
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900 font-montserrat">{formatMAD(product.price)}</span>
              )}
            </div>
          </div>

          {/* Badges (Floating on first image area for Desktop) */}
          <div className="hidden lg:flex absolute top-28 left-16 z-20 flex-col gap-2 pointer-events-none">
            {product.is_featured && (
              <span className="bg-primary-600 text-gray-900 text-xs font-bold font-montserrat px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                {t('products.starProduct')}
              </span>
            )}
            {product.sale_price && (
              <span className="bg-red-500 text-gray-900 text-xs font-bold font-montserrat px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Desktop: 2-Column Grid Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`group relative cursor-zoom-in overflow-hidden rounded-xl bg-gray-50 border border-gray-200 ${idx === 0 && images.length % 2 !== 0 ? 'col-span-2 aspect-[16/10]' : 'col-span-1 aspect-[3/4]'
                  }`}
                onClick={() => openLightbox(idx)}
              >
                <OptimizedImage
                  src={img}
                  alt={`${product.name} ${idx}`}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
                  width={idx === 0 && images.length % 2 !== 0 ? 800 : 400}
                  height={idx === 0 && images.length % 2 !== 0 ? 500 : 533}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  priority={idx === 0}
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <PinterestSaveButton
                    url={window.location.href}
                    media={img}
                    description={`${product.name} - ${formatMAD(product.sale_price || product.price)} | SetupDream`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Carousel (Unchanged) */}
          <div className="lg:hidden w-full aspect-[3/4] relative">
            {/* Mobile Badges */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end pointer-events-none">
              {product.is_featured && (
                <span className="bg-primary-600 text-gray-900 text-xs font-bold font-montserrat px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                  {t('products.starProduct')}
                </span>
              )}
              {product.sale_price && (
                <span className="bg-red-500 text-gray-900 text-xs font-bold font-montserrat px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                  -{discountPercentage}%
                </span>
              )}
            </div>
            <ImageCarousel images={images} alt={product.name} onImageClick={openLightbox} />
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details (Sticky) */}
        <div className="lg:w-[40%] relative">
          <div className="sticky top-24 h-fit pb-12">
            <div className="space-y-8 py-6 px-4 lg:px-0">

              {/* Header Info (Desktop Only - Hidden on Mobile) */}
              <div className="space-y-4 hidden lg:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 uppercase tracking-widest font-montserrat">
                    {product.category?.name}
                    <span className="text-gray-600">•</span>
                    {product.subcategory?.name || t('categories.equipment')}
                  </div>
                  <div className="flex items-center gap-1 text-primary-600">
                    <StarSolidIcon className="w-4 h-4" />
                    <span className="text-sm font-bold text-gray-900">4.9</span>
                    <span className="text-xs text-gray-600 underline decoration-gray-600 decoration-dotted underline-offset-4 cursor-pointer hover:text-gray-300">
                      (128 {t('products.reviews')})
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-playfair text-gray-900 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-gray-900 font-montserrat">
                    {formatMAD(effectivePrice)}
                  </span>
                  {showOriginalPrice && (
                    <span className="text-xl text-gray-500 line-through font-montserrat">
                      {formatMAD(product.price)}
                    </span>
                  )}
                </div>

                {/* Urgency & Social Proof */}
                <div className="flex flex-col gap-3 pt-2">
                  <LiveViewers />
                  {effectiveStock < 5 && effectiveStock > 0 && (
                    <p className="text-red-400 text-sm font-bold animate-pulse">
                      🔥 Hurry! Only {effectiveStock} left in stock{activeVariant ? ` (${selectedSize || ''} ${selectedColor || ''})`.trim() : ''}.
                    </p>
                  )}
                  {effectiveStock === 0 && hasVariants && (
                    <p className="text-red-400 text-sm font-bold">
                      {t('products.outOfStock')}{selectedSize ? ` — ${selectedSize}` : ''}{selectedColor ? ` / ${selectedColor}` : ''}
                    </p>
                  )}
                  {(product.sale_price || activeVariant?.price_override) && (
                    <p className="text-blue-400 text-sm font-semibold">
                      ⚡ Order in the next 2 hours for dispatch today!
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-50" />

              {/* Configuration: Color & Size */}
              <div className="space-y-6">
                {/* Colors - merge from product.color AND variants */}
                {(() => {
                  const allColors: string[] = []
                  // From product.color field (slash-separated)
                  if (product.color) {
                    product.color.split('/').forEach(c => {
                      const trimmed = c.trim()
                      if (trimmed && !allColors.includes(trimmed)) allColors.push(trimmed)
                    })
                  }
                  // From variants
                  if (product.variants && product.variants.length > 0) {
                    product.variants.forEach(v => {
                      if (v.color && v.is_active && !allColors.includes(v.color)) {
                        allColors.push(v.color)
                      }
                    })
                  }
                  if (allColors.length === 0) return null
                  return (
                    <div>
                      <span className="block text-sm font-bold text-gray-900 uppercase mb-3">
                        {t('products.color')}: <span className="text-gray-600 font-normal capitalize">{selectedColor}</span>
                      </span>
                      <div className="flex gap-3">
                        {allColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedColor === color
                              ? 'border-primary-600 ring-2 ring-primary-600/30 scale-110'
                              : 'border-transparent ring-1 ring-gray-700 hover:scale-105'
                              } ${getColorClass(color)} shadow-sm`}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* Sizes - merge from product.sizes AND variants */}
                {(() => {
                  const allSizes: string[] = []
                  // From product.sizes field (JSON array)
                  if (product.sizes) {
                    const parsedSizes = Array.isArray(product.sizes)
                      ? product.sizes
                      : typeof product.sizes === 'string'
                        ? (() => { try { return JSON.parse(product.sizes) } catch { return [product.sizes] } })()
                        : []
                    parsedSizes.forEach((s: string) => {
                      if (s && !allSizes.includes(s)) allSizes.push(s)
                    })
                  }
                  // From variants
                  if (product.variants && product.variants.length > 0) {
                    product.variants.forEach(v => {
                      if (v.size && v.is_active && !allSizes.includes(v.size)) {
                        allSizes.push(v.size)
                      }
                    })
                  }

                  if (allSizes.length === 0) return null;

                  return (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-900 uppercase">
                          {t('products.size')}: <span className="text-gray-600 font-normal">{selectedSize}</span>
                        </span>
                        <button className="text-xs text-gray-600 underline hover:text-primary-600">{t('products.sizeGuide')}</button>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {allSizes.map((size) => {
                          const sizeStock = getStockForSize(size)
                          const isOutOfStock = sizeStock !== null && sizeStock <= 0
                          return (
                            <button
                              key={size}
                              onClick={() => !isOutOfStock && setSelectedSize(size)}
                              disabled={isOutOfStock}
                              className={`py-3 rounded-lg text-sm font-bold border transition-all relative ${selectedSize === size
                                ? 'border-primary-600 bg-primary-600 text-gray-900 shadow-md'
                                : isOutOfStock
                                  ? 'border-gray-200 text-gray-600 bg-white cursor-not-allowed line-through opacity-50'
                                  : 'border-gray-200 text-gray-300 hover:border-gray-500 bg-gray-50'
                                }`}
                            >
                              {size}
                              {sizeStock !== null && sizeStock > 0 && sizeStock <= 3 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-gray-900 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                  {sizeStock}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  {/* Quantity Input */}
                  <div className="flex items-center border border-gray-200 rounded-xl max-w-[140px] w-full bg-gray-50">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-3 text-gray-600 hover:text-primary-600 disabled:opacity-30 transition-colors text-lg"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-full text-center bg-transparent border-none focus:ring-0 text-gray-900 font-bold py-3 p-0"
                      min="1"
                      max={effectiveStock}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-3 text-gray-600 hover:text-primary-600 disabled:opacity-30 transition-colors text-lg"
                      disabled={quantity >= effectiveStock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    ref={addToCartBtnRef}
                    onClick={handleAddToCart}
                    disabled={effectiveStock === 0}
                    className={`add-to-cart-btn flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold font-montserrat uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${effectiveStock === 0
                      ? 'bg-gray-50 text-gray-500 cursor-not-allowed border border-gray-200'
                      : 'bg-primary-600 text-gray-900 hover:bg-gold-600'
                      }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    {effectiveStock === 0 ? t('products.outOfStock') : t('products.addToCart')}
                  </button>

                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-full sm:w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center hover:border-red-500 hover:bg-red-900/10 transition-colors bg-gray-50"
                  >
                    {isFavorite ? <HeartSolidIcon className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-gray-600" />}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-sm underline decoration-dotted underline-offset-4"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {t('products.orderWhatsApp')}
                  </button>
                </div>

                <div className="flex justify-center pt-4">
                  <SocialShare title={product.name} />
                </div>
              </div>

              <div className="h-px bg-gray-50" />

              {/* Description & Details */}
              <div className="prose prose-invert max-w-none text-gray-300 font-lora">
                <h3 className="text-xl font-bold font-playfair text-gray-900 mb-4">{t('products.description')}</h3>
                <p className="leading-relaxed">{product.description}</p>
              </div>

              {/* Trust Accordions */}
              <div className="border-t border-gray-200">
                <TrustAccordion title={t('products.shippingReturns')} icon={TruckIcon}>
                  <p>{t('products.shippingReturnsDesc')}</p>
                </TrustAccordion>
                <TrustAccordion title={t('products.careInstructions')} icon={ArrowPathIcon}>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{t('products.care.wash')}</li>
                    <li>{t('products.care.bleach')}</li>
                    <li>{t('products.care.dry')}</li>
                    <li>{t('products.care.iron')}</li>
                  </ul>
                </TrustAccordion>

                <TrustAccordion title={t('products.question')} icon={QuestionMarkCircleIcon}>
                  <p>{t('products.questionDesc')}</p>
                </TrustAccordion>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile "Add to Cart" Bar */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.5)] px-4 py-3 md:hidden"
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 line-clamp-1">{product.name}</p>
                  <p className="font-bold text-gray-900">{formatMAD(product.sale_price || product.price)}</p>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-primary-600 text-gray-900 hover:bg-gold-600 font-bold uppercase text-sm py-3 rounded-lg shadow-lg"
                >
                  {product.stock_quantity === 0 ? 'Out' : t('products.addToCart')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Desktop CTA (Optional - small pill at top right) */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-white shadow-sm shadow-xl border border-gray-200 rounded-full px-6 py-2 items-center gap-6"
            >
              <div className="flex items-center gap-3">
                <OptimizedImage src={images[0]} alt="thumbnail" className="w-8 h-8 rounded-full object-cover" width={32} height={32} />
                <span className="font-bold text-gray-900 text-sm">{product.name}</span>
              </div>
              <div className="h-6 w-px bg-gray-700" />
              <span className="font-bold text-primary-600">{formatMAD(product.sale_price || product.price)}</span>
              <button
                onClick={handleAddToCart}
                className="bg-primary-600 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase hover:bg-gold-600 transition-colors"
              >
                {t('products.add')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Lightbox */}
        {showLightbox && (
          <ImageLightbox
            images={images}
            currentIndex={lightboxIndex}
            isOpen={showLightbox}
            onClose={() => setShowLightbox(false)}
            onNavigate={setLightboxIndex}
            productName={product.name}
          />
        )}
      </div>
    </div>
  )
}
