import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CircleStackIcon, CogIcon } from '@heroicons/react/24/outline'
import { useCookieConsentStore } from '../../store/cookieConsentStore'

export default function CookiePreferencesWidget() {
  const [showWidget, setShowWidget] = useState(false)
  const { consent, showPreferencesModal } = useCookieConsentStore()

  // Don't show widget if user hasn't consented yet (banner will be shown instead)
  if (!consent.hasConsented) return null

  return (
    <>
      {/* Floating Cookie Preferences Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          onClick={() => setShowWidget(!showWidget)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300"
          title="Cookie Preferences"
        >
          <CircleStackIcon className="w-5 h-5 text-gray-600" />
        </motion.button>

        {/* Widget Tooltip */}
        <AnimatePresence>
          {showWidget && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                  <CircleStackIcon className="w-4 h-4 text-gold-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Cookie Settings</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Manage your cookie preferences and see what cookies are currently active.
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Performance</span>
                  <span className={`px-2 py-1 rounded-full ${
                    consent.categories.performance 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {consent.categories.performance ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Functional</span>
                  <span className={`px-2 py-1 rounded-full ${
                    consent.categories.functional 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {consent.categories.functional ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Marketing</span>
                  <span className={`px-2 py-1 rounded-full ${
                    consent.categories.marketing 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {consent.categories.marketing ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  showPreferencesModal()
                  setShowWidget(false)
                }}
                className="w-full px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <CogIcon className="w-4 h-4" />
                Change Preferences
              </button>

              <p className="text-xs text-gray-500 text-center mt-2">
                Consented on {consent.consentDate ? new Date(consent.consentDate).toLocaleDateString() : 'Unknown'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
} 