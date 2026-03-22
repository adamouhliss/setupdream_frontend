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
    "pc gamer maroc",
    "setup pc maroc", 
    "ordinateur gamer maroc",
    "boutique gaming casablanca",
    "pc portable gamer rabat",
    "composants pc marrakech"
  ],
  secondary: [
    "vente pc gamer maroc",
    "accessoires gaming maroc", 
    "écrans pc gamer maroc",
    "souris gamer maroc",
    "carte graphique casablanca",
    "setup streaming maroc"
  ],
  longTail: [
    "où acheter pc gamer maroc",
    "meilleure boutique gaming casablanca",
    "achat pc gamer pas cher maroc",
    "composants pc livraison maroc",
    "magasin gaming en ligne maroc",
    "pc gamer professionnel maroc"
  ],
  cities: {
    casablanca: ["gaming casablanca", "pc gamer casablanca", "setup casablanca", "composants pc casablanca"],
    rabat: ["gaming rabat", "pc gamer rabat", "setup rabat", "boutique gaming rabat"],
    marrakech: ["gaming marrakech", "pc gamer marrakech", "setup marrakech", "matériel gaming marrakech"],
    fes: ["gaming fes", "pc gamer fes", "setup fes"],
    agadir: ["gaming agadir", "pc gamer agadir", "setup agadir"],
    tanger: ["gaming tanger", "pc gamer tanger", "setup tanger"]
  }
}

// High-traffic English keywords for Morocco
export const MOROCCO_ENGLISH_KEYWORDS = {
  primary: [
    "gaming pc morocco",
    "pc setup morocco",
    "gaming computer morocco", 
    "gaming gear morocco",
    "pc components morocco",
    "gaming laptop morocco"
  ],
  secondary: [
    "gaming shop morocco",
    "pc store morocco",
    "gaming accessories morocco",
    "gaming monitors morocco",
    "gpus morocco",
    "streaming setup morocco"
  ],
  longTail: [
    "where to buy gaming pc morocco",
    "best gaming store casablanca",
    "pc components shop rabat",
    "gaming gear store marrakech",
    "gaming pc delivery morocco",
    "online gaming shop morocco"
  ],
  cities: {
    casablanca: ["gaming casablanca", "pc gamer casablanca", "gaming setup casablanca", "gaming gear casablanca"],
    rabat: ["gaming rabat", "pc gamer rabat", "gaming hardware rabat", "gaming store rabat"],
    marrakech: ["gaming marrakech", "pc setup marrakech", "gaming components marrakech", "gaming equipment marrakech"],
    agadir: ["gaming agadir", "pc gamer agadir", "gaming hardware agadir"],
    tanger: ["gaming tangier", "pc gamer tangier", "gaming equipment tangier"]
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
          title: "SetupDream - Boutique PC Gamer et Setups au Maroc | Casablanca, Rabat, Marrakech",
          description: "🏆 N°1 du PC Gamer au Maroc ! Setups sur mesure, composants, périphériques. Magasins à Casablanca, Rabat, Marrakech. Livraison gratuite dès 500 MAD.",
          keywords: [
            ...MOROCCO_FRENCH_KEYWORDS.primary,
            ...MOROCCO_FRENCH_KEYWORDS.secondary,
            "rtx 4090 maroc", "clavier mécanique maroc", "chaise gamer maroc", "casque gamer maroc", "processeur amd maroc"
          ].join(", "),
          structuredData: generateLocalBusinessSchema('fr')
        }
        
      case 'products':
        return {
          title: "PC Gamer & Composants au Maroc | SetupDream - Casablanca, Rabat",
          description: "🔥 Plus de 1000 références ! Cartes graphiques, processeurs, écrans gamer. Prix imbattables au Maroc. Expédition 24h Casablanca-Rabat. Paiement à la livraison disponible.",
          keywords: [
            "pc gamer maroc pas cher",
            "composants pc occasion maroc", 
            "vente matériel gaming casablanca",
            "boutique pc rabat",
            "ordinateur gamer marrakech",
            ...MOROCCO_FRENCH_KEYWORDS.longTail
          ].join(", ")
        }
        
      case 'product':
        const productName = params?.productName || 'Équipement Gaming'
        const price = params?.price ? ` - ${params.price} MAD` : ''
        return {
          title: `${productName} | PC Gamer Maroc - SetupDream Casablanca${price}`,
          description: `✅ ${productName} en stock au Maroc ! Livraison rapide Casablanca, Rabat, Marrakech. Prix compétitif, garantie. Paiement sécurisé. Conseils d'experts gratuits.`,
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
          title: `Boutique PC Gamer ${cityName} | SetupDream - Matériel Gaming ${cityName}`,
          description: `🏪 Boutique gaming ${cityName} chez SetupDream ! Showroom, conseil personnalisé. Ouvert 7j/7. Livraison le jour même possible.`,
          keywords: [
            `boutique gaming ${cityName.toLowerCase()}`,
            `pc gamer ${cityName.toLowerCase()}`,
            `matériel informatique ${cityName.toLowerCase()}`,
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
          title: "SetupDream - Premium Gaming PCs in Morocco | Casablanca, Rabat, Marrakech",
          description: "🏆 #1 Gaming PC Store in Morocco! Custom setups, components, peripherals. Stores in Casablanca, Rabat, Marrakech. Free shipping from 500 MAD.",
          keywords: [
            ...MOROCCO_ENGLISH_KEYWORDS.primary,
            ...MOROCCO_ENGLISH_KEYWORDS.secondary,
            "rtx 4090 morocco", "mechanical keyboard morocco", "gaming chair morocco", "gaming headset morocco", "amd processor morocco"
          ].join(", "),
          structuredData: generateLocalBusinessSchema('en')
        }
        
      case 'products':
        return {
          title: "Gaming PCs & Components in Morocco | SetupDream - Casablanca, Rabat",
          description: "🔥 1000+ Products! Graphic cards, processors, gaming monitors. Best prices in Morocco. 24h shipping Casablanca-Rabat. Cash on delivery available.",
          keywords: [
            "cheap gaming pc morocco",
            "used pc components morocco",
            "gaming gear sale casablanca", 
            "gaming store rabat",
            "pc components marrakech",
            ...MOROCCO_ENGLISH_KEYWORDS.longTail
          ].join(", ")
        }
        
      case 'product':
        const productName = params?.productName || 'Gaming Gear'
        const price = params?.price ? ` - ${params.price} MAD` : ''
        return {
          title: `${productName} | Gaming PC Morocco - SetupDream Casablanca${price}`,
          description: `✅ ${productName} in stock in Morocco! Fast delivery Casablanca, Rabat, Marrakech. Competitive price, warranty included. Secure payment. Free expert advice.`,
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
          title: `Gaming Store ${cityName} | SetupDream - PC Components ${cityName}`,
          description: `🏪 Gaming store ${cityName} at SetupDream! Showroom, personal advice. Open 7 days. Same-day delivery available.`,
          keywords: [
            `gaming store ${cityName.toLowerCase()}`,
            `pc components ${cityName.toLowerCase()}`,
            `gaming hardware ${cityName.toLowerCase()}`,
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
  let baseUrl = 'https://setupdream.ma'
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
    "@type": "Store",
    "@id": `${baseUrl}/#localbusiness`,
    "name": "SetupDream",
    "image": `${baseUrl}/images/logo.png`,
    "description": language === 'fr' 
      ? "Leader du PC Gamer et composants au Maroc. Magasins à Casablanca, Rabat, Marrakech. Plus de 10,000 clients satisfaits."
      : "Leading gaming PC retailer in Morocco. Stores in Casablanca, Rabat, Marrakech. Over 10,000 satisfied customers.",
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
    "email": "contact@setupdream.ma",
    "priceRange": "$$$",
    "currenciesAccepted": "MAD",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "openingHours": "Mo-Su 09:00-20:00",
    "servesCuisine": null,
    "acceptsReservations": false,
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": 4.9,
      "reviewCount": 356
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
      "name": language === 'fr' ? "PC Gamer & Setups" : "Gaming PCs & Hardware",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": language === 'fr' ? "Composants PC" : "PC Components",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": language === 'fr' ? "Cartes Graphiques" : "Graphic Cards"
              }
            }
          ]
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/SetupDreamMaroc",
      "https://www.instagram.com/setupdream_maroc",
      "https://twitter.com/SetupDreamMA"
    ]
  }
}

const generateDefaultSEO = (language: 'fr' | 'en'): MoroccoSEOConfig => {
  return {
    title: language === 'fr' 
      ? "SetupDream - PC Gamer et Composants au Maroc"
      : "SetupDream - Gaming PCs & Components in Morocco",
    description: language === 'fr'
      ? "Découvrez notre catalogue de PC Gamer et composants premium au Maroc. Livraison gratuite dès 500 MAD."
      : "Discover our premium gaming PCs and components in Morocco. Free shipping from 500 MAD.",
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