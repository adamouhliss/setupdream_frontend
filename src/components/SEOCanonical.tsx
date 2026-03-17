import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SEOCanonicalProps {
  canonicalUrl?: string
  title?: string
  description?: string
  pageType?: 'contact' | 'register' | 'categories' | 'products' | 'home'
}

export default function SEOCanonical({ 
  canonicalUrl, 
  title, 
  description, 
  pageType 
}: SEOCanonicalProps) {
  const { i18n } = useTranslation()

  useEffect(() => {
    try {
      // Generate proper canonical URL
      let canonical = canonicalUrl
      if (!canonical) {
        const path = window.location.pathname
        canonical = `https://www.carresports.ma${path === '/' ? '' : path}`
        
        // Remove trailing slash except for root
        if (canonical.endsWith('/') && canonical !== 'https://www.carresports.ma/') {
          canonical = canonical.slice(0, -1)
        }
      }

      // Remove existing canonical tag
      const existingCanonical = document.querySelector('link[rel="canonical"]')
      if (existingCanonical) {
        existingCanonical.remove()
      }

      // Add new canonical tag
      const canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      canonicalLink.href = canonical
      document.head.appendChild(canonicalLink)

      // Set page title if provided
      if (title) {
        document.title = title
      }

      // Set meta description if provided
      if (description) {
        let metaDesc = document.querySelector('meta[name="description"]')
        if (!metaDesc) {
          metaDesc = document.createElement('meta')
          metaDesc.setAttribute('name', 'description')
          document.head.appendChild(metaDesc)
        }
        metaDesc.setAttribute('content', description)
      }

      // Add language alternates (hreflang)
      const existingHreflang = document.querySelectorAll('link[hreflang]')
      existingHreflang.forEach(link => link.remove())

      const languages = ['fr', 'en', 'x-default']
      languages.forEach(lang => {
        const hreflang = document.createElement('link')
        hreflang.rel = 'alternate'
        hreflang.hreflang = lang
        
        if (lang === 'x-default') {
          hreflang.href = canonical
        } else {
          hreflang.href = `${canonical}?lng=${lang}`
        }
        
        document.head.appendChild(hreflang)
      })

      // Set robots meta tag
      let robotsMeta = document.querySelector('meta[name="robots"]')
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', 'index, follow')

      console.log(`✅ SEO Canonical set for ${pageType}: ${canonical}`)
      
    } catch (error) {
      console.error('Error setting canonical URL:', error)
    }
  }, [canonicalUrl, title, description, pageType, i18n.language])

  return null // This component doesn't render anything
} 