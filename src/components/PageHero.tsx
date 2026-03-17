import { memo, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import OptimizedImage from './OptimizedImage'

interface PageHeroProps {
    title: string
    subtitle: string
    bgImage: string
    themeColor?: 'gold' | 'red' | 'blue' | 'green'
    badgeText?: string
    align?: 'center' | 'left'
}

const PageHero = memo(({
    title,
    subtitle,
    bgImage,
    themeColor = 'gold',
    badgeText,
    align = 'center'
}: PageHeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    // theme configuration
    const themeConfig = {
        gold: {
            accent: 'text-gold-400',
            bgPulse: 'bg-gold-400',
            shadow: 'shadow-[0_0_10px_#FACC15]',
            badgeText: 'text-gold-100',
            gradient: 'from-gray-900 via-gray-900/90 to-gold-900/20'
        },
        red: {
            accent: 'text-red-500',
            bgPulse: 'bg-red-500',
            shadow: 'shadow-[0_0_10px_#EF4444]',
            badgeText: 'text-red-100',
            gradient: 'from-gray-900 via-gray-900/90 to-red-900/20'
        },
        blue: {
            accent: 'text-blue-400',
            bgPulse: 'bg-blue-400',
            shadow: 'shadow-[0_0_10px_#60A5FA]',
            badgeText: 'text-blue-100',
            gradient: 'from-gray-900 via-gray-900/90 to-blue-900/20'
        },
        green: {
            accent: 'text-green-400',
            bgPulse: 'bg-green-400',
            shadow: 'shadow-[0_0_10px_#4ADE80]',
            badgeText: 'text-green-100',
            gradient: 'from-gray-900 via-gray-900/90 to-green-900/20'
        }
    }

    const theme = themeConfig[themeColor]

    // Parallax Effect
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
    const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.1]), { stiffness: 50, damping: 20 })

    return (
        <section ref={containerRef} className="relative min-h-[60vh] flex items-center overflow-hidden bg-gray-900">

            {/* Parallax Background */}
            <motion.div
                style={{ y, opacity, scale }}
                className="absolute inset-0 z-0"
            >
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} z-10`} />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />

                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    <OptimizedImage
                        src={bgImage}
                        alt={title}
                        className="w-full h-full object-cover opacity-50"
                        priority={true}
                        fetchPriority="high"
                        loading="eager"
                        width={1920}
                        height={1080}
                        sizes="100vw"
                    />
                </div>
            </motion.div>

            <div className={`relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 ${align === 'center' ? 'text-center' : 'text-left'}`}>

                {badgeText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                        className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 ${align === 'center' ? 'mx-auto' : ''}`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.bgPulse} ${theme.shadow}`}></div>
                        <span className={`${theme.badgeText} font-medium font-montserrat text-xs uppercase tracking-[0.2em]`}>
                            {badgeText}
                        </span>
                    </motion.div>
                )}

                <div className="overflow-hidden mb-8">
                    <motion.h1
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black font-playfair text-white leading-[1.1] tracking-tight"
                    >
                        {title}
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className={`text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl font-lora font-light leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}
                >
                    {subtitle}
                </motion.p>
            </div>
        </section>
    )
})

PageHero.displayName = 'PageHero'

export default PageHero
