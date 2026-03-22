/**
 * Morocco-specific sitemap generator for enhanced SEO
 * Includes city pages, product categories, and keyword-optimized URLs
 */

import { DatabaseProduct, DatabaseCategory } from '../services/productApi'
import { getProductUrl } from './productUrls'

interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  alternates?: { hreflang: string; href: string }[]
}

export const generateMoroccoSitemap = async (
  products: DatabaseProduct[],
  categories: DatabaseCategory[]
): Promise<string> => {
  const baseUrl = 'https://setupdream.ma'
  const currentDate = new Date().toISOString().split('T')[0]

  const urls: SitemapUrl[] = []

  // 1. Main pages with high priority and multilingual support
  const mainPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/products', priority: 0.9, changefreq: 'daily' as const },
    { path: '/categories', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/new', priority: 0.8, changefreq: 'daily' as const },
    { path: '/sale', priority: 0.8, changefreq: 'daily' as const },
    { path: '/about', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/returns', priority: 0.5, changefreq: 'monthly' as const },
    { path: '/performance-lab', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/cookie-policy', priority: 0.3, changefreq: 'yearly' as const }
  ]

  mainPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
      alternates: [
        { hreflang: 'fr-MA', href: `${baseUrl}${page.path}?lng=fr` },
        { hreflang: 'en-US', href: `${baseUrl}${page.path}?lng=en` },
        { hreflang: 'x-default', href: `${baseUrl}${page.path}` }
      ]
    })
  })

  // 2. City-specific pages for local SEO (HIGH PRIORITY)
  const cities = [
    { name: 'casablanca', priority: 0.9 },
    { name: 'rabat', priority: 0.9 },
    { name: 'marrakech', priority: 0.9 }
  ]

  cities.forEach(city => {
    urls.push({
      loc: `${baseUrl}/${city.name}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: city.priority,
      alternates: [
        { hreflang: 'fr-MA', href: `${baseUrl}/${city.name}?lng=fr` },
        { hreflang: 'en-US', href: `${baseUrl}/${city.name}?lng=en` },
        { hreflang: 'x-default', href: `${baseUrl}/${city.name}` }
      ]
    })
  })

  // 3. Product pages with structured data
  products.forEach(product => {
    const productUrl = `${baseUrl}${getProductUrl(product)}`
    urls.push({
      loc: productUrl,
      lastmod: currentDate, // Use current date since updated_at may not be available
      changefreq: 'weekly',
      priority: 0.7,
      alternates: [
        { hreflang: 'fr-MA', href: `${productUrl}?lng=fr` },
        { hreflang: 'en-US', href: `${productUrl}?lng=en` },
        { hreflang: 'x-default', href: productUrl }
      ]
    })
  })

  // 4. Category pages
  categories.forEach(category => {
    urls.push({
      loc: `${baseUrl}/products?category=${category.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
      alternates: [
        { hreflang: 'fr-MA', href: `${baseUrl}/products?category=${category.id}&lng=fr` },
        { hreflang: 'en-US', href: `${baseUrl}/products?category=${category.id}&lng=en` },
        { hreflang: 'x-default', href: `${baseUrl}/products?category=${category.id}` }
      ]
    })
  })

  // 5. Popular search term pages for Morocco
  const moroccoSearchTerms = [
    // French terms
    'pc-gamer-maroc',
    'composants-pc-maroc',
    'boutique-gaming-casablanca',
    'setup-gamer-rabat',
    'materiel-informatique-marrakech',
    'ecran-gamer-maroc',
    'clavier-mecanique-maroc',
    'souris-gamer-maroc',
    'carte-graphique-maroc',
    'processeur-amd-maroc',

    // English terms
    'gaming-pc-morocco',
    'pc-components-morocco',
    'gaming-setup-morocco',
    'gaming-gear-morocco',
    'computer-hardware-morocco'
  ]

  moroccoSearchTerms.forEach(term => {
    // Create search result pages for popular terms
    urls.push({
      loc: `${baseUrl}/products?search=${term}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.6
    })
  })

  // 6. Special category pages with Morocco focus
  const specialCategories = [
    { slug: 'pc-gamer-maroc', priority: 0.8 },
    { slug: 'composants-maroc', priority: 0.8 },
    { slug: 'peripheriques-maroc', priority: 0.7 },
    { slug: 'ecrans-gamer-maroc', priority: 0.7 },
    { slug: 'chaises-gamer-maroc', priority: 0.7 },
    { slug: 'cartes-graphiques-maroc', priority: 0.6 }
  ]

  specialCategories.forEach(cat => {
    urls.push({
      loc: `${baseUrl}/categories/${cat.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: cat.priority,
      alternates: [
        { hreflang: 'fr-MA', href: `${baseUrl}/categories/${cat.slug}?lng=fr` },
        { hreflang: 'en-US', href: `${baseUrl}/categories/${cat.slug}?lng=en` },
        { hreflang: 'x-default', href: `${baseUrl}/categories/${cat.slug}` }
      ]
    })
  })

  // Generate XML sitemap
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

  urls.forEach(url => {
    sitemap += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`

    if (url.alternates) {
      url.alternates.forEach(alt => {
        sitemap += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
      })
    }

    sitemap += `
  </url>
`
  })

  sitemap += `</urlset>`
  return sitemap
}

// Generate robots.txt with Morocco-specific sitemaps
export const generateMoroccoRobotsTxt = (): string => {
  const baseUrl = 'https://setupdream.ma'

  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /register

# Priority pages for Morocco SEO
Allow: /casablanca
Allow: /rabat
Allow: /marrakech
Allow: /products
Allow: /categories

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-products.xml
Sitemap: ${baseUrl}/sitemap-cities.xml

# Search engines
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 2

# Social media
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Host specification
Host: ${baseUrl}
`
}

// Generate specific sitemaps for better organization
export const generateProductsSitemap = async (products: DatabaseProduct[]): Promise<string> => {
  const baseUrl = 'https://setupdream.ma'
  const currentDate = new Date().toISOString().split('T')[0]

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

  products.forEach(product => {
    const productUrl = `${baseUrl}${getProductUrl(product)}`
    sitemap += `  <url>
    <loc>${productUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${productUrl}?lng=fr" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${productUrl}?lng=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${productUrl}" />`

    if (product.image_url) {
      sitemap += `
    <image:image>
      <image:loc>${baseUrl}${product.image_url}</image:loc>
      <image:title>${product.name}</image:title>
      <image:caption>Matériel Gaming ${product.name} - SetupDream</image:caption>
    </image:image>`
    }

    sitemap += `
  </url>
`
  })

  sitemap += `</urlset>`
  return sitemap
}

// Generate cities sitemap for local SEO
export const generateCitiesSitemap = (): string => {
  const baseUrl = 'https://setupdream.ma'
  const currentDate = new Date().toISOString().split('T')[0]

  const cities = [
    { name: 'casablanca', title: 'Boutique PC Gamer Casablanca', priority: 0.9 },
    { name: 'rabat', title: 'Matériel Gaming Rabat', priority: 0.9 },
    { name: 'marrakech', title: 'PC Gamer Marrakech', priority: 0.9 }
  ]

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

  cities.forEach(city => {
    sitemap += `  <url>
    <loc>${baseUrl}/${city.name}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${city.priority}</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${baseUrl}/${city.name}?lng=fr" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/${city.name}?lng=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/${city.name}" />
  </url>
`
  })

  sitemap += `</urlset>`
  return sitemap
}

export default {
  generateMoroccoSitemap,
  generateMoroccoRobotsTxt,
  generateProductsSitemap,
  generateCitiesSitemap
}