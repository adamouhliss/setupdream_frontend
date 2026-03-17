import { useEffect } from 'react'
import { useCookieConsentStore } from '../../store/cookieConsentStore'

export default function CookieInitializer() {
  const { consent } = useCookieConsentStore()

  useEffect(() => {
    // Initialize Google Consent Mode with default deny state
    if (window.gtag) {
      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      })
    }

    // Check if user has already consented
    if (consent.hasConsented) {
      // Apply user's previous consent choices
      if (window.gtag) {
        window.gtag('consent', 'update', {
          ad_storage: consent.categories.marketing ? 'granted' : 'denied',
          ad_user_data: consent.categories.marketing ? 'granted' : 'denied',
          ad_personalization: consent.categories.marketing ? 'granted' : 'denied',
          analytics_storage: consent.categories.performance ? 'granted' : 'denied'
        })
      }

      // Initialize Facebook Pixel if marketing is enabled
      if (consent.categories.marketing && window.fbq) {
        window.fbq('consent', 'grant')
      }
    }

    // Detect if user is from a region requiring consent (simplified check)
    const requiresConsent = isEUUser()
    
    if (requiresConsent && !consent.hasConsented) {
      // Show banner for users who need to provide consent
      // This is already handled by the store's initial state
    }
  }, [consent])

  return null // This component doesn't render anything
}

// Simple function to detect if user might be from EU/EEA
function isEUUser(): boolean {
  // This is a simplified check. In production, you'd want to use:
  // - IP geolocation service
  // - User's browser language
  // - Or ask the user directly
  
  const language = navigator.language || ''
  const euLanguages = [
    'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'ro', 'cs', 'sk', 
    'hu', 'bg', 'hr', 'sl', 'lt', 'lv', 'et', 'fi', 'sv', 'da',
    'el', 'mt', 'ga', 'en-GB'
  ]
  
  return euLanguages.some(lang => language.startsWith(lang))
} 