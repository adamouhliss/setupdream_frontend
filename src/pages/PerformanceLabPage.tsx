
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    BeakerIcon,
    ChartBarIcon,
    BoltIcon,
    ShieldCheckIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline'

import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import performanceData from '../data/performanceMetrics.json'
import performanceArticles from '../data/performanceArticles.json'
import { useSEO } from '../hooks/useSEO'
import PinterestSaveButton from '../components/PinterestSaveButton'

// Asset for background
// @ts-ignore
import heroBg from '../assets/hero-bg.png'

const PerformanceLabPage = () => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en' as 'en' | 'fr'

    // Helper to get localized string from data
    const getLoc = (obj: any) => {
        if (!obj) return ''
        if (typeof obj === 'string') return obj
        return obj[currentLang] || obj['en'] || ''
    }

    const [activeCategory, setActiveCategory] = useState(performanceData.categories[0].id)
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index)
    }

    // Schema.org JSON-LD
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Carré Sport Technical Performance Index",
        "description": "Technical specifications and performance metrics for professional sports equipment including boxing gloves, resistance bands, and footwear.",
        "url": window.location.href,
        "license": "https://creativecommons.org/licenses/by-nc/4.0/",
        "creator": {
            "@type": "Organization",
            "name": "Carré Sport Performance Lab"
        },
        "variableMeasured": performanceData.categories.flatMap(cat =>
            // @ts-ignore
            cat.metrics.map(m => m.name.en || m.name)
        ),
        "dateModified": performanceData.last_updated,
        "inLanguage": currentLang
    }

    useSEO({
        title: t('performanceLab.seo.title'),
        description: t('performanceLab.seo.description'),
        keywords: 'sports equipment metrics, technical specifications, performance data, boxing glove absorption, resistance band strength',
        structuredData: schemaData,
        type: 'article'
    })

    const activeCategoryData = performanceData.categories.find(c => c.id === activeCategory)

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">

            {/* Hero Section */}
            <PageHero
                title={t('performanceLab.title')}
                subtitle={t('performanceLab.subtitle')}
                bgImage={heroBg}
                themeColor="blue"
                badgeText={t('performanceLab.badge')}
                align="center"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Intro */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-cyan-400 mb-4 px-3 py-1 bg-cyan-950/30 border border-cyan-500/20 rounded-full text-xs font-mono tracking-widest"
                    >
                        <BeakerIcon className="w-4 h-4" />
                        <span>{t('performanceLab.indexVersion', { version: performanceData.version, date: performanceData.last_updated })}</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4 font-playfair">{t('performanceLab.technicalSpecs')}</h2>
                    <p className="text-gray-400">
                        {t('performanceLab.introText')}
                    </p>
                </div>

                {/* Latest Research Articles */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
                        <h2 className="text-2xl font-bold font-playfair">{t('performanceLab.latestResearch')}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {performanceArticles.articles.map((article, idx) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gold-500/50 transition-colors"
                            >
                                <Link to={`/performance-lab/${article.slug}`} className="block h-full flex flex-col">
                                    <div className="relative aspect-square w-full overflow-hidden bg-gray-950 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10 pointer-events-none" />
                                        {/* Article image */}
                                        <img
                                            src={article.image}
                                            alt={getLoc(article.title)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20">
                                            <span className="text-xs font-mono text-gold-500 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                                                {article.tags[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold-500 transition-colors line-clamp-2">
                                            {getLoc(article.title)}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                                            {getLoc(article.excerpt)}
                                        </p>
                                        <div className="flex items-center justify-between text-xs font-mono text-gray-500 mt-auto pt-4 border-t border-gray-800">
                                            <span>{article.date}</span>
                                            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-gold-500">
                                                {t('performanceLab.readArticle')} →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Interface */}
                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1 space-y-2 mb-8 lg:mb-0 w-full overflow-hidden">
                        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 pl-2">{t('performanceLab.selectCategory')}</h3>
                        <div className="flex lg:block overflow-x-auto pb-4 gap-2 lg:pb-0 lg:gap-0 no-scrollbar touch-pan-x">
                            {performanceData.categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 lg:w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap ${activeCategory === cat.id
                                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'bg-gray-900/50 border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span>{getLoc(cat.name)}</span>
                                        {activeCategory === cat.id && <BoltIcon className="w-4 h-4 animate-pulse hidden lg:block" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Data Display */}
                    <div className="lg:col-span-3 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm w-full"
                            >
                                <div className="border-b border-gray-800 bg-gray-900/60 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 min-w-0">
                                        <ChartBarIcon className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                                        <span className="truncate">{t('performanceLab.analysis', { category: getLoc(activeCategoryData?.name) })}</span>
                                        <div className="ml-4">
                                            <PinterestSaveButton
                                                url={window.location.href}
                                                media="https://carresports.ma/assets/media-kit/abstract_performance.png" // Fallback or specific visual
                                                description={`Performance Analysis: ${getLoc(activeCategoryData?.name)} | Carré Sports Performance Lab`}
                                                size="sm"
                                            />
                                        </div>
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 whitespace-nowrap">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        {t('performanceLab.liveData')}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {/* Desktop Table View */}
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-800 text-xs font-mono text-gray-500 uppercase tracking-wider">
                                                    <th className="py-4 px-4 font-medium w-1/4">{t('performanceLab.metric')}</th>
                                                    <th className="py-4 px-4 font-medium w-1/4">{t('performanceLab.value')}</th>
                                                    <th className="py-4 px-4 font-medium w-1/2">{t('performanceLab.description')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/50">
                                                {activeCategoryData?.metrics.map((metric, idx) => (
                                                    <motion.tr
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="group hover:bg-cyan-950/10 transition-colors"
                                                    >
                                                        <td className="py-4 px-4 font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">
                                                            {getLoc(metric.name)}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="text-lg font-bold text-white font-mono">{getLoc(metric.value)}</span>
                                                            <span className="text-xs text-gray-500 ml-1.5">{getLoc(metric.unit)}</span>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-gray-400 leading-relaxed max-w-md">
                                                            {getLoc(metric.description)}
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="sm:hidden space-y-4">
                                        {activeCategoryData?.metrics.map((metric, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-gray-800/30 rounded-xl p-4 border border-gray-800"
                                            >
                                                <div className="flex justify-between items-start mb-2 gap-4">
                                                    <h4 className="font-medium text-cyan-400 break-words flex-1 min-w-0">{getLoc(metric.name)}</h4>
                                                    <div className="text-right flex-shrink-0">
                                                        <span className="block text-lg font-bold text-white font-mono">{getLoc(metric.value)}</span>
                                                        <span className="text-xs text-gray-500">{getLoc(metric.unit)}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-800/50 pt-2 mt-2">
                                                    {getLoc(metric.description)}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-900/80 p-4 border-t border-gray-800 text-xs text-gray-500 font-mono text-right">
                                    {t('performanceLab.verifiedBy')}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-4xl mx-auto w-full px-0 sm:px-4">
                    <div className="text-center mb-12 px-4">
                        <h2 className="text-2xl font-bold font-playfair mb-4">{t('performanceLab.faqTitle')}</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">{t('performanceLab.faqSubtitle')}</p>
                    </div>

                    <div className="space-y-4">
                        {performanceData.faq.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="border border-gray-800 rounded-lg bg-gray-900/20 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/50 transition-colors"
                                >
                                    <span className="font-medium text-gray-200 pr-4 text-sm sm:text-base">{getLoc(item.question)}</span>
                                    {openFaqIndex === index ? (
                                        <ChevronUpIcon className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-gray-800/50"
                                        >
                                            <div className="p-5 text-gray-400 leading-relaxed text-sm bg-gray-900/40">
                                                {getLoc(item.answer)}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>{t('performanceLab.isoCertified')}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PerformanceLabPage
