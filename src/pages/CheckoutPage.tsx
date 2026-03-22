import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PhoneIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useStoreSettingsStore } from '../store/storeSettingsStore'
import { discountService } from '../services/discountService'
import { formatMAD } from '../utils/currency'
import { getProductPrimaryImage } from '../utils/productImages'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'  // Production

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const { user, token } = useAuthStore()
  const { settings, fetchSettings } = useStoreSettingsStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [discountResult, setDiscountResult] = useState<any>({ isValid: false, discountAmount: 0 })
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Morocco'
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<any>(null)

  // Promo Code States
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isPromoLoading, setIsPromoLoading] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount_rate: number } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Pre-fill shipping info from user profile
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || '',
        country: user.country || 'Morocco'
      }))
    }
  }, [user])

  // Check discount eligibility with real-time API call
  useEffect(() => {
    const checkDiscount = async () => {
      if (user && token) {
        console.log('Checking discount eligibility for user:', user.email)
        try {
          const subtotal = getTotalPrice()
          console.log('Subtotal for discount calculation:', subtotal)

          const result = await discountService.applyFirstTimeDiscountWithCheck(user, token, subtotal)
          console.log('Discount check result:', result)

          setDiscountResult(result)
        } catch (error) {
          console.error('Error checking discount, using simple fallback:', error)
          // Simple fallback: check if user has used discount based on cached data
          const isEligible = user && user.has_used_first_time_discount === false
          if (isEligible) {
            const subtotal = getTotalPrice()
            const discountAmount = subtotal * 0.1 // 10% discount
            setDiscountResult({
              isValid: true,
              discountAmount,
              discount: { type: 'percentage', value: 10, code: 'WELCOME10', description: 'First-time customer discount' }
            })
          } else {
            setDiscountResult({ isValid: false, discountAmount: 0 })
          }
        }
      } else {
        console.log('No user or token, setting discount to invalid')
        setDiscountResult({ isValid: false, discountAmount: 0 })
      }
    }

    checkDiscount()
  }, [user, token]) // Removed getTotalPrice() from dependencies to avoid infinite re-renders

  // Debug useEffect to track modal state
  useEffect(() => {
    console.log('Modal state changed:', { showSuccessModal, orderSuccess })
    if (showSuccessModal && orderSuccess) {
      console.log('✅ Modal should be visible now!')
    }
  }, [showSuccessModal, orderSuccess])

  // Redirect to cart if no items (but not if order is processing or success modal is showing)
  useEffect(() => {
    if (items.length === 0 && !isProcessing && !showSuccessModal && !orderSuccess) {
      navigate('/cart')
    }
  }, [items.length, navigate, isProcessing, showSuccessModal, orderSuccess])

  // Moroccan phone number formatting
  const formatMoroccanPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    let formatted = ''

    if (digits.startsWith('212')) {
      const phoneNumber = digits.slice(3)
      if (phoneNumber.length <= 9) {
        formatted = `+212 ${phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3').trim()}`
      }
    } else if (digits.startsWith('0')) {
      const phoneNumber = digits.slice(1)
      if (phoneNumber.length <= 9) {
        formatted = `+212 ${phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3').trim()}`
      }
    } else {
      if (digits.length <= 9) {
        formatted = `+212 ${digits.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3').trim()}`
      }
    }

    return formatted || `+212 ${digits}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoroccanPhone(e.target.value)
    setShippingInfo(prev => ({ ...prev, phone: formatted }))
  }

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return

    setIsPromoLoading(true)
    setPromoError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/orders/validate-promo?code=${encodeURIComponent(promoInput)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      if (!response.ok) {
        throw new Error('Invalid or expired promo code.')
      }

      const data = await response.json()
      if (data.valid) {
        setAppliedPromo({
          code: data.code,
          discount_rate: data.discount_rate
        })
        setPromoInput('')
      }
    } catch (err: any) {
      setPromoError(err.message || 'Invalid promo code')
      setAppliedPromo(null)
    } finally {
      setIsPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoError(null)
  }

  const subtotal = getTotalPrice()

  // Calculate discount: Custom Promo Code takes priority, fallback to first-time customer discount
  let discountAmount = 0
  let activeDiscountCode = null

  if (appliedPromo) {
    discountAmount = subtotal * (appliedPromo.discount_rate / 100)
    activeDiscountCode = appliedPromo.code
  } else if (discountResult.isValid) {
    discountAmount = discountResult.discountAmount
    activeDiscountCode = discountResult.discount?.code || 'WELCOME10'
  }

  const shipping = subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_cost
  const tax = (subtotal - discountAmount) * (settings.tax_rate / 100)
  const total = subtotal - discountAmount + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted!')
    console.log('Current shipping info:', shippingInfo)
    console.log('Current step:', currentStep)

    // Validate required fields
    const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']
    const missingFields = requiredShippingFields.filter(field => !shippingInfo[field as keyof ShippingInfo])

    if (missingFields.length > 0) {
      console.error('Missing required shipping fields:', missingFields)
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      setCurrentStep(1)
      return
    }

    console.log('All validation passed, processing order...')
    setIsProcessing(true)

    // Create order object for API
    const orderData = {
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,  // Added selectedSize
        productImage: item.product.image || null,  // Added product image for order display
        total: item.product.price * item.quantity
      })),
      // Flatten shipping info to top level with snake_case field names
      first_name: shippingInfo.firstName.trim(),
      last_name: shippingInfo.lastName.trim(),
      email: shippingInfo.email.trim(),
      phone: shippingInfo.phone.trim(),
      address: shippingInfo.address.trim(),
      city: shippingInfo.city.trim(),
      postal_code: shippingInfo.postalCode.trim(),
      country: shippingInfo.country || 'Morocco',
      payment_method: 'cash',
      subtotal: Number(subtotal.toFixed(2)),
      discount_amount: Number(discountAmount.toFixed(2)),
      discount_code: activeDiscountCode,
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: 'pending',
      notes: null
    }

    console.log('Order data created:', orderData)

    try {
      // Create order via API
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.statusText}`)
      }

      const createdOrder = await response.json()
      console.log('Order created successfully:', createdOrder)

      // Mark first-time discount as used if it was applied
      if (discountResult.isValid && user && token) {
        try {
          await discountService.markFirstTimeDiscountAsUsed(token)
          console.log('First-time discount marked as used successfully')
        } catch (discountError) {
          console.error('Failed to mark discount as used:', discountError)
          // Don't fail the order for this, just log it
        }
      }

      // Clear cart and show success
      clearCart()
      setIsProcessing(false)

      // Convert API response to frontend format for modal
      const frontendOrder = {
        id: createdOrder.id,
        customerId: createdOrder.customer_id?.toString() || 'guest',
        items: orderData.items,
        shippingInfo,
        paymentMethod: 'cash',
        subtotal,
        shipping,
        tax,
        total,
        status: createdOrder.status,
        createdAt: createdOrder.created_at,
        estimatedDelivery: createdOrder.estimated_delivery
      }

      // Show success modal
      console.log('Setting modal state...')
      setOrderSuccess(frontendOrder)
      setShowSuccessModal(true)
      console.log('Modal state set:', { showSuccessModal: true, orderSuccess: frontendOrder })

    } catch (error) {
      console.error('Order creation failed:', error)
      alert('Failed to create order. Please try again.')
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing && !showSuccessModal && !orderSuccess) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors mb-6 font-montserrat"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t('common.back')} {t('cart.title')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-100">
            {t('checkout.title')}
          </h1>
          <p className="text-gray-300 font-lora mt-2">
            {t('checkout.completeOrder')} - {getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, label: t('cart.shipping') },
              { step: 2, label: 'Review' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-montserrat text-sm border-2 ${currentStep >= item.step
                  ? 'bg-gold-500 text-white border-gold-500'
                  : 'bg-gray-800 text-gray-400 border-gray-600'
                  }`}>
                  {item.step}
                </div>
                <span className={`ml-3 font-medium font-montserrat ${currentStep >= item.step ? 'text-gold-400' : 'text-gray-500'
                  }`}>
                  {item.label}
                </span>
                {index < 1 && (
                  <div className={`w-16 h-0.5 ml-8 ${currentStep > item.step ? 'bg-gold-500' : 'bg-gray-600'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700/30 p-8 mb-6"
                >
                  <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
                    {t('checkout.shippingInfo')}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.firstName')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => handleShippingChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${shippingInfo.firstName.length > 1 ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder={t('account.enterFirstName')}
                        />
                        {shippingInfo.firstName.length > 1 && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.lastName')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => handleShippingChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${shippingInfo.lastName.length > 1 ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder={t('account.enterLastName')}
                        />
                        {shippingInfo.lastName.length > 1 && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.email')}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => handleShippingChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email) ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder={t('auth.enterEmail')}
                        />
                        {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email) && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.phone')}
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={handlePhoneChange}
                          className={`w-full pl-4 pr-10 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${shippingInfo.phone.replace(/\D/g, '').length >= 9 ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder="+212 6X XXX XXXX"
                        />
                        {shippingInfo.phone.replace(/\D/g, '').length >= 9 && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.address')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => handleShippingChange('address', e.target.value)}
                          className={`w-full px-4 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${shippingInfo.address.length > 5 ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder={t('account.streetAddressPlaceholder')}
                        />
                        {shippingInfo.address.length > 5 && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.city')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          className={`w-full px-4 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${shippingInfo.city.length > 2 ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder={t('account.cityPlaceholder')}
                        />
                        {shippingInfo.city.length > 2 && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                        {t('checkout.postalCode')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={shippingInfo.postalCode}
                          onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                          className={`w-full px-4 py-3 border bg-gray-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 font-lora placeholder-gray-400 transition-colors ${shippingInfo.postalCode.length >= 4 ? 'border-green-500/50' : 'border-gray-600 focus:border-gold-500'}`}
                          placeholder="20000"
                        />
                        {shippingInfo.postalCode.length >= 4 && (
                          <CheckCircleIcon className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full mt-8 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-4 text-lg font-montserrat rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Review Order
                  </button>
                </motion.div>
              )}

              {/* Order Review */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700/30 p-8 mb-6"
                >
                  <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
                    {t('checkout.reviewYourOrder')}
                  </h2>

                  {/* Payment Method - Cash on Delivery */}
                  <div className="mb-6 p-4 bg-gold-900/20 border border-gold-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <TruckIcon className="w-6 h-6 text-gold-400" />
                      <div>
                        <h3 className="font-semibold font-montserrat text-gold-300">{t('checkout.cashOnDelivery')}</h3>
                        <p className="text-sm font-lora text-gold-400">{t('checkout.payWhenReceive')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-8">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-4 p-4 bg-gray-700/50 border border-gray-600/30 rounded-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={getProductPrimaryImage(item.product.id, item.product.image)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<span class="text-xs font-semibold font-montserrat text-gray-300">${item.product.name.split(' ')[0]}</span>`;
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold font-playfair text-gray-100">{item.product.name}</h4>
                          <p className="text-sm text-gray-400 font-montserrat">
                            {item.selectedColor && `${t('checkout.color')}: ${item.selectedColor} • `}
                            {item.selectedSize && `${t('checkout.size')}: ${item.selectedSize} • `}
                            {t('checkout.qty')}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold font-playfair text-gold-400">
                            {formatMAD(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100 py-4 font-montserrat rounded-xl transition-all duration-300"
                    >
                      {t('checkout.backToShipping')}
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-4 font-montserrat rounded-xl disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isProcessing ? t('checkout.processingOrder') : t('checkout.placeOrderBtn')}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700/30 p-6 sticky top-8"
            >
              <h3 className="text-xl font-bold font-playfair text-gray-100 mb-6">
                {t('cart.summary')}
              </h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-3 text-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={getProductPrimaryImage(item.product.id, item.product.image)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-xs font-semibold font-montserrat text-gray-300">${item.product.name.split(' ')[0]}</span>`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium font-playfair text-gray-100 text-sm">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400 font-montserrat">
                        {item.selectedColor && `${item.selectedColor} • `}
                        {item.selectedSize && `${item.selectedSize} • `}
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold font-playfair text-gold-400">
                      {formatMAD(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="mb-6 pt-6 border-t border-gray-600">
                <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
                  {t('checkout.promoCode')}
                </label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400">
                      <GiftIcon className="w-5 h-5" />
                      <span className="font-bold tracking-wider">{appliedPromo.code}</span>
                      <span className="text-sm">(-{appliedPromo.discount_rate}%)</span>
                    </div>
                    <button onClick={handleRemovePromo} className="text-gray-400 hover:text-red-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 relative">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder={t('checkout.enterPromoCode')}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 font-bold tracking-widest uppercase transition-colors"
                      disabled={isPromoLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={isPromoLoading || !promoInput.trim()}
                      className="px-4 py-2 bg-gray-600 hover:bg-gold-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:hover:bg-gray-600"
                    >
                      {isPromoLoading ? '...' : t('checkout.apply')}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-red-400 text-sm mt-2">{promoError}</p>
                )}
              </div>

              {/* Pricing Summary */}
              <div className="space-y-3 mb-6 border-t border-gray-600 pt-6">
                <div className="flex justify-between text-gray-300 font-montserrat">
                  <span>{t('common.subtotal')} ({getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')})</span>
                  <span>{formatMAD(subtotal)}</span>
                </div>

                {/* Discount Applied */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400 font-montserrat">
                    <span className="flex items-center gap-2">
                      <GiftIcon className="w-4 h-4" />
                      {appliedPromo ? `Promo: ${appliedPromo.code} (${appliedPromo.discount_rate}%)` : 'First-time discount (10%)'}
                    </span>
                    <span>-{formatMAD(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300 font-montserrat">
                  <span>{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? t('cart.free') : formatMAD(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-300 font-montserrat">
                  <span>{t('cart.tax')} ({settings.tax_rate}%)</span>
                  <span>{formatMAD(tax)}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold font-playfair text-gray-100">
                    <span>{t('common.total')}</span>
                    <span className="text-gold-400">{formatMAD(total)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <p className="text-sm text-green-400 font-montserrat mt-1 text-right">
                      {t('checkout.youSaved', { amount: formatMAD(discountAmount) })}
                    </p>
                  )}
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 text-sm text-gray-400 font-montserrat">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                  <span>{t('checkout.secureCheckout')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4 text-green-400" />
                  <span>{t('checkout.dataProtection')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  <span>{t('checkout.moneyBackGuarantee')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Beautiful Order Success Modal */}
        <AnimatePresence>
          {showSuccessModal && orderSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onAnimationStart={() => console.log('🎬 Modal animation started')}
              onAnimationComplete={() => console.log('✨ Modal animation completed')}
            >
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    duration: 0.6
                  }}
                  className="relative bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                >
                  {/* Celebration Background Elements */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {/* Floating celebration particles */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          y: 100,
                          x: Math.random() * 400 - 200,
                          rotate: 0
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          y: -100,
                          x: Math.random() * 400 - 200,
                          rotate: 360
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                        className={`absolute w-3 h-3 rounded-full bg-gold-${400 + (i % 2) * 100}`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: '100%'
                        }}
                      />
                    ))}

                    {/* Golden gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-900/30 via-transparent to-gold-800/20" />
                  </div>

                  <div className="relative p-8 text-center">
                    {/* Success Icon with Animation */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                        delay: 0.3
                      }}
                      className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <CheckCircleIcon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Success Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-3xl md:text-4xl font-bold font-playfair text-gray-100 mb-4"
                    >
                      🎉 {t('checkout.orderPlacedSuccessfully')}
                    </motion.h2>

                    {/* Order Number */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-2xl inline-block mb-6 shadow-lg"
                    >
                      <span className="text-lg font-bold font-montserrat">
                        {t('checkout.orderNumber', { id: orderSuccess.id })}
                      </span>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="bg-gray-700/50 rounded-2xl p-6 mb-6 text-left border border-gray-600/30"
                    >
                      <h3 className="font-bold font-playfair text-gray-100 mb-4 text-center">{t('checkout.orderSummary')}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-montserrat text-gray-300">{t('checkout.itemsCount')}:</span>
                          <span className="font-semibold font-lora text-gray-100">{orderSuccess.items.length} products</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span className="font-montserrat flex items-center gap-1">
                              <GiftIcon className="w-4 h-4" />
                              First-time discount:
                            </span>
                            <span className="font-semibold font-lora">-{formatMAD(discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-montserrat text-gray-300">{t('checkout.totalAmount')}</span>
                          <span className="font-bold font-playfair text-gold-400 text-lg">{formatMAD(orderSuccess.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-montserrat text-gray-300">{t('checkout.payment')}</span>
                          <span className="font-semibold font-lora text-gray-100">{t('checkout.cashOnDelivery')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-montserrat text-gray-300">{t('checkout.deliveryTo')}</span>
                          <span className="font-semibold font-lora text-gray-100">{orderSuccess.shippingInfo.city}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-6 mb-6 text-left"
                    >
                      <h3 className="font-bold font-playfair text-blue-300 mb-4 text-center flex items-center justify-center gap-2">
                        <PhoneIcon className="w-5 h-5" />
                        {t('checkout.whatHappensNext')}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold font-montserrat flex-shrink-0">1</div>
                          <div>
                            <p className="font-semibold font-montserrat text-blue-300">{t('checkout.confirmationCall')}</p>
                            <p className="text-sm font-lora text-blue-400">{t('checkout.confirmationCallDesc')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold font-montserrat flex-shrink-0">2</div>
                          <div>
                            <p className="font-semibold font-montserrat text-blue-300">{t('checkout.orderPreparation')}</p>
                            <p className="text-sm font-lora text-blue-400">{t('checkout.orderPreparationDesc')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold font-montserrat flex-shrink-0">3</div>
                          <div>
                            <p className="font-semibold font-montserrat text-blue-300">{t('checkout.deliveryPayment')}</p>
                            <p className="text-sm font-lora text-blue-400">{t('checkout.deliveryPaymentDesc')}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="bg-gold-900/20 border border-gold-700/30 rounded-2xl p-4 mb-6"
                    >
                      <p className="text-sm font-montserrat text-gold-300 mb-2">
                        {t('checkout.importantKeepPhone', { phone: orderSuccess.shippingInfo.phone })}
                      </p>
                      <p className="text-xs font-lora text-gold-400">
                        {t('checkout.callUsChanges', { phone: settings.store_phone || '+212 632-253960' })}
                      </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <button
                        onClick={() => {
                          setShowSuccessModal(false)
                          navigate('/')
                        }}
                        className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-4 text-lg font-montserrat rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {t('checkout.continueShopping')}
                      </button>
                      <button
                        onClick={() => {
                          setShowSuccessModal(false)
                          navigate('/products')
                        }}
                        className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100 py-4 text-lg font-montserrat rounded-xl transition-all duration-300"
                      >
                        {t('checkout.browseProducts')}
                      </button>
                    </motion.div>

                    {/* Thank You Message */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7, duration: 0.8 }}
                      className="mt-8 pt-6 border-t border-gray-600"
                    >
                      <p className="text-lg font-playfair text-gray-300 mb-2">
                        {t('checkout.thankYouChoosing')}
                        <span className="font-bold text-gold-400"> SetupDream!</span>
                      </p>
                      <p className="text-sm font-lora text-gray-400">
                        {t('checkout.excitedToHelp')}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 
