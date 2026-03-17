import { DatabaseProduct, DatabaseCategory } from '../services/productApi'
import { getProductUrl } from './productUrls'

// SEO utility functions for better search engine optimization

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export interface BreadcrumbItem {
  "@type": "ListItem"
  position: number
  name: string
  item?: string
}

// Helper to escape XML special characters
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

// Generate XML string with escaping
export const generateSitemapXml = (urls: SitemapUrl[]): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`
}

// Generate XML sitemap content
export const generateSitemap = async (
  products: DatabaseProduct[],
  categories: DatabaseCategory[]
): Promise<string> => {
  const baseUrl = window.location.origin
  const currentDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  const urls: SitemapUrl[] = [
    // Static pages
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/new-arrivals`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/sale`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/performance-lab`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    }
  ]

  // Add category pages
  categories.forEach(category => {
    urls.push({
      loc: `${baseUrl}/products?category=${category.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    })

    // Add subcategory pages if they exist
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        urls.push({
          loc: `${baseUrl}/products?category=${category.id}&subcategory=${subcategory.id}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.6
        })
      })
    }
  })

  // Add product pages
  products.forEach(product => {
    urls.push({
      loc: `${baseUrl}${getProductUrl(product)}`,
      lastmod: product.created_at.split('T')[0],
      changefreq: 'weekly',
      priority: product.is_featured ? 0.8 : 0.7
    })
  })



  return generateSitemapXml(urls)
}

// Generate breadcrumb structured data
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url?: string }>): object => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": item.url })
    }))
  }
}

// Generate product structured data
export const generateProductSchema = (product: DatabaseProduct): object => {
  const baseUrl = window.location.origin

  const baseOffer = {
    "@type": "Offer",
    "url": `${baseUrl}${getProductUrl(product)}`,
    "priceCurrency": "MAD",
    "price": product.sale_price || product.price,
    "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Carré Sport",
      "url": baseUrl
    }
  }

  let offers: any = baseOffer

  if (product.variants && product.variants.length > 0) {
    const activeVariants = product.variants.filter(v => v.is_active)
    if (activeVariants.length > 0) {
      offers = activeVariants.map(variant => {
        const variantPrice = variant.price_override ?? product.sale_price ?? product.price
        const effectiveStock = variant.stock_quantity - (variant.reserved_quantity || 0)
        return {
          ...baseOffer,
          "sku": variant.sku || product.sku,
          "price": variantPrice,
          "availability": effectiveStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemOffered": {
            "@type": "Product",
            "name": `${product.name} - ${variant.size || ''} ${variant.color || ''}`.trim(),
            "color": variant.color,
            "size": variant.size
          }
        }
      })
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url ? `${baseUrl}${product.image_url}` : undefined,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Carré Sport"
    },
    "category": product.category?.name,
    "offers": offers
  }
}

// Generate organization structured data
export const generateOrganizationSchema = (): object => {
  const baseUrl = window.location.origin

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Carré Sport",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/logo.png`,
      "width": 300,
      "height": 100
    },
    "description": "Leading sports equipment retailer in Morocco offering premium sports gear, fitness equipment, and athletic wear.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MA",
      "addressLocality": "Casablanca",
      "addressRegion": "Grand Casablanca"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-632-253960",
      "contactType": "Customer Service",
      "availableLanguage": ["French", "English", "Arabic"]
    },
    "sameAs": [
      "https://www.facebook.com/CarreSportMaroc",
      "https://www.instagram.com/carresport_maroc",
      "https://twitter.com/CarreSportMA"
    ]
  }
}

// Generate website structured data
export const generateWebSiteSchema = (): object => {
  const baseUrl = window.location.origin

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "Carré Sport",
    "url": baseUrl,
    "description": "Premium sports equipment and gear in Morocco",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

// Generate local business structured data for physical stores
export const generateLocalBusinessSchema = (): object => {
  const baseUrl = window.location.origin

  return {
    "@context": "https://schema.org",
    "@type": "SportsGoodsStore",
    "@id": `${baseUrl}/#localbusiness`,
    "name": "Carré Sport",
    "image": `${baseUrl}/images/store-front.jpg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Sport Street",
      "addressLocality": "Casablanca",
      "addressRegion": "Grand Casablanca",
      "postalCode": "20000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.5731,
      "longitude": -7.5898
    },
    "url": baseUrl,
    "telephone": "+212-632-253960",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "17:00"
      }
    ]
  }
}

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  const baseUrl = window.location.origin

  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /cart/
Disallow: /account/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1`
}

// SEO-friendly URL slug generator
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Generate meta description from product description
export const generateMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) {
    return description
  }

  // Find the last complete sentence within the limit
  const truncated = description.substring(0, maxLength)
  const lastSentence = truncated.lastIndexOf('.')

  if (lastSentence > maxLength - 50) {
    return truncated.substring(0, lastSentence + 1)
  }

  // If no good sentence break, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace) + '...'
}

// Download sitemap as file
export const downloadSitemap = (sitemapContent: string): void => {
  const blob = new Blob([sitemapContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'sitemap.xml'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Download robots.txt as file
export const downloadRobotsTxt = (robotsContent: string): void => {
  const blob = new Blob([robotsContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'robots.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
} 