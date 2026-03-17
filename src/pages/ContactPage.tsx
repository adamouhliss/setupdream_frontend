import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useStoreSettingsStore } from '../store/storeSettingsStore'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface SubmissionState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  message: string
}

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

export default function ContactPage() {
  const { t, i18n } = useTranslation()
  const { settings, fetchSettings } = useStoreSettingsStore()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset states
    setSubmissionState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: ''
    })

    try {
      // FIXED: Remove duplicate /api/v1 - use just /contact/send
      const response = await fetch(`${API_BASE_URL}/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: i18n.language || 'fr'
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmissionState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: result.message || (i18n.language === 'fr' 
            ? 'Message envoyé avec succès !' 
            : 'Message sent successfully!')
        })
        
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmissionState(prev => ({ ...prev, isSuccess: false }))
        }, 5000)
        
      } else {
        throw new Error(result.detail || result.message || 'Failed to send message')
      }
    } catch (error: any) {
      console.error('Contact form error:', error)
      setSubmissionState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: error.message || (i18n.language === 'fr' 
          ? 'Une erreur s\'est produite. Veuillez réessayer.' 
          : 'An error occurred. Please try again.')
      })
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmissionState(prev => ({ ...prev, isError: false }))
      }, 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {t('contactPage.hero.title')} <span className="text-gold-gradient">{t('contactPage.hero.titleHighlight')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            {t('contactPage.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-6">
                {t('contactPage.info.title')}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {settings.store_description}
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{t('contactPage.info.email.title')}</h3>
                  <p className="text-gray-300">{t('contactPage.info.email.description')}</p>
                  <a
                    href={`mailto:${settings.store_email}`}
                    className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                  >
                    {settings.store_email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{t('contactPage.info.phone.title')}</h3>
                  <p className="text-gray-300">{t('contactPage.info.phone.description')}</p>
                  <a
                    href={`tel:${settings.store_phone.replace(/\s+/g, '')}`}
                    className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                  >
                    {settings.store_phone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{t('contactPage.info.address.title')}</h3>
                  <p className="text-gray-300">{t('contactPage.info.address.description')}</p>
                  <p className="text-gray-100 whitespace-pre-line">{settings.store_address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{t('contactPage.info.hours.title')}</h3>
                  <p className="text-gray-300">{t('contactPage.info.hours.description')}</p>
                  <div className="text-gray-100 space-y-1">
                    <p>{t('contactPage.info.hours.weekdays')}</p>
                    <p>{t('contactPage.info.hours.saturday')}</p>
                    <p>{t('contactPage.info.hours.sunday')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700 relative overflow-hidden"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-100 mb-4">
                {t('contactPage.form.title')}
              </h2>
              <p className="text-gray-300">
                {t('contactPage.form.description')}
              </p>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {(submissionState.isSuccess || submissionState.isError) && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                    submissionState.isSuccess 
                      ? 'bg-green-100 border border-green-300 text-green-800' 
                      : 'bg-red-100 border border-red-300 text-red-800'
                  }`}
                >
                  {submissionState.isSuccess ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  )}
                  <p className="font-medium">{submissionState.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contactPage.form.name.label')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submissionState.isLoading}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t('contactPage.form.name.placeholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contactPage.form.email.label')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={submissionState.isLoading}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t('contactPage.form.email.placeholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contactPage.form.subject.label')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={submissionState.isLoading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('contactPage.form.subject.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contactPage.form.message.label')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  disabled={submissionState.isLoading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none text-gray-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('contactPage.form.message.placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={submissionState.isLoading}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  submissionState.isLoading
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 transform hover:scale-105'
                }`}
              >
                {submissionState.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {i18n.language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    {t('contactPage.form.submit')}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 