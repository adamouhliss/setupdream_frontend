import { useEffect } from 'react'
import { useStoreSettingsStore } from '../store/storeSettingsStore'
import { getImageUrl } from '../utils/imageUrl'

export default function DynamicFavicon() {
  const { settings, fetchSettings } = useStoreSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    const updateFavicon = () => {
      // Get the favicon URL first (optimized for browsers), then fallback to logo URL
      const faviconUrl = settings?.store_favicon_url
      const logoUrl = settings?.store_logo_url
      
      if (faviconUrl) {
        // Use the optimized favicon version
        const fullFaviconUrl = getImageUrl(faviconUrl)
        updateFaviconLinks(fullFaviconUrl)
      } else if (logoUrl) {
        // Fallback to logo URL
        const fullLogoUrl = getImageUrl(logoUrl)
        updateFaviconLinks(fullLogoUrl)
      } else {
        // Fallback to default favicon
        updateFaviconLinks('/favicon.svg')
      }
    }

    updateFavicon()
  }, [settings?.store_favicon_url, settings?.store_logo_url])

  const updateFaviconLinks = (iconUrl: string) => {
    // Get all existing favicon links
    const faviconLinks = [
      { rel: 'icon', type: 'image/svg+xml' },
      { rel: 'alternate icon', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', type: 'image/png' },
      { rel: 'shortcut icon', type: 'image/x-icon' }
    ]

    faviconLinks.forEach(({ rel, type }) => {
      // Remove existing favicon links of this type
      const existing = document.querySelector(`link[rel="${rel}"]`)
      if (existing) {
        existing.remove()
      }

      // Create new favicon link
      const link = document.createElement('link')
      link.rel = rel
      link.type = type
      link.href = iconUrl
      
      // Add to document head
      document.head.appendChild(link)
    })

    // Also update any generic 'icon' links
    const genericIcon = document.querySelector('link[rel="icon"]:not([type])')
    if (genericIcon) {
      genericIcon.setAttribute('href', iconUrl)
    } else {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = iconUrl
      document.head.appendChild(link)
    }

    // Force browser to refresh favicon by adding a timestamp
    const timestamp = new Date().getTime()
    const finalUrl = iconUrl.includes('?') 
      ? `${iconUrl}&t=${timestamp}`
      : `${iconUrl}?t=${timestamp}`

    // Update the primary favicon with timestamp to force refresh
    const primaryFavicon = document.querySelector('link[rel="icon"]')
    if (primaryFavicon) {
      primaryFavicon.setAttribute('href', finalUrl)
    }
  }

  // This component doesn't render anything visible
  return null
} 