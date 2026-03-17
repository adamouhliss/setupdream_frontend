// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

export interface Discount {
  type: 'percentage' | 'fixed'
  value: number
  code: string
  description: string
  minOrderAmount?: number
  maxDiscountAmount?: number
}

export interface DiscountResult {
  isValid: boolean
  discount?: Discount
  discountAmount: number
  error?: string
}

export const FIRST_TIME_CUSTOMER_DISCOUNT: Discount = {
  type: 'percentage',
  value: 10,
  code: 'WELCOME10',
  description: 'First-time customer discount',
  minOrderAmount: 0
}

class DiscountService {
  
  /**
   * Check if user is eligible for first-time customer discount
   */
  isEligibleForFirstTimeDiscount(user: any): boolean {
    // Must be logged in and not have used the discount before
    return user && user.has_used_first_time_discount === false
  }

  /**
   * Check current user discount eligibility from API (real-time check)
   */
  async checkCurrentDiscountEligibility(token: string): Promise<boolean> {
    try {
      console.log('Making API call to check discount eligibility...')
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        console.error('Failed to fetch current user data, status:', response.status)
        return false
      }

      const currentUser = await response.json()
      console.log('Current user from API:', currentUser)
      console.log('has_used_first_time_discount:', currentUser.has_used_first_time_discount)
      
      return currentUser && currentUser.has_used_first_time_discount === false
    } catch (error) {
      console.error('Error checking discount eligibility:', error)
      return false
    }
  }

  /**
   * Calculate discount amount for a given subtotal
   */
  calculateDiscountAmount(discount: Discount, subtotal: number): number {
    if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
      return 0
    }

    let discountAmount = 0

    if (discount.type === 'percentage') {
      discountAmount = (subtotal * discount.value) / 100
    } else if (discount.type === 'fixed') {
      discountAmount = discount.value
    }

    // Apply maximum discount limit if specified
    if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
      discountAmount = discount.maxDiscountAmount
    }

    // Ensure discount doesn't exceed subtotal
    return Math.min(discountAmount, subtotal)
  }

  /**
   * Apply first-time customer discount if eligible (with real-time check)
   */
  async applyFirstTimeDiscountWithCheck(user: any, token: string, subtotal: number): Promise<DiscountResult> {
    console.log('applyFirstTimeDiscountWithCheck called with:', { user: user.email, subtotal })
    
    // First check with real-time API call
    const isEligible = await this.checkCurrentDiscountEligibility(token)
    console.log('Real-time eligibility check result:', isEligible)
    
    if (!isEligible) {
      return {
        isValid: false,
        discountAmount: 0,
        error: user ? 'You have already used your first-time customer discount' : 'Please log in to use the first-time customer discount'
      }
    }

    const discountAmount = this.calculateDiscountAmount(FIRST_TIME_CUSTOMER_DISCOUNT, subtotal)
    console.log('Calculated discount amount:', discountAmount)

    if (discountAmount === 0) {
      return {
        isValid: false,
        discountAmount: 0,
        error: `Minimum order amount is ${FIRST_TIME_CUSTOMER_DISCOUNT.minOrderAmount} MAD`
      }
    }

    return {
      isValid: true,
      discount: FIRST_TIME_CUSTOMER_DISCOUNT,
      discountAmount
    }
  }

  /**
   * Mark first-time discount as used (this would be called after successful order)
   */
  async markFirstTimeDiscountAsUsed(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          has_used_first_time_discount: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update discount status')
      }

      const updatedUser = await response.json()
      return updatedUser
    } catch (error) {
      console.error('Failed to mark first-time discount as used:', error)
      throw error
    }
  }

  /**
   * Format discount amount for display
   */
  formatDiscountAmount(amount: number): string {
    return new Intl.NumberFormat('en-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(amount)
  }
}

export const discountService = new DiscountService() 