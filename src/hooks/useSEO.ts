import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article' | 'organization' | 'local_business'
  price?: number
  currency?: string
  availability?: 'in_stock' | 'out_of_stock' | 'limited_stock'
  brand?: string
  category?: string
  structuredData?: object | null
  canonical?: string
  noindex?: boolean
}
// Helper to safely add/replace query param
const resultUrlWithParam = (url: string, key: string, value: string) => {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set(key, value)
    return urlObj.toString()
  } catch (e) {
    // Fallback for relative URLs or errors
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${key}=${value}`
  }
}

export const useSEO = (seoData: SEOData) => {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || 'fr'

  useEffect(() => {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      price,
      currency = 'MAD',
      availability,
      brand,
      structuredData,
      canonical,
      noindex = false
    } = seoData

    // Base domain
    const baseUrl = window.location.origin
    const currentUrl = url || window.location.href
    const canonicalUrl = canonical || currentUrl.split('?')[0] // Default to current URL without params if not provided

    // French-first meta content
    const defaultTitle = currentLanguage === 'fr'
      ? 'SetupDream - Setups PC au Maroc | Casablanca'
      : 'SetupDream - Gaming PCs in Morocco | Casablanca'

    const defaultDescription = currentLanguage === 'fr'
      ? 'Découvrez notre collection d\'équipements sportifs au Maroc. Matériel de sport professionnel, paiement à la livraison. Livraison gratuite dès 500 MAD. ⭐ N°1 des équipements sportifs au Maroc.'
      : 'Discover our sports equipment collection in Morocco. Professional sports gear, cash on delivery available. Free shipping from 500 MAD. ⭐ #1 Sports Equipment in Morocco.'

    const defaultKeywords = currentLanguage === 'fr'
      ? 'équipements sportifs maroc, matériel sport casablanca, fitness maroc, musculation rabat, paiement à la livraison, livraison gratuite, matériel gym, accessoires sport, équipement fitness professionnel'
      : 'sports equipment morocco, fitness gear casablanca, gym equipment rabat, athletic wear morocco, cash on delivery, free shipping, professional fitness equipment, sports accessories morocco'

    // CRITICAL: Update HTML lang attribute dynamically
    document.documentElement.lang = currentLanguage
    document.documentElement.dir = i18n.dir(currentLanguage)

    // Set document title
    document.title = title || defaultTitle

    // Remove existing SEO meta tags and links
    const existingMetas = document.querySelectorAll('meta[data-seo="true"], link[data-seo="true"]')
    existingMetas.forEach(el => el.remove())

    // Create meta tags array
    const metaTags: Array<Record<string, any>> = [
      // MOST IMPORTANT: Meta description
      { name: 'description', content: description || defaultDescription },
      { name: 'keywords', content: keywords || defaultKeywords },
      { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'language', content: currentLanguage },
      { name: 'author', content: 'SetupDream' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },

      // Geographic SEO
      { name: 'geo.region', content: 'MA' },
      { name: 'geo.country', content: 'Morocco' },

      // Open Graph tags
      { property: 'og:title', content: title || defaultTitle },
      { property: 'og:description', content: description || defaultDescription },
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl },
      { property: 'og:site_name', content: 'SetupDream' },
      { property: 'og:locale', content: currentLanguage === 'fr' ? 'fr_MA' : 'en_US' },

      // Pinterest / Rich Pin Specific Tags
      ...(type === 'product' && price ? [
        { property: 'product:price:amount', content: price.toString() },
        { property: 'product:price:currency', content: currency },
        { property: 'product:availability', content: availability || 'in_stock' },
        brand ? { property: 'product:brand', content: brand } : null,
      ].filter(Boolean) as any[] : []),

      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title || defaultTitle },
      { name: 'twitter:description', content: description || defaultDescription },

      // Additional SEO tags
      { name: 'theme-color', content: '#F59E0B' },
      { name: 'country', content: 'Morocco' },
    ]

    // Alternate locale for OG
    if (currentLanguage === 'fr') {
      metaTags.push({ property: 'og:locale:alternate', content: 'en_US' })
    } else {
      metaTags.push({ property: 'og:locale:alternate', content: 'fr_MA' })
    }

    // Add image meta tags if provided
    if (image) {
      const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`
      metaTags.push(
        { property: 'og:image', content: fullImageUrl },
        { property: 'og:image:alt', content: title || 'SetupDream - Premium Gaming' },
        { name: 'twitter:image', content: fullImageUrl }
      )
    }

    // Add product-specific meta tags
    if (type === 'product' && price) {
      metaTags.push(
        { property: 'product:price:amount', content: price.toString() },
        { tag: 'meta', property: 'product:price:amount', content: price.toString() },
        { tag: 'meta', property: 'product:price:currency', content: currency },
        { tag: 'meta', property: 'product:availability', content: availability || 'in_stock' }
      )
    }

    // Hreflang Tags
    // 1. French (Default)
    metaTags.push({ tag: 'link', rel: 'alternate', hreflang: 'fr', href: canonicalUrl })

    // 2. English
    const enUrl = resultUrlWithParam(canonicalUrl, 'lng', 'en')
    metaTags.push({ tag: 'link', rel: 'alternate', hreflang: 'en', href: enUrl })

    // 3. x-default (Fallback - usually same as default language)
    metaTags.push({ tag: 'link', rel: 'alternate', hreflang: 'x-default', href: canonicalUrl })

    // Structured Data
    if (structuredData) {
      metaTags.push({ tag: 'script', type: 'application/ld+json', innerHTML: JSON.stringify(structuredData) })
    }

    // Insert all meta tags, link tags, and script tags into the document head
    metaTags.forEach(tagInfo => {
      if (tagInfo.tag === 'script') {
        const script = document.createElement('script')
        script.type = tagInfo.type!
        script.innerHTML = tagInfo.innerHTML!
        script.setAttribute('data-seo', 'true')
        document.head.appendChild(script)
      } else if (tagInfo.tag === 'link') {
        const link = document.createElement('link')
        link.rel = tagInfo.rel!
        link.href = tagInfo.href!
        if (tagInfo.hreflang) link.hreflang = tagInfo.hreflang
        link.setAttribute('data-seo', 'true')
        document.head.appendChild(link)
      } else { // Default to meta tag
        const meta = document.createElement('meta')
        Object.entries(tagInfo).forEach(([key, value]) => {
          if (key !== 'tag' && value) meta.setAttribute(key, value)
        })
        meta.setAttribute('data-seo', 'true')
        document.head.appendChild(meta)
      }
    })

    // Clean up function
    return () => {
      const dynamicTags = document.querySelectorAll('[data-seo="true"]')
      dynamicTags.forEach(tag => tag.remove())
    }

  }, [seoData, currentLanguage, i18n])
}
