/**
 * Morocco-specific SEO configuration for Google Search optimization
 * Targeting French and English keywords with local search intent
 */

export interface MoroccoSEOConfig {
  title: string
  description: string
  keywords: string
  structuredData?: any
  alternateUrls?: { [lang: string]: string }
}

// High-traffic French keywords for Morocco
export const MOROCCO_FRENCH_KEYWORDS = {
  primary: [
    "équipement sport maroc",
    "matériel sport maroc", 
    "équipement sportif maroc",
    "magasin sport casablanca",
    "matériel fitness rabat",
    "équipement gym marrakech"
  ],
  secondary: [
    "vente matériel sport maroc",
    "accessoires sport maroc", 
    "chaussures sport maroc",
    "vêtements fitness maroc",
    "matériel musculation casablanca",
    "équipement crossfit maroc"
  ],
  longTail: [
    "où acheter équipement sport maroc",
    "meilleur magasin sport casablanca",
    "équipement fitness pas cher maroc",
    "matériel sport livraison maroc",
    "magasin sport en ligne maroc",
    "équipement gym professionnel maroc"
  ],
  cities: {
    casablanca: ["sport casablanca", "fitness casablanca", "gym casablanca", "musculation casablanca"],
    rabat: ["sport rabat", "fitness rabat", "équipement sport rabat", "magasin sport rabat"],
    marrakech: ["sport marrakech", "fitness marrakech", "gym marrakech", "équipement sport marrakech"],
    fes: ["sport fes", "fitness fes", "équipement sport fes"],
    agadir: ["sport agadir", "fitness agadir", "surf equipment agadir"],
    tanger: ["sport tanger", "fitness tanger", "équipement sport tanger"]
  }
}

// High-traffic English keywords for Morocco
export const MOROCCO_ENGLISH_KEYWORDS = {
  primary: [
    "sports equipment morocco",
    "fitness equipment morocco",
    "gym equipment morocco", 
    "sports gear morocco",
    "athletic equipment morocco",
    "workout equipment morocco"
  ],
  secondary: [
    "sports shop morocco",
    "fitness store morocco",
    "gym gear morocco",
    "athletic wear morocco",
    "sports accessories morocco",
    "exercise equipment morocco"
  ],
  longTail: [
    "where to buy sports equipment morocco",
    "best sports store casablanca",
    "fitness equipment shop rabat",
    "gym equipment store marrakech",
    "sports gear delivery morocco",
    "online sports shop morocco"
  ],
  cities: {
    casablanca: ["sports casablanca", "fitness casablanca", "gym casablanca", "athletic gear casablanca"],
    rabat: ["sports rabat", "fitness rabat", "gym equipment rabat", "sports store rabat"],
    marrakech: ["sports marrakech", "fitness marrakech", "gym marrakech", "athletic equipment marrakech"],
    agadir: ["sports agadir", "surf equipment agadir", "water sports agadir"],
    tanger: ["sports tangier", "fitness tangier", "gym equipment tangier"]
  }
}

// Generate comprehensive SEO configuration
export const generateMoroccoSEO = (
  pageType: 'home' | 'products' | 'product' | 'category' | 'city',
  language: 'fr' | 'en',
  params?: {
    productName?: string
    categoryName?: string
    cityName?: string
    price?: number
  }
): MoroccoSEOConfig => {
  
  if (language === 'fr') {
    switch (pageType) {
      case 'home':
        return {
          title: "Carré Sport - Équipements Sportifs Premium au Maroc | Matériel Sport Casablanca, Rabat, Marrakech",
          description: "🏆 N°1 des équipements sportifs au Maroc ! Matériel fitness, musculation, running. Magasins à Casablanca, Rabat, Marrakech. Livraison gratuite dès 500 MAD. ⚡ Satisfait ou remboursé.",
          keywords: [
            ...MOROCCO_FRENCH_KEYWORDS.primary,
            ...MOROCCO_FRENCH_KEYWORDS.secondary,
            "tapis yoga maroc", "haltères maroc", "vélo elliptique maroc", "tapis roulant maroc", "banc musculation maroc"
          ].join(", "),
          structuredData: generateLocalBusinessSchema('fr')
        }
        
      case 'products':
        return {
          title: "Équipements Sportifs & Matériel de Sport au Maroc | Carré Sport - Casablanca, Rabat",
          description: "🔥 Plus de 1000 produits ! Équipements fitness, musculation, cardio, sports collectifs. Prix imbattables au Maroc. Expédition 24h Casablanca-Rabat. Paiement à la livraison disponible.",
          keywords: [
            "équipement sport maroc pas cher",
            "matériel gym occasion maroc", 
            "vente équipement fitness casablanca",
            "magasin sport rabat",
            "matériel musculation marrakech",
            ...MOROCCO_FRENCH_KEYWORDS.longTail
          ].join(", ")
        }
        
      case 'product':
        const productName = params?.productName || 'Équipement'
        const price = params?.price ? ` - ${params.price} MAD` : ''
        return {
          title: `${productName} | Équipement Sport Maroc - Carré Sport Casablanca${price}`,
          description: `✅ ${productName} en stock au Maroc ! Livraison rapide Casablanca, Rabat, Marrakech. Prix compétitif, garantie 2 ans. Paiement sécurisé. Conseils d'experts gratuits.`,
          keywords: [
            `${productName.toLowerCase()} maroc`,
            `${productName.toLowerCase()} casablanca`,
            `${productName.toLowerCase()} rabat`,
            `achat ${productName.toLowerCase()} maroc`,
            `prix ${productName.toLowerCase()} maroc`,
            "livraison gratuite maroc"
          ].join(", ")
        }
        
      case 'city':
        const cityName = params?.cityName || 'Morocco'
        const cityKeywords = MOROCCO_FRENCH_KEYWORDS.cities[cityName.toLowerCase() as keyof typeof MOROCCO_FRENCH_KEYWORDS.cities] || []
        return {
          title: `Magasin Sport ${cityName} | Carré Sport - Équipements Fitness ${cityName}`,
          description: `🏪 Magasin sport ${cityName} chez Carré Sport ! Showroom, parking gratuit. Essayage, conseil personnalisé. Ouvert 7j/7. Livraison le jour même possible.`,
          keywords: [
            `magasin sport ${cityName.toLowerCase()}`,
            `équipement fitness ${cityName.toLowerCase()}`,
            `matériel gym ${cityName.toLowerCase()}`,
            ...cityKeywords
          ].join(", ")
        }
        
      default:
        return generateDefaultSEO('fr')
    }
  } else {
    // English SEO
    switch (pageType) {
      case 'home':
        return {
          title: "Carré Sport - Premium Sports Equipment in Morocco | Fitness Gear Casablanca, Rabat, Marrakech",
          description: "🏆 #1 Sports Equipment Store in Morocco! Fitness, gym, running gear. Stores in Casablanca, Rabat, Marrakech. Free shipping from 500 MAD. ⚡ Satisfaction guaranteed.",
          keywords: [
            ...MOROCCO_ENGLISH_KEYWORDS.primary,
            ...MOROCCO_ENGLISH_KEYWORDS.secondary,
            "yoga mats morocco", "dumbbells morocco", "elliptical bike morocco", "treadmill morocco", "weight bench morocco"
          ].join(", "),
          structuredData: generateLocalBusinessSchema('en')
        }
        
      case 'products':
        return {
          title: "Sports Equipment & Fitness Gear in Morocco | Carré Sport - Casablanca, Rabat",
          description: "🔥 1000+ Products! Fitness, gym, cardio, team sports equipment. Best prices in Morocco. 24h shipping Casablanca-Rabat. Cash on delivery available.",
          keywords: [
            "cheap sports equipment morocco",
            "used gym equipment morocco",
            "fitness equipment sale casablanca", 
            "sports store rabat",
            "gym equipment marrakech",
            ...MOROCCO_ENGLISH_KEYWORDS.longTail
          ].join(", ")
        }
        
      case 'product':
        const productName = params?.productName || 'Equipment'
        const price = params?.price ? ` - ${params.price} MAD` : ''
        return {
          title: `${productName} | Sports Equipment Morocco - Carré Sport Casablanca${price}`,
          description: `✅ ${productName} in stock in Morocco! Fast delivery Casablanca, Rabat, Marrakech. Competitive price, 2-year warranty. Secure payment. Free expert advice.`,
          keywords: [
            `${productName.toLowerCase()} morocco`,
            `${productName.toLowerCase()} casablanca`,
            `${productName.toLowerCase()} rabat`,
            `buy ${productName.toLowerCase()} morocco`,
            `${productName.toLowerCase()} price morocco`,
            "free shipping morocco"
          ].join(", ")
        }
        
      case 'city':
        const cityName = params?.cityName || 'Morocco'
        const cityKeywords = MOROCCO_ENGLISH_KEYWORDS.cities[cityName.toLowerCase() as keyof typeof MOROCCO_ENGLISH_KEYWORDS.cities] || []
        return {
          title: `Sports Store ${cityName} | Carré Sport - Fitness Equipment ${cityName}`,
          description: `🏪 Sports store ${cityName} at Carré Sport! Showroom, free parking. Try before buying, personal advice. Open 7 days. Same-day delivery available.`,
          keywords: [
            `sports store ${cityName.toLowerCase()}`,
            `fitness equipment ${cityName.toLowerCase()}`,
            `gym equipment ${cityName.toLowerCase()}`,
            ...cityKeywords
          ].join(", ")
        }
        
      default:
        return generateDefaultSEO('en')
    }
  }
}

// Generate Local Business Structured Data
const generateLocalBusinessSchema = (language: 'fr' | 'en') => {
  let baseUrl = 'https://www.carresports.ma'
  try {
    if (typeof window !== 'undefined' && window.location) {
      baseUrl = window.location.origin
    }
  } catch (error) {
    // Fallback to default URL if window access fails
    console.warn('Could not access window.location, using default URL')
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    "name": "Carré Sport",
    "image": `${baseUrl}/images/logo-carresport.png`,
    "description": language === 'fr' 
      ? "Leader des équipements sportifs au Maroc. Magasins à Casablanca, Rabat, Marrakech. Plus de 10,000 clients satisfaits."
      : "Leading sports equipment retailer in Morocco. Stores in Casablanca, Rabat, Marrakech. Over 10,000 satisfied customers.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MA",
      "addressRegion": "Grand Casablanca",
      "addressLocality": "Casablanca"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.5731,
      "longitude": -7.5898
    },
    "url": baseUrl,
    "telephone": "+212632253960",
    "email": "contact@carresports.ma",
    "priceRange": "$$",
    "currenciesAccepted": "MAD",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "openingHours": "Mo-Su 09:00-20:00",
    "servesCuisine": null,
    "acceptsReservations": false,
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": 4.8,
      "reviewCount": 247
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Casablanca"
      },
      {
        "@type": "City", 
        "name": "Rabat"
      },
      {
        "@type": "City",
        "name": "Marrakech"
      },
      {
        "@type": "Country",
        "name": "Morocco"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": language === 'fr' ? "Équipements Sportifs" : "Sports Equipment",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": language === 'fr' ? "Fitness & Musculation" : "Fitness & Gym",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": language === 'fr' ? "Haltères" : "Dumbbells"
              }
            }
          ]
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/CarreSportMaroc",
      "https://www.instagram.com/carresport_maroc",
      "https://twitter.com/CarreSportMA"
    ]
  }
}

const generateDefaultSEO = (language: 'fr' | 'en'): MoroccoSEOConfig => {
  return {
    title: language === 'fr' 
      ? "Carré Sport - Équipements Sportifs au Maroc"
      : "Carré Sport - Sports Equipment in Morocco",
    description: language === 'fr'
      ? "Découvrez notre collection d'équipements sportifs au Maroc. Livraison gratuite dès 500 MAD."
      : "Discover our sports equipment collection in Morocco. Free shipping from 500 MAD.",
    keywords: language === 'fr'
      ? MOROCCO_FRENCH_KEYWORDS.primary.join(", ")
      : MOROCCO_ENGLISH_KEYWORDS.primary.join(", ")
  }
}

// Export for easy integration
export default {
  generateMoroccoSEO,
  MOROCCO_FRENCH_KEYWORDS,
  MOROCCO_ENGLISH_KEYWORDS
} 