import { motion } from 'framer-motion'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useStoreSettingsStore } from '../store/storeSettingsStore'

export default function PrivacyPolicyPage() {
  const { settings } = useStoreSettingsStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gold-800/30 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheckIcon className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-100">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how {settings.store_name} collects, uses, and protects your personal information.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: December 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="prose prose-invert max-w-none text-gray-300">
              <h2 className="text-gray-100">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>

              <h2 className="text-gray-100">How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>

              <h2 className="text-gray-100">Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>

              <h2 className="text-gray-100">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-gray-100">Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. 
                You may also opt out of certain communications from us.
              </p>

              <h2 className="text-gray-100">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href={`mailto:${settings.store_email}`} className="text-gold-400 hover:text-gold-300">
                  {settings.store_email}
                </a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 