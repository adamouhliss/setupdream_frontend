import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

const LuxuryNewsletter = () => {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'success' | 'loading'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        // Simulate API call
        setTimeout(() => {
            setStatus('success')
            setEmail('')
        }, 1500)
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gray-900">
            {/* Background with noise/texture */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">

                    {/* Decorative border line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gray-700 shadow-lg group hover:border-gold-500/50 transition-colors">
                            <EnvelopeIcon className="w-8 h-8 text-gold-400" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold font-playfair text-white mb-6">
                            {t('cro.newsletter.join', 'Join the')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">{t('cro.newsletter.innerCircle', 'Inner Circle')}</span>
                        </h2>

                        <p className="text-gray-400 font-lora text-lg mb-10 max-w-2xl mx-auto">
                            {t('cro.newsletter.description', 'Subscribe to receive exclusive offers, early access to new drops, and expert training tips directly to your inbox.')}
                        </p>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group">
                            <div className="relative flex items-center">
                                <input
                                    type="email"
                                    placeholder={t('cro.newsletter.placeholder', 'Enter your email address')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-500 px-6 py-4 rounded-full focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all font-montserrat pr-16"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="absolute right-2 bg-gold-500 hover:bg-gold-400 text-black font-bold p-2.5 rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? (
                                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                    ) : status === 'success' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    )}
                                </button>
                            </div>
                            {status === 'success' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-400 mt-4 font-medium text-sm"
                                >
                                    {t('cro.newsletter.success', 'Welcome to the club! Check your inbox soon.')}
                                </motion.p>
                            )}
                        </form>

                        <p className="text-gray-600 text-xs mt-6">
                            {t('cro.newsletter.disclaimer', 'By subscribing, you agree to our Terms & Privacy Policy. No spam, ever.')}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default LuxuryNewsletter
