import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function LiveViewers({ min = 3, max = 15 }) {
    const { t } = useTranslation()
    const [viewers, setViewers] = useState(Math.floor(Math.random() * (max - min)) + min)

    useEffect(() => {
        const interval = setInterval(() => {
            // Random walk: change by -2 to +3
            const change = Math.floor(Math.random() * 6) - 2
            setViewers(prev => Math.max(min, Math.min(max, prev + change)))
        }, 5000)
        return () => clearInterval(interval)
    }, [min, max])

    return (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-400 bg-gray-800/30 px-3 py-1.5 rounded-full w-fit">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <AnimatePresence mode="wait">
                <motion.span
                    key={viewers}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    {viewers}
                </motion.span>
            </AnimatePresence>
            <span>{t('product.peopleViewing', 'people are viewing this right now')}</span>
        </div>
    )
}
