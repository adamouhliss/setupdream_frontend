import { create } from 'zustand'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://projects-backend.mlqyyh.easypanel.host/api/v1'  // Production

interface StoreSettings {
  store_name: string
  store_description: string
  store_logo_url?: string
  store_favicon_url?: string
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

interface StoreSettingsState {
  settings: StoreSettings
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  refreshSettings: () => Promise<void>
}

const defaultSettings: StoreSettings = {
  store_name: 'SetupDream',
  store_description: 'Votre Setup de Rêve',
  store_address: 'Casablanca, Morocco',
  store_phone: '+212 522-123456',
  store_email: 'info@setupdream.ma',
  currency: 'MAD',
  timezone: 'Africa/Casablanca',
  language: 'fr',
  tax_rate: 20.0,
  shipping_cost: 50.0,
  free_shipping_threshold: 500.0,
  
  // Social Media URLs
  facebook_url: undefined,
  instagram_url: undefined,
  twitter_url: undefined,
  youtube_url: undefined,
  tiktok_url: undefined,
  linkedin_url: undefined
}

export const useStoreSettingsStore = create<StoreSettingsState>((set, get) => ({
  settings: defaultSettings,
  loading: false,
  error: null,

  fetchSettings: async () => {
    // Only fetch if we haven't loaded settings yet
    const currentSettings = get().settings
    if (currentSettings !== defaultSettings && !get().loading) {
      return
    }

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_BASE_URL}/settings/store/public`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch store settings')
      }
      
      const settings = await response.json()
      set({ settings, loading: false })
    } catch (error) {
      console.error('Failed to fetch store settings:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch store settings',
        loading: false 
      })
    }
  },

  refreshSettings: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_BASE_URL}/settings/store/public`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch store settings')
      }
      
      const settings = await response.json()
      set({ settings, loading: false })
    } catch (error) {
      console.error('Failed to refresh store settings:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh store settings',
        loading: false 
      })
    }
  }
})) 