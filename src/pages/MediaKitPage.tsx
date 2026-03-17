import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    CloudArrowDownIcon,
    DocumentDuplicateIcon,
    CheckIcon,
    PhotoIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import { useSEO } from '../hooks/useSEO'

// @ts-ignore
import heroBg from '../assets/hero-bg.png'
import PinterestSaveButton from '../components/PinterestSaveButton'

const CitationSnippet = ({ title, code }: { title: string, code: string }) => {
    const [copied, setCopied] = useState(false)
    const { t } = useTranslation()

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
            <div className="bg-gray-800/50 px-4 py-3 flex flex-wrap justify-between items-center gap-2 border-b border-gray-800">
                <span className="text-sm font-bold text-gray-300 break-words flex-1 min-w-[200px]">{title}</span>
                <button
                    onClick={copyToClipboard}
                    className="text-xs flex-shrink-0 flex items-center gap-1 text-gold-500 hover:text-gold-400 font-bold uppercase tracking-wider transition-colors"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4" />
                            {t('mediaKit.citation.copied')}
                        </>
                    ) : (
                        <>
                            <DocumentDuplicateIcon className="w-4 h-4" />
                            {t('mediaKit.citation.copy')}
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 bg-black/50 overflow-x-auto">
                <code className="text-sm text-gray-400 font-mono whitespace-pre-wrap break-all">{code}</code>
            </div>
        </div>
    )
}

const MediaKitPage = () => {
    const { t } = useTranslation()

    useSEO({
        title: t('mediaKit.seo.title'),
        description: t('mediaKit.seo.description'),
        keywords: 'carr\u00e9 sport media kit, brand assets, logos, press release, performance lab data',
        type: 'website'
    })

    const citationCode = `<div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 20px 0;">
    <p style="font-family: 'Playfair Display', serif; font-size: 1.1em; color: #333;">
        "${t('mediaKit.citation.snippet.text')}"
    </p>
    <p style="font-size: 0.9em; color: #666;">
        — <a href="https://carresports.ma/performance-lab" style="color: #D4AF37; text-decoration: none; font-weight: bold;">${t('mediaKit.citation.snippet.source')}</a>, Carré Sports
    </p>
</div>`

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-gold-500/30 overflow-x-hidden">

            <PageHero
                title={t('mediaKit.hero.title')}
                subtitle={t('mediaKit.hero.subtitle')}
                bgImage={heroBg}
                themeColor="gold"
                badgeText={t('mediaKit.hero.badge')}
                align="center"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 min-w-0">

                    {/* Left Column: Downloads & Story */}
                    <div className="lg:col-span-7 space-y-16 min-w-0 overflow-hidden">

                        {/* Downloads */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-8 font-playfair flex items-center gap-3">
                                <PhotoIcon className="w-6 h-6 text-gold-500" />
                                {t('mediaKit.assets.title')}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="/brand-assets/logo-pack.zip"
                                    download="carre-sports-logos.zip"
                                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl group hover:border-gold-500/50 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gold-500/20 transition-colors">
                                            <PhotoIcon className="w-6 h-6 text-gray-400 group-hover:text-gold-500" />
                                        </div>
                                        <CloudArrowDownIcon className="w-5 h-5 text-gray-600 group-hover:text-gold-500" />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">{t('mediaKit.assets.logos')}</h3>
                                    <p className="text-xs text-gray-500">ZIP • 12MB • PNG, SVG, AI</p>
                                </motion.a>

                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="/brand-assets/charte-graphique.pdf"
                                    download="carre-sports-charte-graphique.pdf"
                                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl group hover:border-gold-500/50 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gold-500/20 transition-colors">
                                            <DocumentTextIcon className="w-6 h-6 text-gray-400 group-hover:text-gold-500" />
                                        </div>
                                        <CloudArrowDownIcon className="w-5 h-5 text-gray-600 group-hover:text-gold-500" />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">{t('mediaKit.assets.guidelines')}</h3>
                                    <p className="text-xs text-gray-500">PDF • 4.5MB • Brand Book</p>
                                </motion.a>
                            </div>
                        </section>

                        {/* Pinterest Marketing Assets */}
                        <section className="mb-12">
                            <h2 className="text-xl font-bold text-white mb-6 font-playfair flex flex-wrap items-center gap-3">
                                {t('mediaKit.pinterest.title') || 'Pinterest Marketing Assets'}
                                <span className="text-xs font-sans font-normal px-2 py-1 bg-red-900/30 text-red-400 rounded-full border border-red-900/50 flex items-center gap-1 whitespace-nowrap">
                                    <svg className="w-3 h-3 flex-shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.207 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" /></svg>
                                    Optimized
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "Le Guide Scientifique : Choisir ses Gants de Boxe au Maroc 🥊",
                                        desc: "Ne devinez plus la qualité de votre matériel. Découvrez les résultats du Performance Lab™ de Carré Sport sur la durabilité et l'absorption des chocs des gants Venum. Excellence et Performance au service des athlètes marocains.",
                                        path: "/images/blog/boxing-impact.png",
                                        label: "Technical Comparison"
                                    },
                                    {
                                        title: "Équipement de Sport Premium à Casablanca | Carré Sport",
                                        desc: "Accédez enfin au matériel utilisé par l'élite. De la musculation au CrossFit, Carré Sport démocratise l'équipement professionnel au Maroc depuis 2020.",
                                        path: "/images/blog/kettlebells-luxury.png",
                                        label: "Luxury Minimalist"
                                    },
                                    {
                                        title: "Notre Mission : L'Excellence Sportive au Maroc",
                                        desc: "Pourquoi nous avons créé le Performance Lab™. Découvrez comment Carré Sport comble le fossé entre la fabrication d'élite et la disponibilité locale pour chaque sportif marocain.",
                                        path: "/images/blog/brand-mission.png",
                                        label: "Brand Story"
                                    }
                                ].map((pin, idx) => (
                                    <div key={idx} className="group relative w-full min-w-0 overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl flex flex-col">
                                        {/* Image Section */}
                                        <div className="relative h-64 sm:h-auto sm:aspect-square w-full bg-gray-950 flex items-center justify-center p-4">
                                            <div className="absolute inset-0 bg-gray-950 animate-pulse pointer-events-none" />
                                            <img
                                                src={pin.path}
                                                alt={pin.title}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                                onLoad={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    const prevSibling = target.previousElementSibling;
                                                    if (prevSibling && prevSibling.classList.contains('animate-pulse')) {
                                                        prevSibling.classList.add('hidden');
                                                    }
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://placehold.co/1000x1000/0f172a/d4af37?text=${encodeURIComponent(pin.label)}`;
                                                }}
                                            />
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-5 flex-1 flex flex-col border-t border-gray-800">
                                            <p className="text-xs text-gold-500 font-mono mb-2 uppercase tracking-wider">{pin.label}</p>
                                            <h3 className="text-white font-bold text-sm leading-snug mb-4 flex-1">{pin.title}</h3>
                                            <div className="mt-auto">
                                                <PinterestSaveButton
                                                    url={window.location.href}
                                                    media={window.location.origin + pin.path}
                                                    description={pin.desc}
                                                    size="sm"
                                                    className="w-full justify-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Brand Story */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 font-playfair border-l-4 border-gold-500 pl-4">
                                {t('mediaKit.story.title')}
                            </h2>
                            <div className="prose prose-invert prose-gold max-w-none text-gray-400">
                                <p className="leading-relaxed mb-4">
                                    {t('mediaKit.story.p1')}
                                </p>
                                <p className="leading-relaxed">
                                    {t('mediaKit.story.p2')}
                                </p>
                            </div>
                        </section>

                    </div>

                    {/* Right Column: Citations */}
                    <div className="lg:col-span-5 min-w-0 overflow-hidden">
                        <div className="sticky top-24 bg-gray-900/50 border border-gray-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-white mb-2 font-playfair">{t('mediaKit.citation.title')}</h2>
                            <p className="text-sm text-gray-400 mb-6">{t('mediaKit.citation.subtitle')}</p>

                            <CitationSnippet
                                title="HTML Embed"
                                code={citationCode}
                            />

                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-xs text-blue-200">
                                    <strong>{t('mediaKit.citation.noteTitle')}:</strong> {t('mediaKit.citation.noteText')}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MediaKitPage
