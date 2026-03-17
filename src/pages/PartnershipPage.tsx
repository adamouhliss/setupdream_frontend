import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    CloudArrowDownIcon,
    BeakerIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    StarIcon,
    TrophyIcon
} from '@heroicons/react/24/outline'

import PageHero from '../components/PageHero'
import AffiliateApplicationForm from '../components/forms/AffiliateApplicationForm'
import { useSEO } from '../hooks/useSEO'

// @ts-ignore
import heroBg from '../assets/hero-bg.png'

const PartnershipPage = () => {
    const { t } = useTranslation()

    useSEO({
        title: t('partnerships.hero.title'),
        description: t('partnerships.hero.subtitle'),
        keywords: 'partnership, affiliate program, sponsorship, media kit, carr\u00e9 sport',
        type: 'website'
    })

    const benefits = [
        {
            icon: CurrencyDollarIcon,
            text: t('partnerships.affiliate.benefit1')
        },
        {
            icon: UserGroupIcon,
            text: t('partnerships.affiliate.benefit2')
        },
        {
            icon: StarIcon,
            text: t('partnerships.affiliate.benefit3')
        }
    ]

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-gold-500/30">

            <PageHero
                title={t('partnerships.hero.title')}
                subtitle={t('partnerships.hero.subtitle')}
                bgImage={heroBg}
                themeColor="gold"
                badgeText={t('partnerships.hero.badge')}
                align="center"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* Press & Media Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                            <CloudArrowDownIcon className="w-6 h-6 text-gold-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-playfair">{t('partnerships.press.title')}</h2>
                        <p className="text-gray-400 mb-6">{t('partnerships.press.subtitle')}</p>
                        <Link to="/media-kit" className="flex items-center gap-2 text-white font-bold hover:text-gold-500 transition-colors">
                            {t('partnerships.press.downloadKit')}
                            <span className="text-xl">→</span>
                        </Link>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                            <BeakerIcon className="w-6 h-6 text-cyan-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-playfair">Performance Lab™</h2>
                        <p className="text-gray-400 mb-6">Access raw data and technical whitepapers from our engineering team.</p>
                        <Link to="/performance-lab" className="flex items-center gap-2 text-white font-bold hover:text-cyan-500 transition-colors">
                            {t('partnerships.press.accessLab')}
                            <span className="text-xl">→</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Col: Info & Benefits */}
                    <div className="lg:col-span-5 space-y-12">

                        {/* Affiliate Info */}
                        <div>
                            <span className="text-gold-500 font-bold tracking-wider uppercase text-sm mb-2 block">{t('partnerships.affiliate.title')}</span>
                            <h2 className="text-3xl font-bold font-playfair text-white mb-6">
                                {t('partnerships.affiliate.subtitle')}
                            </h2>
                            <div className="space-y-6">
                                {benefits.map((benefit, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-5 h-5 text-gold-500" />
                                        </div>
                                        <p className="text-gray-300 font-medium pt-2">{benefit.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-800" />

                        {/* Sponsorship Info */}
                        <div>
                            <span className="text-gray-500 font-bold tracking-wider uppercase text-sm mb-2 block">{t('partnerships.sponsorship.title')}</span>
                            <p className="text-gray-400 mb-6">
                                {t('partnerships.sponsorship.subtitle')}
                            </p>
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                                    <TrophyIcon className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">Represent a registered association?</p>
                                    <a href="mailto:sponsorships@carresports.ma" className="text-white font-bold underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-500 transition-colors">
                                        {t('partnerships.sponsorship.cta')}
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Col: Application Form */}
                    <div className="lg:col-span-7">
                        <AffiliateApplicationForm />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default PartnershipPage
