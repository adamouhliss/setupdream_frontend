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
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-dark-900/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-primary-950/20 to-transparent z-10" />
        {/* Subtle Cyber Neon glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-10" />

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <OptimizedImage
            src={"https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070&auto=format&fit=crop"}
            alt="Gaming Excellence"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
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
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse-fast shadow-[0_0_10px_#ef4444]"></div>
              <span className="text-primary-100 font-bold font-display text-xs uppercase tracking-[0.2em]">
                {t('ramadan.greeting') || t('hero.title') || "EXTREME PERFORMANCE"}
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-8xl font-black font-display text-white leading-[1.1] tracking-tight uppercase"
              >
                <span className="block">{t('ramadan.heroTitle') || t('hero.title') || "Elevate Your"}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-700">
                  {t('ramadan.heroSecondary') || t('hero.secondary') || "Setup"}
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-sans font-light leading-relaxed"
            >
              {t('ramadan.heroSubtitle') || t('hero.subtitle') || "Discover professional-grade hardware designed for gamers who refuse to bottleneck."}
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
                className="group relative overflow-hidden bg-primary-600 text-white font-bold py-4 px-10 rounded-none transition-all duration-300 hover:bg-primary-500 hover:shadow-neon hover:-translate-y-1 clipping-path-btn"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <span className="relative z-10 font-display tracking-widest uppercase">
                  {t('hero.cta') || "UPGRADE NOW"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Link>

              <Link
                to="/categories"
                className="group flex items-center justify-center gap-2 text-white hover:text-primary-500 font-bold py-4 px-8 transition-all duration-300 font-display tracking-widest uppercase"
              >
                <span>{t('hero.exploreCollection', "VIEW CATALOG")}</span>
                <span className="transform transition-transform group-hover:translate-x-2 text-primary-500">→</span>
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
                <p className="text-2xl sm:text-3xl flex items-baseline justify-center font-bold text-white font-display">144<span className="text-primary-500 text-lg ml-1">Hz+</span></p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-display mt-1">{t('hero.stats.athletes') || "Average FPS"}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="text-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-white font-display">5K+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-display mt-1">{t('hero.stats.products') || "Hardware Parts"}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="text-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-white font-display text-primary-400">#1</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-display mt-1">{t('hero.stats.satisfaction') || "In Morocco"}</p>
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