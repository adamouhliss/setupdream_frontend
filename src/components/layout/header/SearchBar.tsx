import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { productAPI, DatabaseProduct } from '../../../services/productApi'
import { getProductPrimaryImage } from '../../../utils/productImages'

interface SearchBarProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<DatabaseProduct[]>([])
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            setQuery('')
            setResults([])
        }
    }, [isOpen])

    // Debounced search
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const response = await productAPI.getProducts({ search: query.trim(), limit: 5 })
                // Sort by relevance logic if needed, API handles basic matching
                setResults(response.items)
            } catch (error) {
                console.error('Search failed:', error)
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchResults, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`)
            onClose()
        }
    }

    const handleResultClick = (productId: number) => {
        navigate(`/products/${productId}`)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-x-0 top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-2xl"
                >
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                        {/* Search Input Area */}
                        <div className="flex items-center gap-4 h-12">
                            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3">
                                <MagnifyingGlassIcon className={`w-6 h-6 ${loading ? 'text-gold-400 animate-pulse' : 'text-gold-500'}`} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('common.searchPlaceholder')}
                                    className="flex-1 bg-transparent border-none text-white text-lg placeholder-gray-500 focus:ring-0 focus:outline-none font-montserrat"
                                />
                            </form>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Live Results Dropdown */}
                        {(results.length > 0 || query.trim()) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-t border-gray-800 pt-4 pb-2"
                            >
                                {results.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {/* Products Preview */}
                                        {results.map((product) => {
                                            const image = getProductPrimaryImage(product.id, product.image_url)
                                            return (
                                                <div
                                                    key={product.id}
                                                    onClick={() => handleResultClick(product.id)}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors group"
                                                >
                                                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700 group-hover:border-gold-500/30 transition-colors">
                                                        <img
                                                            src={image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-gray-200 font-medium font-montserrat group-hover:text-gold-400 transition-colors line-clamp-1">{product.name}</h4>
                                                        <p className="text-gray-400 text-sm font-lora">
                                                            {product.sale_price ? (
                                                                <>
                                                                    <span className="text-red-400 font-bold">{product.sale_price} DH</span>
                                                                    <span className="text-gray-600 line-through ml-2 text-xs">{product.price} DH</span>
                                                                </>
                                                            ) : (
                                                                <span>{product.price} DH</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    query.trim() && !loading && (
                                        <p className="text-gray-500 text-sm font-montserrat py-2">
                                            {t('common.searchNoResults')}
                                        </p>
                                    )
                                )}

                                {/* View All Button */}
                                {results.length > 0 && (
                                    <button
                                        onClick={(e) => handleSearch(e)}
                                        className="w-full mt-4 py-3 text-center text-sm font-semibold text-gold-400 hover:text-gold-300 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800 hover:border-gold-500/30"
                                    >
                                        {t('common.viewAllResults', { query })}
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
