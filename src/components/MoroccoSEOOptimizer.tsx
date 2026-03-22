import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSEO } from '../hooks/useSEO'
import { generateMoroccoSEO } from '../utils/moroccoSEO'

interface MoroccoSEOOptimizerProps {
  pageType?: 'home' | 'products' | 'product' | 'category' | 'city'
  productName?: string
  categoryName?: string
  cityName?: string
  price?: number
  customTitle?: string
  customDescription?: string
}

export default function MoroccoSEOOptimizer({
  pageType = 'home',
  productName,
  categoryName,
  cityName,
  price,
  customTitle,
  customDescription
}: MoroccoSEOOptimizerProps) {
  
  const { i18n } = useTranslation()
  const language = (i18n.language || i18n.resolvedLanguage || 'fr') as 'fr' | 'en'

  // Generate Morocco-specific SEO data using the comprehensive moroccoSEO.ts
  let moroccoSEO
  try {
    moroccoSEO = generateMoroccoSEO(pageType, language, {
      productName,
      categoryName, 
      cityName,
      price
    })
  } catch (error) {
    console.warn('Error generating Morocco SEO, using fallback:', error)
    // Fallback SEO data if generation fails
    moroccoSEO = {
      title: language === 'fr' 
        ? "SetupDream - PC Gamer et Setups Premium au Maroc"
        : "SetupDream - Premium Gaming PCs in Morocco",
      description: language === 'fr'
        ? "🏆 N°1 du PC Gamer au Maroc ! Livraison gratuite dès 500 MAD."
        : "🏆 #1 Gaming PC Store in Morocco! Free shipping from 500 MAD.",
      keywords: language === 'fr'
        ? "pc gamer maroc, composants pc maroc, setup gamer maroc"
        : "gaming pc morocco, pc components morocco, gaming setup morocco"
    }
  }

  // Prepare final SEO configuration
  const seoData = {
    title: customTitle || moroccoSEO.title,
    description: customDescription || moroccoSEO.description,
    keywords: moroccoSEO.keywords,
    // Only include structured data for home page to avoid complexity issues
    ...(pageType === 'home' && moroccoSEO.structuredData && {
      structuredData: moroccoSEO.structuredData
    }),
    type: (pageType === 'product' ? 'product' : 
          pageType === 'city' ? 'local_business' : 
          'website') as 'product' | 'local_business' | 'website',
    ...(price && { price, currency: 'MAD' })
  }

  // Apply SEO using the comprehensive Morocco configuration
  useSEO(seoData)

  // Add Morocco-specific meta tags
  useEffect(() => {
    try {
      addMoroccoMetaTags(language)
    } catch (error) {
      console.warn('Error adding Morocco meta tags:', error)
    }
  }, [language])

  return null
}

// Add Morocco-specific meta tags (simplified version)
const addMoroccoMetaTags = (language: 'fr' | 'en') => {
  // Remove existing Morocco meta tags first
  const existingMetas = document.querySelectorAll('meta[data-morocco-seo="true"]')
  existingMetas.forEach(meta => meta.remove())

  const metaTags = [
    // Geographic targeting for Morocco
    { name: 'geo.region', content: 'MA' },
    { name: 'geo.country', content: 'Morocco' },
    { name: 'geo.placename', content: 'Morocco' },
    { name: 'ICBM', content: '33.5731, -7.5898' },
    
    // Language and locale for Morocco
    { property: 'og:locale', content: language === 'fr' ? 'fr_MA' : 'en_US' },
    { property: 'og:locale:alternate', content: language === 'fr' ? 'en_US' : 'fr_MA' },
    
    // Business information
    { name: 'business:contact_data:country_name', content: 'Morocco' },
    { name: 'business:contact_data:region', content: 'Grand Casablanca' },
    { name: 'business:contact_data:phone_number', content: '+212632253960' },
    
    // E-commerce specifics
    { name: 'product-type', content: 'gaming equipment' },
    { name: 'price-currency', content: 'MAD' },
    { name: 'delivery-area', content: 'Morocco, Casablanca, Rabat, Marrakech' }
  ]

  // Add new meta tags
  metaTags.forEach(tag => {
    try {
      const meta = document.createElement('meta')
      meta.setAttribute('data-morocco-seo', 'true')
      
      if ('name' in tag && tag.name) {
        meta.setAttribute('name', tag.name)
      } else if ('property' in tag && tag.property) {
        meta.setAttribute('property', tag.property)
      }
      
      meta.setAttribute('content', tag.content)
      document.head.appendChild(meta)
    } catch (error) {
      console.warn('Error adding meta tag:', tag, error)
    }
  })
} 