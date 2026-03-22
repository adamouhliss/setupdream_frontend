import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const InfiniteMarquee = () => {
    const { t } = useTranslation()

    const content = [
        t('cro.marquee.premiumGear', "PREMIUM GEAR"),
        "•",
        t('cro.marquee.worldwideShipping', "NATIONWIDE SHIPPING"),
        "•",
        t('cro.marquee.professionalQuality', "PROFESSIONAL QUALITY"),
        "•",
        t('cro.marquee.officialDistributor', "OFFICIAL DISTRIBUTOR"),
        "•",
        t('cro.marquee.satisfactionGuaranteed', "SATISFACTION GUARANTEED"),
        "•",
        t('cro.marquee.premiumGear', "PREMIUM GEAR"),
        "•",
        t('cro.marquee.worldwideShipping', "NATIONWIDE SHIPPING"),
        "•",
        t('cro.marquee.professionalQuality', "PROFESSIONAL QUALITY"),
        "•",
        t('cro.marquee.officialDistributor', "OFFICIAL DISTRIBUTOR"),
        "•",
        t('cro.marquee.satisfactionGuaranteed', "SATISFACTION GUARANTEED"),
        "•",
    ]

    return (
        <div className="w-full bg-primary-600 py-3 overflow-hidden border-y border-primary-700 relative z-20 shadow-md">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear"
                    }}
                    className="flex items-center gap-8 text-white font-bold tracking-widest text-sm md:text-base uppercase"
                >
                    {content.map((item, index) => (
                        <span key={index} className={item === "•" ? "text-dark-950" : ""}>
                            {item}
                        </span>
                    ))}
                    {/* Duplicate content for seamless loop */}
                    {content.map((item, index) => (
                        <span key={`dup-${index}`} className={item === "•" ? "text-dark-950" : ""}>
                            {item}
                        </span>
                    ))}
                    {content.map((item, index) => (
                        <span key={`dup2-${index}`} className={item === "•" ? "text-dark-950" : ""}>
                            {item}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default InfiniteMarquee
