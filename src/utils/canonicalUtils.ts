/**
 * Canonical URL utilities for proper SEO implementation
 * Fixes Google Search Console duplicate page issues
 */

export const generateCanonicalUrl = (url?: string): string => {
  try {
    const currentUrl = url || window.location.href
    const urlObj = new URL(currentUrl)
    
    // Normalize to preferred domain (www.carresports.ma)
    let canonical = `https://www.carresports.ma${urlObj.pathname}`
    
    // Remove trailing slash except for root
    if (canonical.endsWith('/') && canonical !== 'https://www.carresports.ma/') {
      canonical = canonical.slice(0, -1)
    }
    
    // Clean tracking parameters but keep important query params
    const params = new URLSearchParams(urlObj.search)
    
    // Remove language and tracking parameters
    params.delete('lng')
    params.delete('utm_source')
    params.delete('utm_medium')
    params.delete('utm_campaign')
    params.delete('utm_content')
    params.delete('utm_term')
    params.delete('fbclid')
    params.delete('gclid')
    params.delete('mc_cid')
    params.delete('mc_eid')
    
    // Keep important e-commerce parameters
    // category, subcategory, search, page etc.
    const cleanSearch = params.toString()
    if (cleanSearch) {
      canonical += `?${cleanSearch}`
    }
    
    return canonical
  } catch (error) {
    console.error('Error generating canonical URL:', error)
    // Fallback to clean current URL
    const fallback = (url || window.location.href).split('?')[0].split('#')[0]
    return fallback.endsWith('/') && fallback !== 'https://www.carresports.ma/' 
      ? fallback.slice(0, -1) 
      : fallback
  }
}

export const setCanonicalUrl = (url?: string): void => {
  try {
    const canonicalUrl = generateCanonicalUrl(url)
    
    // Remove existing canonical tag
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }
    
    // Add new canonical tag
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = canonicalUrl
    document.head.appendChild(canonical)
    
    console.log('Canonical URL set:', canonicalUrl)
  } catch (error) {
    console.error('Error setting canonical URL:', error)
  }
}

export const addHreflangTags = (baseUrl?: string): void => {
  try {
    const cleanUrl = generateCanonicalUrl(baseUrl)
    
    // Remove existing hreflang tags
    const existingHreflang = document.querySelectorAll('link[hreflang]')
    existingHreflang.forEach(link => link.remove())
    
    // Add language alternatives
    const languages = [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
      { code: 'x-default', label: 'Default' }
    ]
    
    languages.forEach(({ code }) => {
      const hreflang = document.createElement('link')
      hreflang.rel = 'alternate'
      hreflang.hreflang = code
      
      if (code === 'x-default') {
        hreflang.href = cleanUrl
      } else {
        const separator = cleanUrl.includes('?') ? '&' : '?'
        hreflang.href = `${cleanUrl}${separator}lng=${code}`
      }
      
      document.head.appendChild(hreflang)
    })
  } catch (error) {
    console.error('Error setting hreflang tags:', error)
  }
} 