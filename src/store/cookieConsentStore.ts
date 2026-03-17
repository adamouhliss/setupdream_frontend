import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CookieConsent, CookieSettings, CookieCategory } from '../types/cookies'

interface CookieConsentState {
  consent: CookieConsent
  showBanner: boolean
  showPreferences: boolean
  categories: CookieCategory[]
  
  // Actions
  acceptAll: () => void
  rejectAll: () => void
  updateConsent: (settings: Partial<CookieSettings>) => void
  showPreferencesModal: () => void
  hidePreferencesModal: () => void
  hideBanner: () => void
  resetConsent: () => void
}

const CONSENT_VERSION = '1.0'

const defaultCategories: CookieCategory[] = [
  {
    id: 'strictly_necessary',
    name: 'Strictly Necessary',
    description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and user sessions. Without these cookies, the website cannot operate correctly.',
    essential: true,
    enabled: true
  },
  {
    id: 'performance',
    name: 'Performance & Analytics',
    description: 'These cookies help us understand how visitors interact with our website by collecting anonymous information. This helps us improve our website performance and user experience.',
    essential: false,
    enabled: false
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and providing personalized content.',
    essential: false,
    enabled: false
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure the effectiveness of our marketing campaigns.',
    essential: false,
    enabled: false
  }
]

const defaultConsent: CookieConsent = {
  hasConsented: false,
  consentDate: null,
  categories: {
    strictly_necessary: true,
    performance: false,
    functional: false,
    marketing: false
  },
  version: CONSENT_VERSION
}

// Helper functions for cookie management
const initializeTrackingServices = (categories: Record<string, boolean>) => {
  // Google Analytics
  if (categories.performance && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    })
  }
  
  // Marketing tracking
  if (categories.marketing && window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    })
  }
  
  // Facebook Pixel
  if (categories.marketing && window.fbq) {
    window.fbq('consent', 'grant')
  }
}

const removeNonEssentialCookies = () => {
  // Remove Google Analytics cookies
  const gaCookies = ['_ga', '_ga_', '_gid', '_gat']
  gaCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
  })
  
  // Remove Facebook Pixel cookies
  const fbCookies = ['_fbp', '_fbc', 'fr']
  fbCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
  })
  
  // Disable Google Analytics
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    })
  }
  
  // Disable Facebook Pixel
  if (window.fbq) {
    window.fbq('consent', 'revoke')
  }
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      consent: defaultConsent,
      showBanner: true,
      showPreferences: false,
      categories: defaultCategories,

      acceptAll: () => {
        const newConsent: CookieConsent = {
          hasConsented: true,
          consentDate: new Date(),
          categories: {
            strictly_necessary: true,
            performance: true,
            functional: true,
            marketing: true
          },
          version: CONSENT_VERSION
        }
        
        set({ 
          consent: newConsent, 
          showBanner: false,
          showPreferences: false 
        })
        
        // Initialize tracking services
        initializeTrackingServices(newConsent.categories)
      },

      rejectAll: () => {
        const newConsent: CookieConsent = {
          hasConsented: true,
          consentDate: new Date(),
          categories: {
            strictly_necessary: true, // Always enabled
            performance: false,
            functional: false,
            marketing: false
          },
          version: CONSENT_VERSION
        }
        
        set({ 
          consent: newConsent, 
          showBanner: false,
          showPreferences: false 
        })
        
        // Remove non-essential cookies and disable tracking
        removeNonEssentialCookies()
      },

      updateConsent: (settings: Partial<CookieSettings>) => {
        const currentConsent = get().consent
        const newCategories = {
          ...currentConsent.categories,
          ...settings,
          strictly_necessary: true // Always true
        }
        
        const newConsent: CookieConsent = {
          hasConsented: true,
          consentDate: new Date(),
          categories: newCategories,
          version: CONSENT_VERSION
        }
        
        set({ 
          consent: newConsent, 
          showBanner: false,
          showPreferences: false 
        })
        
        // Update tracking services based on new consent
        initializeTrackingServices(newCategories)
      },

      showPreferencesModal: () => set({ showPreferences: true }),
      hidePreferencesModal: () => set({ showPreferences: false }),
      hideBanner: () => set({ showBanner: false }),

      resetConsent: () => {
        set({ 
          consent: defaultConsent, 
          showBanner: true,
          showPreferences: false 
        })
        // Clear all non-essential cookies
        removeNonEssentialCookies()
      }
    }),
    {
      name: 'cookie-consent-storage',
      partialize: (state) => ({ 
        consent: state.consent,
        showBanner: !state.consent.hasConsented // Show banner if no consent given
      })
    }
  )
)

// Global type declarations for tracking scripts
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
} 