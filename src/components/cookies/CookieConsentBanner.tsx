import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CircleStackIcon,
  XMarkIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'
import { useCookieConsentStore } from '../../store/cookieConsentStore'

export default function CookieConsentBanner() {
  const {
    showBanner,
    showPreferences,
    consent,
    categories,
    acceptAll,
    rejectAll,
    updateConsent,
    showPreferencesModal,
    hidePreferencesModal
  } = useCookieConsentStore()

  const [preferences, setPreferences] = useState({
    strictly_necessary: true,
    performance: consent.categories.performance,
    functional: consent.categories.functional,
    marketing: consent.categories.marketing
  })

  const handleSavePreferences = () => {
    updateConsent(preferences)
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'strictly_necessary':
        return <ShieldCheckIcon className="w-5 h-5" />
      case 'performance':
        return <ChartBarIcon className="w-5 h-5" />
      case 'functional':
        return <UserIcon className="w-5 h-5" />
      case 'marketing':
        return <MegaphoneIcon className="w-5 h-5" />
      default:
        return <CircleStackIcon className="w-5 h-5" />
    }
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner - Floating Card Design */}
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-[380px] z-[60] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CircleStackIcon className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-snug">
                    We use cookies to improve your experience. Essential cookies are required, others are optional.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={acceptAll}
                  className="w-full px-4 py-2.5 bg-gold-600 text-white rounded-xl hover:bg-gold-700 transition-colors text-sm font-bold shadow-md shadow-gold-600/20"
                >
                  Accept All
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={rejectAll}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-xs font-semibold"
                  >
                    Reject Optional
                  </button>
                  <button
                    onClick={showPreferencesModal}
                    className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CogIcon className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Preferences Modal - Mobile optimized */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={hidePreferencesModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                <p className="text-gray-600 text-sm mb-4 sm:mb-6">
                  Choose which cookies you want to allow. You can change these settings at any time.
                  Note that blocking some types of cookies may impact your experience on our website.
                </p>

                <div className="space-y-4 sm:space-y-6">
                  {categories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(category.id)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{category.name}</h3>
                            {category.essential && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full inline-block mt-1">
                                Always Active
                              </span>
                            )}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                          <input
                            type="checkbox"
                            checked={category.essential || preferences[category.id as keyof typeof preferences]}
                            onChange={(e) => {
                              if (!category.essential) {
                                setPreferences({
                                  ...preferences,
                                  [category.id]: e.target.checked
                                })
                              }
                            }}
                            disabled={category.essential}
                            className="sr-only peer"
                          />
                          <div className={`relative w-11 h-6 rounded-full peer transition-colors ${category.essential || preferences[category.id as keyof typeof preferences]
                              ? 'bg-gold-600'
                              : 'bg-gray-200'
                            } ${category.essential ? 'opacity-50 cursor-not-allowed' : 'peer-focus:ring-4 peer-focus:ring-gold-300'}`}>
                            <div className={`absolute top-[2px] start-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all ${category.essential || preferences[category.id as keyof typeof preferences] ? 'translate-x-full border-white' : ''
                              }`}></div>
                          </div>
                        </label>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setPreferences({
                      strictly_necessary: true,
                      performance: false,
                      functional: false,
                      marketing: false
                    })
                    updateConsent({
                      performance: false,
                      functional: false,
                      marketing: false
                    })
                  }}
                  className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Reject All
                </button>
                <button
                  onClick={() => {
                    setPreferences({
                      strictly_necessary: true,
                      performance: true,
                      functional: true,
                      marketing: true
                    })
                    updateConsent({
                      performance: true,
                      functional: true,
                      marketing: true
                    })
                  }}
                  className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Accept All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2.5 sm:py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors text-sm font-medium"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 