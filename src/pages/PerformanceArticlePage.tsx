import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    ClockIcon,
    UserCircleIcon,
    ChevronLeftIcon,
    TagIcon
} from '@heroicons/react/24/outline'

import PageHero from '../components/PageHero'
import SocialShare from '../components/SocialShare'
import { useSEO } from '../hooks/useSEO'
import performanceArticles from '../data/performanceArticles.json'

// @ts-ignore
import heroBg from '../assets/hero-bg.png'

const PerformanceArticlePage = () => {
    const { slug } = useParams()
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en' as 'en' | 'fr'

    const article = performanceArticles.articles.find(a => a.slug === slug)

    // Helper to get localized string
    const getLoc = (obj: any) => {
        if (!obj) return ''
        if (typeof obj === 'string') return obj
        return obj[currentLang] || obj['en'] || ''
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
                    <Link to="/performance-lab" className="text-gold-500 hover:underline">
                        Return to Performance Lab
                    </Link>
                </div>
            </div>
        )
    }

    // Article JSON-LD Schema
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": getLoc(article.title),
        "image": [
            `${window.location.origin}${article.image}`
        ],
        "datePublished": article.date,
        "author": [{
            "@type": "Person",
            "name": article.author,
            "url": "https://setupdream.ma/performance-lab"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "SetupDream",
            "logo": {
                "@type": "ImageObject",
                "url": "https://setupdream.ma/logo.png"
            }
        },
        "description": getLoc(article.excerpt),
        "articleBody": getLoc(article.content).replace(/<[^>]*>?/gm, "") // Strip HTML for schema
    }

    useSEO({
        title: getLoc(article.title),
        description: getLoc(article.excerpt),
        image: article.image,
        type: 'article',
        structuredData: schemaData,
        keywords: article.tags.join(', ')
    })

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-gold-500/30">

            {/* Hero Section */}
            <div className="relative">
                <PageHero
                    title={getLoc(article.title)}
                    subtitle={getLoc(article.excerpt)}
                    bgImage={heroBg}
                    themeColor="gold"
                    badgeText="Research Article"
                    align="center"
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-24">

                {/* Meta Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-12 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <UserCircleIcon className="w-5 h-5 text-gold-500" />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-gold-500" />
                            <span>{article.readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TagIcon className="w-5 h-5 text-gold-500" />
                            <span className="flex gap-2">
                                {article.tags.map(tag => (
                                    <span key={tag} className="bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">
                                        {tag}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>

                    <SocialShare
                        title={getLoc(article.title)}
                        className="w-full sm:w-auto justify-end border-t sm:border-t-0 border-gray-800 pt-4 sm:pt-0"
                    />
                </motion.div>

                {/* Article Content */}
                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-playfair prose-headings:text-gold-500 prose-a:text-gold-400 hover:prose-a:text-gold-300 prose-img:rounded-2xl prose-strong:text-white">
                    <div dangerouslySetInnerHTML={{ __html: getLoc(article.content) }} />
                </article>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
                    <Link
                        to="/performance-lab"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>{t('common.back', 'Back to Lab')}</span>
                    </Link>

                    <SocialShare title={getLoc(article.title)} />
                </div>

            </div>
        </div>
    )
}

export default PerformanceArticlePage
