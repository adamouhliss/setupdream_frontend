import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
    TruckIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const TrustStrip = () => {
    const { t } = useTranslation()

    const features = [
        {
            icon: TruckIcon,
            title: t('cro.trust.delivery.title', "Livraison Partout au Maroc"),
            subtitle: t('cro.trust.delivery.subtitle', "Gratuite à partir de 500 DH")
        },
        {
            icon: CurrencyDollarIcon,
            title: t('cro.trust.payment.title', "Paiement à la Livraison"),
            subtitle: t('cro.trust.payment.subtitle', "Payez en toute sécurité")
        },
        {
            icon: ShieldCheckIcon,
            title: t('cro.trust.guarantee.title', "Garantie Satisfait ou Remboursé"),
            subtitle: t('cro.trust.guarantee.subtitle', "30 jours pour changer d'avis")
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: t('cro.trust.support.title', "Service Client 7j/7"),
            subtitle: t('cro.trust.support.subtitle', "Une équipe à votre écoute")
        }
    ]

    return (
        <div className="w-full bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 group cursor-default"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:shadow-neon transition-all duration-300">
                                <feature.icon className="w-6 h-6 text-primary-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-100 text-sm md:text-base group-hover:text-primary-400 font-display tracking-wide transition-colors">
                                    {feature.title}
                                </span>
                                <span className="text-gray-400 text-xs md:text-sm">
                                    {feature.subtitle}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrustStrip
