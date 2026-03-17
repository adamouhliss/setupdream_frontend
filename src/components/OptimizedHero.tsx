import { memo, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// @ts-ignore
import heroBg from '../assets/hero-bg.png'
import OptimizedImage from './OptimizedImage'

const OptimizedHero = memo(() => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax Effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.1]), { stiffness: 50, damping: 20 })

  return (
    <section ref={containerRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-900">

      {/* Parallax Background */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-gray-900/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-emerald-950/20 to-transparent z-10" />
        {/* Subtle Ramadan motif / lantern glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-10" />

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <OptimizedImage
            src={heroBg}
            alt="Sports Excellence"
            className="w-full h-full object-cover"
            priority={true}
            fetchPriority="high"
            loading="eager"
            width={1920}
            height={1080}
            sizes="100vw"
          />
        </div>
      </motion.div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Main Content Area */}
          <div className="lg:col-span-12 text-center flex flex-col items-center">

            {/* Priority Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8"
            >
              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse shadow-[0_0_10px_#FACC15]"></div>
              <span className="text-gold-100 font-medium font-montserrat text-xs uppercase tracking-[0.2em]">
                {t('ramadan.greeting') || t('hero.title') || "PREMIUM PERFORMANCE"}
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-8xl font-black font-playfair text-white leading-[1.1] tracking-tight"
              >
                <span className="block">{t('ramadan.heroTitle') || t('hero.title') || "Elevate Your"}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-emerald-400">
                  {t('ramadan.heroSecondary') || t('hero.secondary') || "Game"}
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-lora font-light leading-relaxed"
            >
              {t('ramadan.heroSubtitle') || t('hero.subtitle') || "Discover professional-grade equipment designed for athletes who refuse to compromise."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full"
            >
              <Link
                to="/products"
                className="group relative overflow-hidden bg-white text-gray-900 font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                <span className="relative z-10 font-montserrat tracking-wide">
                  {t('hero.cta') || "SHOP NOW"}
                </span>
              </Link>

              <Link
                to="/categories"
                className="group flex items-center justify-center gap-2 text-white hover:text-gold-400 font-medium py-4 px-8 transition-all duration-300 font-montserrat tracking-wide"
              >
                <span>{t('hero.exploreCollection', "Explore Collection")}</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-8 lg:gap-12 border-t border-white/5 pt-8 w-full"
            >
              <div className="text-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-white font-playfair">50k+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-montserrat mt-1">{t('hero.stats.athletes') || "Athletes"}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="text-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-white font-playfair">200+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-montserrat mt-1">{t('hero.stats.products') || "Products"}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="text-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-white font-playfair">4.9</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-montserrat mt-1">{t('hero.stats.satisfaction') || "Rating"}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>



    </section>
  )
})

OptimizedHero.displayName = 'OptimizedHero'

export default OptimizedHero 