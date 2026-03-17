import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CogIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  BellIcon,
  DocumentTextIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ClockIcon,
  ChartBarIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'

interface StoreSettings {
  store_name: string
  store_description: string
  store_logo_url?: string
  store_address: string
  store_phone: string
  store_email: string
  currency: string
  timezone: string
  language: string
  tax_rate: number
  shipping_cost: number
  free_shipping_threshold: number
  
  // Social Media URLs
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
  youtube_url?: string
  tiktok_url?: string
  linkedin_url?: string
}

interface SecuritySettings {
  session_timeout: number
  max_login_attempts: number
  require_email_verification: boolean
  enable_two_factor: boolean
  password_min_length: number
  password_require_uppercase: boolean
  password_require_lowercase: boolean
  password_require_numbers: boolean
  password_require_symbols: boolean
}

interface EmailSettings {
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  smtp_use_tls: boolean
  from_email: string
  from_name: string
  enable_order_notifications: boolean
  enable_low_stock_alerts: boolean
  enable_welcome_emails: boolean
  enable_marketing_emails: boolean
}

interface NotificationSettings {
  enable_browser_notifications: boolean
  enable_email_alerts: boolean
  enable_sms_alerts: boolean
  low_stock_threshold_global: number
  order_notification_roles: string[]
  maintenance_mode: boolean
  debug_mode: boolean
}

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'store' | 'security' | 'email' | 'notifications' | 'system'>('store')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const { token } = useAuthStore()

  // Settings state with defaults
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    store_name: 'Carré Sports',
    store_description: 'Premium sports equipment and apparel store in Morocco',
    store_address: 'Casablanca, Morocco',
    store_phone: '+212 5XX-XXXXXX',
    store_email: 'info@carresports.ma',
    currency: 'MAD',
    timezone: 'Africa/Casablanca',
    language: 'fr',
    tax_rate: 20.0,
    shipping_cost: 50.0,
    free_shipping_threshold: 500.0,
    
    // Social Media URLs
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    tiktok_url: '',
    linkedin_url: ''
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    session_timeout: 3600,
    max_login_attempts: 5,
    require_email_verification: true,
    enable_two_factor: false,
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false
  })

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_use_tls: true,
    from_email: 'noreply@carresports.ma',
    from_name: 'Carré Sports',
    enable_order_notifications: true,
    enable_low_stock_alerts: true,
    enable_welcome_emails: true,
    enable_marketing_emails: false
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enable_browser_notifications: true,
    enable_email_alerts: true,
    enable_sms_alerts: false,
    low_stock_threshold_global: 10,
    order_notification_roles: ['admin', 'manager'],
    maintenance_mode: false,
    debug_mode: false
  })

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      // Load all settings categories
      const [storeRes, securityRes, emailRes, notificationRes] = await Promise.all([
        fetch(`${API_BASE_URL}/settings/store`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/settings/security`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/settings/email`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/settings/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (storeRes.ok) {
        const storeData = await storeRes.json()
        setStoreSettings(storeData)
      }

      if (securityRes.ok) {
        const securityData = await securityRes.json()
        setSecuritySettings(securityData)
      }

      if (emailRes.ok) {
        const emailData = await emailRes.json()
        setEmailSettings(emailData)
      }

      if (notificationRes.ok) {
        const notificationData = await notificationRes.json()
        setNotificationSettings(notificationData)
      }

    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Failed to load settings. Using default values.')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (section: string, data: any) => {
    if (!token) return

    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Failed to save ${section} settings`)
      }

      const result = await response.json()
      setSuccess(result.message || `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
      
      // If store settings were updated, refresh the public store settings
      if (section === 'store') {
        // Import and use the store settings store to refresh public settings
        const { useStoreSettingsStore } = await import('../../store/storeSettingsStore')
        const refreshSettings = useStoreSettingsStore.getState().refreshSettings
        await refreshSettings()
      }
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error(`Failed to save ${section} settings:`, err)
      setError(err instanceof Error ? err.message : `Failed to save ${section} settings`)
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (file: File) => {
    if (!token) return

    try {
      setSaving(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('logo', file)
      
      const response = await fetch(`${API_BASE_URL}/settings/store/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to upload logo')
      }

      const result = await response.json()
      
      // Update store settings with new logo URL
      setStoreSettings(prev => ({
        ...prev,
        store_logo_url: result.logo_url
      }))
      
      setSuccess('Logo uploaded successfully!')
      
      // Refresh public store settings
      const { useStoreSettingsStore } = await import('../../store/storeSettingsStore')
      const refreshSettings = useStoreSettingsStore.getState().refreshSettings
      await refreshSettings()
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to upload logo:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload logo')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB')
        return
      }
      
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoSubmit = async () => {
    if (logoFile) {
      await handleLogoUpload(logoFile)
      setLogoFile(null)
      setLogoPreview(null)
    }
  }

  const handleLogoRemove = async () => {
    if (!token) return

    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/settings/store/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to remove logo')
      }
      
      // Update store settings
      setStoreSettings(prev => ({
        ...prev,
        store_logo_url: undefined
      }))
      
      setSuccess('Logo removed successfully!')
      
      // Refresh public store settings
      const { useStoreSettingsStore } = await import('../../store/storeSettingsStore')
      const refreshSettings = useStoreSettingsStore.getState().refreshSettings
      await refreshSettings()
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to remove logo:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove logo')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const testEmailConnection = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/settings/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailSettings)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Email test failed')
      }

      const result = await response.json()
      setSuccess(result.message || 'Test email sent successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Email test failed:', err)
      setError(err instanceof Error ? err.message : 'Email test failed')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'store', name: 'Store Settings', icon: CurrencyDollarIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System', icon: CogIcon }
  ]

  // Show loading state while settings are being loaded
  if (loading && !success && !error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-64">
                <div className="h-64 bg-gray-700 rounded-2xl"></div>
              </div>
              <div className="flex-1">
                <div className="h-96 bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2 font-playfair">
            System <span className="text-gold-400">Settings</span>
          </h1>
          <p className="text-gray-300 font-lora">Configure your store and system preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/20 border border-green-700/50 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckIcon className="w-5 h-5 text-green-400" />
            <p className="text-green-300">{success}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 flex items-center gap-3"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors font-montserrat ${
                      activeTab === tab.id
                        ? 'bg-gold-900/30 text-gold-400 font-medium border border-gold-600/30'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
              
              {/* Store Settings */}
              {activeTab === 'store' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 font-playfair">Store Information</h2>
                    <p className="text-gray-300 font-lora">Basic information about your store</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                    saveSettings('store', storeSettings)
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Store Name
                        </label>
                        <input
                          type="text"
                          value={storeSettings.store_name}
                          onChange={(e) => setStoreSettings({...storeSettings, store_name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Store Email
                        </label>
                        <input
                          type="email"
                          value={storeSettings.store_email}
                          onChange={(e) => setStoreSettings({...storeSettings, store_email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Store Description
                        </label>
                        <textarea
                          value={storeSettings.store_description}
                          onChange={(e) => setStoreSettings({...storeSettings, store_description: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora resize-none"
                        />
                      </div>

                      {/* Logo Upload Section */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Store Logo
                        </label>
                        <div className="space-y-4">
                          {/* Current Logo Preview */}
                          {(storeSettings.store_logo_url || logoPreview) && (
                            <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                              <img
                                src={logoPreview || storeSettings.store_logo_url}
                                alt="Store Logo"
                                className="w-16 h-16 object-contain rounded-lg bg-white/10"
                              />
                              <div className="flex-1">
                                <p className="text-sm text-gray-300 font-medium">
                                  {logoPreview ? 'New logo preview' : 'Current logo'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {logoPreview ? 'Click "Upload Logo" to save' : 'Logo is active on your website'}
                                </p>
                              </div>
                              {!logoPreview && (
                                <button
                                  type="button"
                                  onClick={handleLogoRemove}
                                  disabled={saving}
                                  className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          )}

                          {/* Upload New Logo */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoFileChange}
                                disabled={saving}
                                className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold-600 file:text-white hover:file:bg-gold-700 file:transition-colors"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Recommended: PNG, JPG, or SVG. Max size: 5MB. Ideal dimensions: 200x80px
                              </p>
                            </div>
                            {logoFile && (
                              <button
                                type="button"
                                onClick={handleLogoSubmit}
                                disabled={saving}
                                className="bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-montserrat whitespace-nowrap"
                              >
                                {saving ? (
                                  <>
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  'Upload Logo'
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Store Phone
                        </label>
                        <input
                          type="tel"
                          value={storeSettings.store_phone}
                          onChange={(e) => setStoreSettings({...storeSettings, store_phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Currency
                        </label>
                        <select
                          value={storeSettings.currency}
                          onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 font-lora"
                        >
                          <option value="MAD">Moroccan Dirham (MAD)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="USD">US Dollar (USD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={storeSettings.tax_rate}
                          onChange={(e) => setStoreSettings({...storeSettings, tax_rate: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Shipping Cost (MAD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={storeSettings.shipping_cost}
                          onChange={(e) => setStoreSettings({...storeSettings, shipping_cost: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Free Shipping Threshold (MAD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={storeSettings.free_shipping_threshold}
                          onChange={(e) => setStoreSettings({...storeSettings, free_shipping_threshold: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>
                    </div>

                    {/* Social Media URLs Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2 font-playfair">
                        <LinkIcon className="w-5 h-5 text-gold-400" />
                        Social Media Links
                      </h3>
                      <p className="text-sm text-gray-400 font-lora">Add your social media URLs to display on your website. Leave empty to hide.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            value={storeSettings.facebook_url || ''}
                            onChange={(e) => setStoreSettings({...storeSettings, facebook_url: e.target.value || undefined})}
                            placeholder="https://facebook.com/your-page"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                            Instagram URL
                          </label>
                          <input
                            type="url"
                            value={storeSettings.instagram_url || ''}
                            onChange={(e) => setStoreSettings({...storeSettings, instagram_url: e.target.value || undefined})}
                            placeholder="https://instagram.com/your-account"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                            Twitter/X URL
                          </label>
                          <input
                            type="url"
                            value={storeSettings.twitter_url || ''}
                            onChange={(e) => setStoreSettings({...storeSettings, twitter_url: e.target.value || undefined})}
                            placeholder="https://twitter.com/your-account"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            value={storeSettings.youtube_url || ''}
                            onChange={(e) => setStoreSettings({...storeSettings, youtube_url: e.target.value || undefined})}
                            placeholder="https://youtube.com/your-channel"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                            TikTok URL
                          </label>
                          <input
                            type="url"
                            value={storeSettings.tiktok_url || ''}
                            onChange={(e) => setStoreSettings({...storeSettings, tiktok_url: e.target.value || undefined})}
                            placeholder="https://tiktok.com/@your-account"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            value={storeSettings.linkedin_url || ''}
                            onChange={(e) => setStoreSettings({...storeSettings, linkedin_url: e.target.value || undefined})}
                            placeholder="https://linkedin.com/company/your-company"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-montserrat"
                      >
                        {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                        Save Store Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 font-playfair">Security Settings</h2>
                    <p className="text-gray-300 font-lora">Configure authentication and security policies</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                    saveSettings('security', securitySettings)
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Session Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.session_timeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={securitySettings.max_login_attempts}
                          onChange={(e) => setSecuritySettings({...securitySettings, max_login_attempts: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={securitySettings.password_min_length}
                          onChange={(e) => setSecuritySettings({...securitySettings, password_min_length: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-100 font-playfair">Security Options</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'require_email_verification', label: 'Require Email Verification' },
                          { key: 'enable_two_factor', label: 'Enable Two-Factor Authentication' },
                          { key: 'password_require_uppercase', label: 'Require Uppercase Letters' },
                          { key: 'password_require_lowercase', label: 'Require Lowercase Letters' },
                          { key: 'password_require_numbers', label: 'Require Numbers' },
                          { key: 'password_require_symbols', label: 'Require Symbols' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-sm font-medium text-gray-300 font-montserrat">{option.label}</span>
                            <input
                              type="checkbox"
                              checked={securitySettings[option.key as keyof SecuritySettings] as boolean}
                              onChange={(e) => setSecuritySettings({
                                ...securitySettings,
                                [option.key]: e.target.checked
                              })}
                              className="w-4 h-4 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-montserrat"
                      >
                        {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                        Save Security Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 font-playfair">Email Configuration</h2>
                    <p className="text-gray-300 font-lora">Configure SMTP settings and email notifications</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                    saveSettings('email', emailSettings)
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtp_host}
                          onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          placeholder="smtp.gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={emailSettings.smtp_port}
                          onChange={(e) => setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          placeholder="587"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          SMTP Username
                        </label>
                        <input
                          type="text"
                          value={emailSettings.smtp_username}
                          onChange={(e) => setEmailSettings({...emailSettings, smtp_username: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          SMTP Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={emailSettings.smtp_password}
                            onChange={(e) => setEmailSettings({...emailSettings, smtp_password: e.target.value})}
                            className="w-full px-4 py-2 pr-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.from_email}
                          onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={emailSettings.from_name}
                          onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-300 font-montserrat">Use TLS Encryption</span>
                      <input
                        type="checkbox"
                        checked={emailSettings.smtp_use_tls}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_use_tls: e.target.checked})}
                        className="w-4 h-4 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-100 font-playfair">Email Notifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'enable_order_notifications', label: 'Order Notifications' },
                          { key: 'enable_low_stock_alerts', label: 'Low Stock Alerts' },
                          { key: 'enable_welcome_emails', label: 'Welcome Emails' },
                          { key: 'enable_marketing_emails', label: 'Marketing Emails' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-sm font-medium text-gray-300 font-montserrat">{option.label}</span>
                            <input
                              type="checkbox"
                              checked={emailSettings[option.key as keyof EmailSettings] as boolean}
                              onChange={(e) => setEmailSettings({
                                ...emailSettings,
                                [option.key]: e.target.checked
                              })}
                              className="w-4 h-4 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={testEmailConnection}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-montserrat"
                      >
                        {loading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                        Test Connection
                      </button>
                      
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-montserrat"
                      >
                        {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                        Save Email Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 font-playfair">Notification Settings</h2>
                    <p className="text-gray-300 font-lora">Configure system notifications and alerts</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                    saveSettings('notifications', notificationSettings)
                  }} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-100 font-playfair">Notification Channels</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: 'enable_browser_notifications', label: 'Browser Notifications', desc: 'Show notifications in browser' },
                          { key: 'enable_email_alerts', label: 'Email Alerts', desc: 'Send email notifications' },
                          { key: 'enable_sms_alerts', label: 'SMS Alerts', desc: 'Send SMS notifications' }
                        ].map((option) => (
                          <div key={option.key} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-300 font-montserrat">{option.label}</span>
                              <input
                                type="checkbox"
                                checked={notificationSettings[option.key as keyof NotificationSettings] as boolean}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  [option.key]: e.target.checked
                                })}
                                className="w-4 h-4 text-gold-600 border-gray-500 bg-gray-600 rounded focus:ring-gold-500"
                              />
                            </div>
                            <p className="text-xs text-gray-400 font-lora">{option.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">
                        Global Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={notificationSettings.low_stock_threshold_global}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          low_stock_threshold_global: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-700 placeholder-gray-400 font-lora"
                      />
                      <p className="text-sm text-gray-400 mt-1 font-lora">Default threshold for all products</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-montserrat"
                      >
                        {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                        Save Notification Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 font-playfair">System Management</h2>
                    <p className="text-gray-300 font-lora">System maintenance and advanced settings</p>
                  </div>

                  <div className="space-y-6">
                    {/* System Status */}
                    <div className="bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-100 mb-4 font-playfair">System Status</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckIcon className="w-6 h-6 text-green-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-100 font-montserrat">Database</p>
                          <p className="text-xs text-green-400 font-lora">Online</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckIcon className="w-6 h-6 text-green-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-100 font-montserrat">API</p>
                          <p className="text-xs text-green-400 font-lora">Healthy</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <ClockIcon className="w-6 h-6 text-yellow-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-100 font-montserrat">Cache</p>
                          <p className="text-xs text-yellow-400 font-lora">Warming</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckIcon className="w-6 h-6 text-green-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-100 font-montserrat">Storage</p>
                          <p className="text-xs text-green-400 font-lora">Available</p>
                        </div>
                      </div>
                    </div>

                    {/* System Actions */}
                    <div className="bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-100 mb-4 font-playfair">System Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gold-500 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <ChartBarIcon className="w-8 h-8 text-blue-400" />
                            <div>
                              <p className="font-medium text-gray-100 font-montserrat">Generate Reports</p>
                              <p className="text-sm text-gray-400 font-lora">Create system and sales reports</p>
                            </div>
                          </div>
                        </button>

                        <button className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gold-500 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <ArrowPathIcon className="w-8 h-8 text-green-400" />
                            <div>
                              <p className="font-medium text-gray-100 font-montserrat">Clear Cache</p>
                              <p className="text-sm text-gray-400 font-lora">Clear system cache and temp files</p>
                            </div>
                          </div>
                        </button>

                        <button className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gold-500 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <DocumentTextIcon className="w-8 h-8 text-purple-400" />
                            <div>
                              <p className="font-medium text-gray-100 font-montserrat">Export Data</p>
                              <p className="text-sm text-gray-400 font-lora">Export products, orders, and users</p>
                            </div>
                          </div>
                        </button>

                        <button className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-red-500 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                            <div>
                              <p className="font-medium text-gray-100 font-montserrat">Maintenance Mode</p>
                              <p className="text-sm text-gray-400 font-lora">Enable/disable maintenance mode</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* System Toggles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-100 font-playfair">System Configuration</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-100 font-montserrat">Maintenance Mode</p>
                            <p className="text-sm text-gray-400 font-lora">Temporarily disable public access</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.maintenance_mode}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              maintenance_mode: e.target.checked
                            })}
                            className="w-4 h-4 text-red-600 border-gray-500 bg-gray-600 rounded focus:ring-red-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-100 font-montserrat">Debug Mode</p>
                            <p className="text-sm text-gray-400 font-lora">Show detailed error messages</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.debug_mode}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              debug_mode: e.target.checked
                            })}
                            className="w-4 h-4 text-yellow-600 border-gray-500 bg-gray-600 rounded focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 