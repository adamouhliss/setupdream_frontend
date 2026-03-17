export interface CookieCategory {
  id: string
  name: string
  description: string
  essential: boolean
  enabled: boolean
}

export interface CookieConsent {
  hasConsented: boolean
  consentDate: Date | null
  categories: Record<string, boolean>
  version: string
}

export interface CookieSettings {
  strictly_necessary: boolean
  performance: boolean
  functional: boolean
  marketing: boolean
}

export interface ConsentRecord {
  timestamp: Date
  userAgent: string
  ipAddress?: string
  categories: CookieSettings
  version: string
  action: 'accept' | 'reject' | 'customize'
} 