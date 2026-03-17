import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BoltIcon } from '@heroicons/react/24/solid'
import { productAPI, DatabaseProduct } from '../../services/productApi'
import ProductCard from '../ProductCard'

const FlashSale = () => {
    const { t } = useTranslation()
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 30
    })
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                // Fetch more products to find ones with sale_price
                const data = await productAPI.getProducts({ limit: 20 })
                if (data && data.items) {
                    // Filter for products that have a sale price
                    const saleItems = data.items
                        .filter((p: DatabaseProduct) => p.sale_price && p.sale_price < p.price)
                        .slice(0, 4)

                    setProducts(saleItems)
                }
            } catch (error) {
                console.error("Failed to fetch flash sale products", error)
            }
        }

        fetchSaleProducts()

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
                return prev
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative z-30 py-12 md:py-16 px-4 pb-12 pointer-events-none bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative pointer-events-auto"
            >
                {/* Decorative gradients */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
                <div className="absolute -left-32 -top-32 w-80 h-80 bg-red-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-gold-600/10 rounded-full blur-[120px]"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 mb-12">

                    {/* Left: Heading */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <BoltIcon className="w-4 h-4 text-red-500 animate-pulse" />
                            </div>
                            <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-xs font-montserrat">
                                {t('urgency.limitedTime', 'Offre Limitée')}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-playfair leading-tight">
                            {t('cro.flashSale.title', 'Vente Flash')}
                        </h2>
                        <p className="text-gray-400 mt-2 font-light font-lora text-sm md:text-base max-w-sm">
                            {t('cro.flashSale.description', 'Une sélection exclusive de produits premium à prix exceptionnel.')}
                        </p>
                    </div>

                    {/* Center: Timer */}
                    <div className="flex gap-4 md:gap-8 bg-gray-950/30 p-6 rounded-2xl border border-white/5">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="flex flex-col items-center min-w-[60px]">
                                <span className="text-3xl md:text-4xl font-bold text-gold-400 font-playfair tabular-nums">
                                    {value.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase mt-1 font-montserrat tracking-widest">
                                    {unit}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right: CTA */}
                    <div>
                        <Link
                            to="/products?sale=true"
                            className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gold-400 hover:text-gray-900 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] font-montserrat hover:-translate-y-1"
                        >
                            {t('cro.flashSale.cta', 'Accéder aux Offres')}
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                </div>

                {/* Flash Sale Products Grid */}
                {products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                className="bg-gray-900/40 backdrop-blur-sm border-white/5"
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </section>
    )
}

export default FlashSale
