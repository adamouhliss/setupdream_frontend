import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, updateProfile, isLoading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  })

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        country: user.country || 'Morocco'
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSave = async () => {
    try {
      setError('')
      await updateProfile(formData)
      setSuccess(t('account.profileUpdated'))
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.profileUpdateError'))
    }
  }

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        country: user.country || 'Morocco'
      })
    }
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-600 border-t-gold-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-lora">{t('account.loadingProfile')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-gray-100 mb-2">
            {t('account.title')}
          </h1>
          <p className="text-gray-300 font-lora text-sm sm:text-base">
            {t('account.profileDescription')}
          </p>
        </motion.div>

        {/* Alert Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/20 border border-red-700/50 rounded-xl flex items-center gap-3"
          >
            <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm font-montserrat">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-900/20 border border-green-700/50 rounded-xl flex items-center gap-3"
          >
            <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm font-montserrat">{success}</p>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700 overflow-hidden"
        >
          {/* Profile Header - Mobile Optimized */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 sm:p-6 lg:p-8 border-b border-gray-700">
            {/* Mobile Layout: Stack everything vertically */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              {/* User Info Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-montserrat">
                    {user.first_name?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
                
                {/* User Details */}
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold font-playfair text-gray-100">
                    {user.first_name ? `${user.first_name} ${user.last_name}` : t('account.userProfile')}
                  </h2>
                  <p className="text-gray-300 font-lora text-sm sm:text-base">{user.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                    <span className={`px-2 sm:px-3 py-1 text-xs font-medium font-montserrat rounded-full ${
                      user.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-600/30' 
                        : 'bg-red-900/30 text-red-400 border border-red-600/30'
                    }`}>
                      {user.is_active ? t('status.active') : t('status.inactive')}
                    </span>
                    {user.is_superuser && (
                      <span className="px-2 sm:px-3 py-1 text-xs font-medium font-montserrat rounded-full bg-purple-900/30 text-purple-400 border border-purple-600/30">
                        {t('navigation.admin')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Mobile Optimized */}
              <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-xl font-medium font-montserrat transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base min-h-[44px] sm:min-h-[auto]"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>{t('account.editProfile')}</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded-xl font-medium font-montserrat transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base min-h-[44px] sm:min-h-[auto]"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>{t('common.cancel')}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium font-montserrat transition-colors duration-200 disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base min-h-[44px] sm:min-h-[auto]"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span>{t('account.saveChanges')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-playfair text-gray-100 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gold-400" />
                  {t('account.personalInfo')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.firstName')}
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                      placeholder={t('account.enterFirstName')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.lastName')}
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                      placeholder={t('account.enterLastName')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true} // Email should not be editable
                        className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <p className="text-xs text-gray-400 font-montserrat mt-1">
                      {t('account.emailNotEditable')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.phone')}
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                        placeholder="+212 XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-playfair text-gray-100 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-gold-400" />
                  {t('account.addressInfo')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.streetAddress')}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                      placeholder={t('account.streetAddressPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.city')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                      placeholder={t('account.cityPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.postalCode')}
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                      placeholder="20000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                      {t('account.country')}
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-700 disabled:text-gray-400 bg-gray-700 text-gray-100 font-lora transition-colors duration-200 text-sm sm:text-base"
                    >
                      <option value="Morocco">{t('account.morocco')}</option>
                      <option value="France">{t('account.france')}</option>
                      <option value="Spain">{t('account.spain')}</option>
                      <option value="Germany">{t('account.germany')}</option>
                      <option value="Other">{t('account.other')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
              <h3 className="text-lg font-bold font-playfair text-gray-100 mb-4">
                {t('account.accountInfo')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm font-montserrat">
                <div className="text-center sm:text-left">
                  <span className="text-gray-400">{t('account.memberSince')}:</span>
                  <span className="ml-0 sm:ml-2 block sm:inline font-semibold text-gray-100">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-gray-400">{t('account.lastUpdated')}:</span>
                  <span className="ml-0 sm:ml-2 block sm:inline font-semibold text-gray-100">
                    {user.updated_at 
                      ? new Date(user.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : t('account.never')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
} 