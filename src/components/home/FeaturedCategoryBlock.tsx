import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import ProductCard from '../ProductCard'
import { DatabaseProduct } from '../../services/productApi'

interface FeaturedCategoryBlockProps {
    title: string
    subtitle?: string
    bannerImage: string
    bannerLink: string
    products: DatabaseProduct[]
    layout?: 'grid2x2' | 'row4'
}

export default function FeaturedCategoryBlock({
    title,
    subtitle,
    bannerImage,
    bannerLink,
    products,
    layout = 'grid2x2'
}: FeaturedCategoryBlockProps) {
    if (!products || products.length === 0) return null

    return (
        <section className="py-8 bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    
                    {/* Left Promo Banner */}
                    <div className="lg:w-1/4 relative rounded-md overflow-hidden min-h-[300px] lg:min-h-full group">
                        <div className="absolute inset-0 bg-dark-950">
                            <img 
                                src={bannerImage} 
                                alt={title} 
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/60 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 p-8 flex flex-col justify-end h-full z-10 w-full">
                            <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-wider mb-2 leading-tight drop-shadow-lg">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-gray-300 text-sm mb-6 drop-shadow-md">{subtitle}</p>
                            )}
                            <Link 
                                to={bannerLink}
                                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-white hover:text-primary-600 text-white font-bold py-3 px-6 rounded-sm w-full lg:w-fit transition-colors uppercase tracking-widest text-xs shadow-md"
                            >
                                Voir Plus <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Products Grid */}
                    <div className={`lg:w-3/4 grid gap-4 ${layout === 'row4' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2'}`}>
                        {products.slice(0, layout === 'grid2x2' ? 4 : 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
