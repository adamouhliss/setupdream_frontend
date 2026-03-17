import { motion } from 'framer-motion'
import { 
  CircleStackIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserIcon,
  MegaphoneIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useStoreSettingsStore } from '../store/storeSettingsStore'

export default function CookiePolicyPage() {
  const { settings } = useStoreSettingsStore()

  const cookieCategories = [
    {
      id: 'strictly_necessary',
      name: 'Strictly Necessary Cookies',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      description: 'These cookies are essential for the website to function properly and cannot be disabled.',
      examples: [
        'Authentication cookies to keep you logged in',
        'Shopping cart contents',
        'Security cookies to prevent fraud',
        'Session management cookies',
        'Cookie consent preferences'
      ],
      retention: 'Session or up to 1 year',
      legal_basis: 'Legitimate Interest (essential for website function)'
    },
    {
      id: 'performance',
      name: 'Performance & Analytics Cookies',
      icon: <ChartBarIcon className="w-6 h-6" />,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        'Google Analytics cookies (_ga, _gid, _gat)',
        'Page load time measurements',
        'User behavior analytics',
        'Error tracking and debugging',
        'Site performance monitoring'
      ],
      retention: 'Up to 2 years',
      legal_basis: 'Consent'
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      icon: <UserIcon className="w-6 h-6" />,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: [
        'Language and region preferences',
        'Theme and display preferences',
        'Recently viewed products',
        'Saved filters and search preferences',
        'Accessibility settings'
      ],
      retention: 'Up to 1 year',
      legal_basis: 'Consent'
    },
    {
      id: 'marketing',
      name: 'Marketing & Advertising Cookies',
      icon: <MegaphoneIcon className="w-6 h-6" />,
      description: 'These cookies are used for targeted advertising and marketing campaigns.',
      examples: [
        'Facebook Pixel (_fbp, _fbc)',
        'Google Ads conversion tracking',
        'Remarketing and retargeting cookies',
        'Social media integration cookies',
        'Email marketing preferences'
      ],
      retention: 'Up to 2 years',
      legal_basis: 'Consent'
    }
  ]

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
              <CircleStackIcon className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-100">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              This policy explains how {settings.store_name} uses cookies and similar technologies on our website.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: December 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6 flex items-center gap-3">
              <CircleStackIcon className="w-8 h-8 text-gold-400" />
              What Are Cookies?
            </h2>
            
            <div className="space-y-4 font-lora text-gray-300">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
              
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                personalize content, and provide social media features. This policy explains how we use cookies 
                and your choices regarding their use.
              </p>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">Types of cookies we use</h2>
            
            {cookieCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-100">{category.name}</h3>
                      {category.id === 'strictly_necessary' && (
                        <span className="text-xs bg-green-900/30 text-green-400 border border-green-600/30 px-2 py-1 rounded-full">
                          Always Active
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{category.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">Examples:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {category.examples.map((example, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-200 text-sm">Retention Period:</span>
                          </div>
                          <p className="text-sm text-gray-300">{category.retention}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-200 text-sm">Legal Basis:</span>
                          </div>
                          <p className="text-sm text-gray-300">{category.legal_basis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Managing Cookies */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Managing your cookie preferences</h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>
                You can control and manage cookies in several ways:
              </p>
              <ul>
                <li><strong>Cookie Banner:</strong> When you first visit our site, you can choose which types of cookies to accept.</li>
                <li><strong>Cookie Widget:</strong> Use the floating cookie icon in the bottom-left corner to change your preferences at any time.</li>
                <li><strong>Browser Settings:</strong> Most browsers allow you to view, manage, and delete cookies through their settings.</li>
                <li><strong>Opt-out Tools:</strong> Some third-party services provide opt-out mechanisms for their cookies.</li>
              </ul>
              <div className="bg-amber-900/30 border border-amber-600/30 rounded-lg p-4 mt-4">
                <p className="text-amber-300 mb-0">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </div>
          </div>

          {/* Third Party Cookies */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Third-party cookies</h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>
                Some cookies on our site are set by third-party services. These include:
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Facebook Pixel:</strong> For social media integration and targeted advertising</li>
                <li><strong>Payment Providers:</strong> For secure payment processing</li>
                <li><strong>Social Media Platforms:</strong> For social sharing and integration features</li>
              </ul>
              <p>
                These third parties have their own privacy policies and cookie policies, which we encourage you to review.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Your rights</h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>
                Under data protection laws, you have the right to:
              </p>
              <ul>
                <li>Be informed about our use of cookies</li>
                <li>Give or withdraw consent for non-essential cookies</li>
                <li>Access information about cookies we use</li>
                <li>Have your cookie data deleted</li>
                <li>Object to our use of cookies for certain purposes</li>
              </ul>
              <p>
                To exercise these rights or if you have any questions about our cookie policy, 
                please contact us at <a href={`mailto:${settings.store_email}`} className="text-gold-400 hover:text-gold-300">
                  {settings.store_email}
                </a>.
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Updates to this policy</h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>
                We may update this cookie policy from time to time to reflect changes in our practices 
                or applicable laws. When we make significant changes, we will notify you by updating 
                the "Last updated" date at the top of this policy.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gold-900/20 border border-gold-600/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Contact us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this cookie policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href={`mailto:${settings.store_email}`} className="text-gold-400 hover:text-gold-300">{settings.store_email}</a></p>
              <p><strong>Phone:</strong> {settings.store_phone}</p>
              <p><strong>Address:</strong> {settings.store_address}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 