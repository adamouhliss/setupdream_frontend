import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    ShoppingCartIcon,
    HeartIcon,
    EyeIcon,
} from '@heroicons/react/24/outline'
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
    SparklesIcon
} from '@heroicons/react/24/solid'
import { DatabaseProduct, convertToCartProduct } from '../services/productApi'
import { getProductPrimaryImage } from '../utils/productImages'
import { getProductUrl } from '../utils/productUrls'
import { formatMAD } from '../utils/currency'
import { useCartStore } from '../store/cartStore'
import OptimizedImage from './OptimizedImage'
import PinterestSaveButton from './PinterestSaveButton'

export interface ProductCardProps {
    product: DatabaseProduct
    layout?: 'grid' | 'list'
    showQuickAdd?: boolean
    showWishlist?: boolean
    showRating?: boolean // New: Option to hide ratings if data is sparse
    className?: string
    isWishlisted?: boolean
    onToggleWishlist?: (productId: number) => void
    isNew?: boolean
    priority?: boolean
}

export default function ProductCard({
    product,
    layout = 'grid',
    showQuickAdd = true,
    showWishlist = true,
    showRating = true,
    className = '',
    isWishlisted = false,
    onToggleWishlist,
    isNew = false,
    priority = false
}: ProductCardProps) {
    const { addItem } = useCartStore()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const cartProduct = convertToCartProduct(product)

    // Handlers
    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // If product has sizes or multiple colors, take user to product page to choose
        if ((cartProduct.sizes && cartProduct.sizes.length > 0) || (cartProduct.colors && cartProduct.colors.length > 1)) {
            navigate(getProductUrl(product))
            return
        }

        const selectedSize = cartProduct.sizes && cartProduct.sizes.length > 0 ? cartProduct.sizes[0] : undefined
        addItem(cartProduct, 1, cartProduct.colors[0], selectedSize)
    }

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onToggleWishlist?.(product.id)
    }

    // Visual Helpers
    const discountPercentage = product.sale_price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : 0

    if (layout === 'list') {
        return (
            <div
                className={`group flex bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700/50 ${className}`}
            >
                {/* Image Section - Left */}
                <div className="relative w-1/3 min-w-[120px] aspect-[4/5] sm:aspect-square">
                    <Link to={getProductUrl(product)} className="block h-full">

                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.stock_quantity <= 0 ? (
                            <span className="bg-gray-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-gray-700">
                                Sold Out
                            </span>
                        ) : (
                            <>
                                {isNew && (
                                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                        New
                                    </span>
                                )}
                                {product.is_featured && (
                                    <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                        Star
                                    </span>
                                )}
                                {product.sale_price && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    {/* Pinterest Button List View */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PinterestSaveButton
                            url={window.location.origin + getProductUrl(product)}
                            media={getProductPrimaryImage(product.id, product.image_url)}
                            description={`${product.name} - ${formatMAD(product.sale_price || product.price)} | Carré Sports`}
                            size="sm"
                        />
                    </div>
                </div>


                {/* Content Section - Right */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-gold-500 uppercase tracking-wide">
                                {product.category?.name || 'Equipment'}
                            </span>
                            {showRating && (
                                <div className="flex items-center gap-1">
                                    <StarSolidIcon className="w-3 h-3 text-gold-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">4.8</span>
                                </div>
                            )}
                        </div>

                        <Link to={getProductUrl(product)}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-gold-500 transition-colors mb-2 line-clamp-2">
                                {product.name}
                            </h3>
                        </Link>

                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatMAD(product.sale_price || product.price)}
                            </span>
                            {product.sale_price && (
                                <span className="text-sm text-gray-500 line-through">
                                    {formatMAD(product.price)}
                                </span>
                            )}
                        </div>

                        <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleQuickAdd}
                            disabled={product.stock_quantity <= 0}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${product.stock_quantity <= 0
                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white'
                                }`}
                            aria-label={product.stock_quantity <= 0 ? `${product.name} is Sold Out` : `Add ${product.name} to cart`}
                        >
                            <ShoppingCartIcon className="w-4 h-4" />
                            {product.stock_quantity <= 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                        {showWishlist && (
                            <button
                                onClick={handleWishlist}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gold-500 hover:text-gold-500 transition-colors"
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                {isWishlisted ? (
                                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                                ) : (
                                    <HeartIcon className="w-5 h-5" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div >
        )
    }

    // Default Grid Layout
    return (
        <div
            className={`group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-900/20 transition-all duration-500 border border-gray-100 dark:border-white/5 hover:-translate-y-2 ${className}`}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Link to={getProductUrl(product)} className="block w-full h-full">
                    <OptimizedImage
                        src={getProductPrimaryImage(product.id, product.image_url)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                        width={400}
                        height={500}
                        loading={priority ? "eager" : "lazy"}
                        priority={priority}
                    />
                </Link>

                {/* Overlays / Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    {product.stock_quantity <= 0 ? (
                        <span className="bg-gray-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 font-montserrat border border-gray-700">
                            Sold Out
                        </span>
                    ) : (
                        <>
                            {isNew && (
                                <span className="bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 font-montserrat">
                                    <SparklesIcon className="w-3 h-3" /> New
                                </span>
                            )}
                            {product.is_featured && (
                                <span className="bg-gold-500 text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 font-montserrat border border-gold-400">
                                    <StarSolidIcon className="w-3 h-3" /> Premier
                                </span>
                            )}
                            {product.sale_price && (
                                <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg font-montserrat">
                                    -{discountPercentage}%
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Actions - Desktop Floating */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto delay-75">
                    {showWishlist && (
                        <button
                            onClick={handleWishlist}
                            className="w-10 h-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white dark:hover:text-gray-900 transition-all text-gray-700 dark:text-gray-200"
                            title="Add to Wishlist"
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            {isWishlisted ? (
                                <HeartSolidIcon className="w-5 h-5 text-red-500" />
                            ) : (
                                <HeartIcon className="w-5 h-5" />
                            )}
                        </button>
                    )}
                    <Link
                        to={getProductUrl(product)}
                        className="w-10 h-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-all text-gray-700 dark:text-gray-200"
                        title="Quick View"
                        aria-label={`View details for ${product.name}`}
                    >
                        <EyeIcon className="w-5 h-5" />
                    </Link>
                    <div className="w-10 h-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all text-gray-700 dark:text-gray-200">
                        <PinterestSaveButton
                            url={window.location.origin + getProductUrl(product)}
                            media={getProductPrimaryImage(product.id, product.image_url)}
                            description={`${product.name} - ${formatMAD(product.sale_price || product.price)} | Carré Sports`}
                            size="md"
                            iconOnly={true}
                            className="bg-transparent border-none shadow-none text-current hover:bg-transparent hover:text-current hover:shadow-none w-full h-full p-0"
                        />
                    </div>
                </div>

                {/* Add to Cart - Slide Up on Hover */}
                {showQuickAdd && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 ease-out">
                        <button
                            onClick={handleQuickAdd}
                            disabled={product.stock_quantity <= 0}
                            className={`w-full backdrop-blur-xl py-3.5 rounded-2xl font-bold shadow-2xl transition-all flex items-center justify-center gap-2 text-sm font-montserrat tracking-wide border border-white/10 ${product.stock_quantity <= 0
                                ? 'bg-gray-300/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white hover:bg-gold-500 hover:text-gray-900 dark:hover:bg-gold-500 dark:hover:text-gray-900'
                                }`}
                            aria-label={product.stock_quantity <= 0 ? `${product.name} is Sold Out` : `Add ${product.name} to cart`}
                        >
                            <ShoppingCartIcon className="w-4 h-4" />
                            {product.stock_quantity <= 0 ? t('common.soldOut') : t('common.quickAdd')}
                        </button>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.2em] font-montserrat">
                        {product.category?.name || 'Sport'}
                    </span>
                    {showRating && (
                        <div className="flex items-center gap-1">
                            <StarSolidIcon className="w-3 h-3 text-gold-400" />
                            <span className="text-xs font-bold text-gray-400 font-montserrat">4.8</span>
                        </div>
                    )}
                </div>

                <Link to={getProductUrl(product)} className="block group-hover:text-gold-500 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 font-playfair tracking-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-montserrat">
                        {formatMAD(product.sale_price || product.price)}
                    </span>
                    {product.sale_price && (
                        <span className="text-xs font-medium text-gray-400 line-through font-montserrat">
                            {formatMAD(product.price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
