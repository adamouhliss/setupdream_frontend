import { useEffect } from 'react'
import { useStoreSettingsStore } from '../store/storeSettingsStore'
import { getImageUrl } from '../utils/imageUrl'

export default function OrganizationSchema() {
  const { settings, fetchSettings } = useStoreSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    // Only add Organization schema if we have store settings
    if (!settings) return

    // Remove existing organization schema
    const existingSchema = document.querySelector('script[data-organization-schema="true"]')
    if (existingSchema) {
      existingSchema.remove()
    }

    const baseUrl = window.location.origin
    
    // Get logo URL - use uploaded logo if available, otherwise use favicon, then fallback
    let logoUrl = '/favicon.svg' // Default fallback
    let logoWidth = 512
    let logoHeight = 512

    if (settings.store_logo_url) {
      // Use the uploaded store logo (already optimized)
      logoUrl = getImageUrl(settings.store_logo_url)
      logoWidth = 400  // Max width from image service
      logoHeight = 200 // Max height from image service
    } else if (settings.store_favicon_url) {
      // Use favicon if no logo available
      logoUrl = getImageUrl(settings.store_favicon_url)
      logoWidth = 32
      logoHeight = 32
    }

    // Ensure it's a full URL for Google
    if (!logoUrl.startsWith('http')) {
      logoUrl = `${baseUrl}${logoUrl}`
    }

    // Create comprehensive Organization schema for Google
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": settings.store_name || "SetupDream",
      "alternateName": "SetupDream Morocco",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": logoUrl,
        "width": logoWidth,
        "height": logoHeight,
        "contentUrl": logoUrl
      },
      "image": logoUrl, // Google often uses this field for logos
      "description": settings.store_description || "PC Gamer et Setups sur Mesure - Paiement à la livraison",
      "foundingDate": "2020",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MA",
        "addressRegion": "Grand Casablanca",
        "addressLocality": "Morocco",
        "streetAddress": settings.store_address || "Casablanca, Morocco"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": settings.store_phone || "+212 522-123456",
          "contactType": "Customer Service",
          "availableLanguage": ["French", "English", "Arabic"],
          "areaServed": "MA"
        },
        {
          "@type": "ContactPoint",
          "email": settings.store_email || "info@setupdream.ma",
          "contactType": "Customer Support"
        }
      ],
      "sameAs": [
        settings.facebook_url,
        settings.instagram_url,
        settings.twitter_url,
        settings.youtube_url,
        settings.linkedin_url
      ].filter(Boolean), // Remove undefined/null URLs
      "founder": {
        "@type": "Person",
        "name": "SetupDream Team"
      },
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": "10-50"
      },
      "knowsAbout": [
        "PC Gamer",
        "Hardware PC", 
        "Composants Informatiques",
        "Périphériques Gaming",
        "Setups Sur Mesure",
        "Morocco Tech Retail"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Morocco"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Gaming Equipment Catalog",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "PC Gamer"
          },
          {
            "@type": "OfferCatalog", 
            "name": "Composants PC"
          },
          {
            "@type": "OfferCatalog",
            "name": "Périphériques Gaming" 
          }
        ]
      },
      "brand": {
        "@type": "Brand",
        "name": settings.store_name || "SetupDream",
        "logo": logoUrl
      },
      "slogan": "Setups PC sur Mesure - Paiement à la livraison"
    }

    // Create and add the script tag
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-organization-schema', 'true')
    script.textContent = JSON.stringify(organizationSchema, null, 0)
    document.head.appendChild(script)

    // Debug: Log the schema for verification
    console.log('🏢 Organization Schema Added:', {
      logoUrl,
      logoWidth,
      logoHeight,
      organizationName: settings.store_name
    })

  }, [settings])

  // This component doesn't render anything visible
  return null
} 