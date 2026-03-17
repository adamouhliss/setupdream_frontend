import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function RamadanBanner() {
    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-emerald-950 relative overflow-hidden"
            >
                {/* Subtle geometric pattern / glow behind text */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10">
                    <div className="flex items-center justify-between">
                        {/* Empty div for flex balancing if needed, or left aligned icons */}
                        <div className="hidden sm:block w-8"></div>

                        <div className="flex-1 flex items-center justify-center gap-2 text-center">
                            <span className="text-gold-400 animate-pulse">🌙</span>
                            <p className="text-sm font-medium text-emerald-50">
                                <span className="font-playfair text-gold-400 mr-2">{t('ramadan.greeting', 'Ramadan Mubarak')}</span>
                                <span className="hidden sm:inline">|</span>
                                <span className="sm:ml-2 font-montserrat">{t('ramadan.offer', 'Shop our special holy month collection.')}</span>
                            </p>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors"
                            aria-label="Close banner"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
