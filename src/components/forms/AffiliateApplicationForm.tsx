import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    LinkIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function AffiliateApplicationForm() {
    const { t } = useTranslation()
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setStatus('success')
    }

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center"
            >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('partnerships.form.successTitle')}</h3>
                <p className="text-gray-400">{t('partnerships.form.successMessage')}</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm text-green-400 hover:text-green-300 underline underline-offset-4"
                >
                    {t('partnerships.form.submitAnother')}
                </button>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 font-playfair border-b border-gray-800 pb-4">
                {t('partnerships.form.title')}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('partnerships.form.fullName')}</label>
                    <div className="relative">
                        <UserIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder-gray-600"
                            placeholder={t('partnerships.form.namePlaceholder')}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('partnerships.form.email')}</label>
                    <div className="relative">
                        <EnvelopeIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                        <input
                            type="email"
                            required
                            className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder-gray-600"
                            placeholder="coach@example.com"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('partnerships.form.phone')}</label>
                    <div className="relative">
                        <PhoneIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                        <input
                            type="tel"
                            className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder-gray-600"
                            placeholder="+212 6..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('partnerships.form.type')}</label>
                    <select className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all appearance-none cursor-pointer">
                        <option value="coach">{t('partnerships.types.coach')}</option>
                        <option value="athlete">{t('partnerships.types.athlete')}</option>
                        <option value="gym_owner">{t('partnerships.types.gymOwner')}</option>
                        <option value="influencer">{t('partnerships.types.influencer')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('partnerships.form.socials')}</label>
                <div className="relative">
                    <LinkIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                    <input
                        type="text"
                        className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder-gray-600"
                        placeholder="@instagram, @tiktok..."
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('partnerships.form.message')}</label>
                <textarea
                    rows={4}
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder-gray-600 resize-none"
                    placeholder={t('partnerships.form.messagePlaceholder')}
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gold-500 text-white font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-gold-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gold-500/20"
            >
                {status === 'submitting' ? t('common.sending') : t('partnerships.form.submit')}
            </button>
        </form>
    )
}
