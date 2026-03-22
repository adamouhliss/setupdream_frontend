import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLongRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import ProductCard from '../ProductCard'

const TrendingSection = () => {
    const { t } = useTranslation()
    const [products, setProducts] = useState<DatabaseProduct[]>([])
    const [loading, setLoading] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const [showDragHint, setShowDragHint] = useState(true)

    // Fetch trending products
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await productAPI.getTrendingProducts(8)
                setProducts(data)
            } catch (err) {
                console.error("Failed to fetch trending products", err)
            } finally {
                setLoading(false)
            }
        }
        fetchTrending()
    }, [])

    const [constraints, setConstraints] = useState({ left: 0, right: 0 })
    const contentRef = useRef<HTMLDivElement>(null)

    // Calculate drag constraints based on content width
    useEffect(() => {
        const updateConstraints = () => {
            if (containerRef.current && contentRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const contentWidth = contentRef.current.scrollWidth

                // Calculate the limit: negative value representing how far left we can drag
                // If content is smaller than container, no dragging needed (0)
                const minX = Math.min(0, containerWidth - contentWidth)

                setConstraints({ left: minX, right: 0 })
            }
        }

        // Update on mount, product change, and resize
        updateConstraints()
        window.addEventListener('resize', updateConstraints)
        return () => window.removeEventListener('resize', updateConstraints)
    }, [products, loading])

    // Hide drag hint on interaction
    useEffect(() => {
        const unsubscribe = x.onChange(() => {
            if (showDragHint) setShowDragHint(false)
        })
        return () => unsubscribe()
    }, [x, showDragHint])

    const scroll = (direction: 'left' | 'right') => {
        const currentX = x.get()
        const containerWidth = containerRef.current?.offsetWidth || 0
        const scrollAmount = containerWidth * 0.6

        let newX = direction === 'left' ? currentX + scrollAmount : currentX - scrollAmount

        // Enforce calculated constraints
        if (newX > constraints.right) newX = constraints.right
        if (newX < constraints.left) newX = constraints.left

        animate(x, newX, {
            type: "spring",
            stiffness: 300,
            damping: 30
        })
    }

    if (!loading && products.length === 0) return null

    return (
        <section className="py-24 bg-gray-950 relative overflow-hidden border-t border-gray-900">
            {/* Dynamic Background Elements */}
            <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3" />

            <div className="max-w-[1920px] mx-auto relative z-10 group/section">

                {/* Header content centered */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 border border-primary-500/50 bg-primary-500/10 text-primary-400 text-xs font-bold tracking-widest uppercase font-display mb-4 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    >
                        {t('products.trending', 'Tendances du moment')}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black font-display uppercase tracking-wider text-white mb-6"
                    >
                        {t('trending.titleSelection')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 font-sans text-lg max-w-2xl mx-auto"
                    >
                        {t('trending.subtitle')}
                    </motion.p>

                    {/* Navigation Buttons - Absolute positioned relative to header/container for desktop */}
                    <div className="hidden md:flex justify-end gap-2 absolute bottom-0 right-8">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-none border border-dark-600 bg-dark-900 hover:bg-primary-600 hover:border-primary-500 hover:text-white hover:shadow-neon flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                            aria-label="Scroll left"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-none border border-dark-600 bg-dark-900 hover:bg-primary-600 hover:border-primary-500 hover:text-white hover:shadow-neon flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                            aria-label="Scroll right"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative w-full" ref={containerRef}>
                    {/* Fade gradients - widened for better blend */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-gray-950 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-gray-950 to-transparent z-20 pointer-events-none" />

                    {/* Drag Hint Overlay - Fades out on first scroll */}
                    <div className={`absolute inset-0 z-30 pointer-events-none flex items-center justify-center transition-opacity duration-700 ${showDragHint ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-black/60 backdrop-blur-md px-6 py-3 border border-primary-500/30 shadow-neon flex items-center gap-3 text-white/80 animate-pulse">
                            <ArrowLongRightIcon className="w-5 h-5 rotate-180 text-primary-500" />
                            <span className="text-xs font-bold uppercase tracking-widest font-display text-primary-400">{t('trending.dragHint')}</span>
                            <ArrowLongRightIcon className="w-5 h-5 text-primary-500" />
                        </div>
                    </div>

                    <motion.div
                        ref={contentRef}
                        className="flex gap-6 md:gap-8 px-8 md:px-[max(2rem,calc(50vw-40rem))] cursor-grab active:cursor-grabbing py-10"
                        drag="x"
                        dragConstraints={constraints}
                        style={{ x }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            // Skeleton Loading
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="min-w-[280px] md:min-w-[350px] aspect-[3/5] bg-dark-900 border border-dark-700 animate-pulse" />
                            ))
                        ) : (
                            products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    className="min-w-[280px] md:min-w-[320px] group relative perspective-1000"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    viewport={{ once: true, margin: "0px 200px 0px 0px" }}
                                >
                                    <ProductCard
                                        product={product}
                                        className="bg-dark-900 border-dark-700 h-full !shadow-none hover:shadow-neon hover:border-primary-500/50 transition-all duration-500"
                                        showRating={false}
                                        priority={idx < 2} // Eager load first 2 items
                                        layout="grid"
                                    />
                                </motion.div>
                            ))
                        )}

                        {/* "See All" Card at the end */}
                        {!loading && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="min-w-[200px] flex items-center justify-center"
                            >
                                <Link to="/products?sort=trending" className="group flex flex-col items-center gap-4 text-white hover:text-primary-400 transition-colors">
                                    <div className="w-20 h-20 rounded-none border border-dark-600 group-hover:border-primary-500 flex items-center justify-center transition-all duration-300 bg-dark-900 group-hover:bg-primary-600/20 group-hover:shadow-neon">
                                        <ArrowLongRightIcon className="w-8 h-8 text-white group-hover:text-primary-400" />
                                    </div>
                                    <span className="font-display font-bold tracking-widest uppercase text-sm">
                                        {t('products.viewAll', 'View All')}
                                    </span>
                                </Link>
                            </motion.div>
                        )}

                    </motion.div>
                </div>

            </div>
        </section>
    )
}

export default TrendingSection
