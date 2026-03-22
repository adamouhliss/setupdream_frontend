import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLongRightIcon, StarIcon } from '@heroicons/react/24/solid'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import { getProductPrimaryImage } from '../../utils/productImages'
import { getProductUrl } from '../../utils/productUrls'
import { formatMAD } from '../../utils/currency'

const FeaturedCollection = () => {
    const { t, i18n } = useTranslation()
    const [products, setProducts] = useState<DatabaseProduct[]>([])
    const isRTL = i18n.dir() === 'rtl'

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productAPI.getFeaturedProducts()
                setProducts(data.slice(0, 4))
            } catch (err) {
                console.error("Failed to fetch featured collection", err)
            }
        }
        fetchProducts()
    }, [])

    if (products.length === 0) return null

    const heroProduct = products[0]
    const sideProducts = products.slice(1, 4)

    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden">
            {/* Background Decorative Blob */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-primary-500 font-bold uppercase tracking-widest text-xs font-display"
                        >
                            {t('products.trending', 'Tendance')}
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold font-display uppercase tracking-wider text-white mt-3"
                        >
                            {t('products.featured', 'La Collection Vedette')}
                        </motion.h2>
                    </div>
                    <Link
                        to="/products?sort=featured"
                        className="group flex items-center gap-2 text-primary-500 hover:text-primary-400 font-bold uppercase tracking-widest transition-colors font-display text-sm border-b border-transparent hover:border-primary-400 pb-1"
                    >
                        {t('products.viewAll', 'Voir toute la collection')}
                        <ArrowLongRightIcon className={`w-6 h-6 transition-transform ${isRTL ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2'}`} />
                    </Link>
                </div>

                {/* Editorial "Bento" Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">

                    {/* Hero Product (Large Left/Top) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 relative group overflow-hidden rounded-none bg-dark-900 border border-dark-700 h-[400px] lg:h-full hover:border-primary-500/50 hover:shadow-neon transition-all duration-300"
                    >
                        <Link to={getProductUrl(heroProduct)} className="block h-full relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
                            <img
                                src={getProductPrimaryImage(heroProduct.id, heroProduct.image_url)}
                                alt={heroProduct.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            <div className="absolute top-6 left-6 z-20 bg-primary-600 text-white px-4 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider font-display shadow-neon">
                                {t('urgency.bestSeller', 'Must Have')}
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                                <span className="text-primary-400 font-bold mb-2 block text-sm tracking-widest font-display uppercase">
                                    {heroProduct.category?.name}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display uppercase tracking-wider leading-tight max-w-xl">
                                    {heroProduct.name}
                                </h3>
                                <div className="flex items-center gap-6">
                                    <p className="text-2xl text-white font-bold font-display">
                                        {formatMAD(heroProduct.sale_price || heroProduct.price)}
                                    </p>
                                    <span className="flex items-center gap-2 text-sm font-bold text-primary-500 uppercase tracking-widest opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100">
                                        {t('products.buyNow', 'Discover')} <ArrowLongRightIcon className="w-5 h-5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Side Products (Stack Right/Bottom) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                        {sideProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                                viewport={{ once: true }}
                                className="flex-1 relative group overflow-hidden rounded-none bg-dark-900 border border-dark-700 hover:border-primary-500/50 hover:shadow-neon transition-all duration-300"
                            >
                                <Link to={getProductUrl(product)} className="flex h-full items-center">
                                    <div className="w-1/3 h-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/80 z-10" />
                                        <img
                                            src={getProductPrimaryImage(product.id, product.image_url)}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="w-2/3 p-6 flex flex-col justify-center relative z-20">
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className="w-3 h-3 text-primary-500" />
                                            ))}
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-1 font-display uppercase group-hover:text-primary-400 transition-colors">
                                            {product.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 font-sans mb-3 tracking-wider">{product.category?.name}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <p className="text-lg font-bold font-display tracking-widest text-gray-200">
                                                {formatMAD(product.sale_price || product.price)}
                                            </p>
                                            <div className="w-10 h-10 rounded-none bg-dark-800 border border-dark-600 flex items-center justify-center text-white transform group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-500 group-hover:shadow-neon transition-all duration-300">
                                                <ArrowLongRightIcon className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default FeaturedCollection
