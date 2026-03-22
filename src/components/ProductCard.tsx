import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    ShoppingCartIcon,
    HeartIcon,
    EyeIcon,
} from '@heroicons/react/24/outline'
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid'
import { DatabaseProduct, convertToCartProduct } from '../services/productApi'
import { getProductPrimaryImage } from '../utils/productImages'
import { getProductUrl } from '../utils/productUrls'
import { formatMAD } from '../utils/currency'
import { useCartStore } from '../store/cartStore'
import OptimizedImage from './OptimizedImage'

export interface ProductCardProps {
    product: DatabaseProduct
    layout?: 'grid' | 'list'
    showQuickAdd?: boolean
    showWishlist?: boolean
    showRating?: boolean
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
                className={`group flex bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 ${className}`}
            >
                {/* Image Section - Left */}
                <div className="relative w-1/3 min-w-[120px] aspect-[4/5] sm:aspect-square bg-white p-2">
                    <Link to={getProductUrl(product)} className="block h-full">
                        <OptimizedImage
                            src={getProductPrimaryImage(product.id, product.image_url)}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            width={200}
                            height={250}
                        />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.stock_quantity <= 0 ? (
                            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                Sold Out
                            </span>
                        ) : (
                            <>
                                {isNew && (
                                    <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        New
                                    </span>
                                )}
                                {product.sale_price && (
                                    <span className="bg-dark-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Content Section - Right */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {product.category?.name || 'Composants'}
                            </span>
                        </div>

                        <Link to={getProductUrl(product)}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                                {product.name}
                            </h3>
                        </Link>

                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-lg font-bold text-primary-600">
                                {formatMAD(product.sale_price || product.price)}
                            </span>
                            {product.sale_price && (
                                <span className="text-sm text-gray-400 line-through">
                                    {formatMAD(product.price)}
                                </span>
                            )}
                        </div>

                        <p className="hidden sm:block text-sm text-gray-600 line-clamp-2 mb-4">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleQuickAdd}
                            disabled={product.stock_quantity <= 0}
                            className={`flex-1 px-4 py-2 rounded-sm text-sm font-bold transition-colors flex items-center justify-center gap-2 ${product.stock_quantity <= 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-dark-900 text-white hover:bg-primary-600'
                                }`}
                        >
                            <ShoppingCartIcon className="w-4 h-4" />
                            {product.stock_quantity <= 0 ? 'Rupture' : 'Ajouter'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Default Grid Layout
    return (
        <div
            className={`group relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-200 flex flex-col h-full ${className}`}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-white p-4">
                <Link to={getProductUrl(product)} className="block w-full h-full flex items-center justify-center">
                    <OptimizedImage
                        src={getProductPrimaryImage(product.id, product.image_url)}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        width={400}
                        height={400}
                        loading={priority ? "eager" : "lazy"}
                        priority={priority}
                    />
                </Link>

                {/* Overlays / Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.stock_quantity <= 0 ? (
                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                            Rupture
                        </span>
                    ) : (
                        <>
                            {isNew && (
                                <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                                    Nouveau
                                </span>
                            )}
                            {product.sale_price && (
                                <span className="bg-dark-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                                    -{discountPercentage}%
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Actions Hover Block */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {showWishlist && (
                        <button
                            onClick={handleWishlist}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:text-primary-600 transition-colors text-gray-400"
                            aria-label="Wishlist"
                        >
                            {isWishlisted ? (
                                <HeartSolidIcon className="w-4 h-4 text-primary-600" />
                            ) : (
                                <HeartIcon className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    <Link
                        to={getProductUrl(product)}
                        className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:text-primary-600 transition-colors text-gray-400"
                        aria-label="Quick View"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col flex-grow bg-white border-t border-gray-100">
                <div className="mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {product.category?.name || 'PC Gamer'}
                    </span>
                </div>

                <Link to={getProductUrl(product)} className="block group-hover:text-primary-600 transition-colors duration-200 mb-2 flex-grow">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                        {product.name}
                    </h3>
                </Link>

                {showRating && (
                    <div className="flex items-center gap-1 mb-2">
                        <StarSolidIcon className="w-3.5 h-3.5 text-gold-400" />
                        <StarSolidIcon className="w-3.5 h-3.5 text-gold-400" />
                        <StarSolidIcon className="w-3.5 h-3.5 text-gold-400" />
                        <StarSolidIcon className="w-3.5 h-3.5 text-gold-400" />
                        <StarSolidIcon className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-[10px] text-gray-400 ml-1">(12)</span>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-black text-primary-600">
                        {formatMAD(product.sale_price || product.price)}
                    </span>
                    {product.sale_price && (
                        <span className="text-xs font-medium text-gray-400 line-through">
                            {formatMAD(product.price)}
                        </span>
                    )}
                </div>

                {/* Add to Cart - Static Button */}
                {showQuickAdd && (
                    <button
                        onClick={handleQuickAdd}
                        disabled={product.stock_quantity <= 0}
                        className={`w-full py-2.5 rounded-sm font-bold transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${product.stock_quantity <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-dark-900 text-white hover:bg-primary-600'
                            }`}
                    >
                        <ShoppingCartIcon className="w-4 h-4" />
                        {product.stock_quantity <= 0 ? t('common.soldOut') : t('common.addToCart')}
                    </button>
                )}
            </div>
        </div>
    )
}
