import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { productAPI, DatabaseCategory, DatabaseProduct } from '../services/productApi'
import OrganizationSchema from '../components/OrganizationSchema'
import OptimizedHero from '../components/OptimizedHero'
import TrustStrip from '../components/home/TrustStrip'
import InfiniteMarquee from '../components/home/InfiniteMarquee'
import FeaturedCategoryBlock from '../components/home/FeaturedCategoryBlock'
import { useSEO } from '../hooks/useSEO'
import { generateWebSiteSchema, generateLocalBusinessSchema } from '../utils/seoUtils'
import ScrollProgress from '../components/ui/ScrollProgress'

interface CategoryWithProducts extends DatabaseCategory {
  products: DatabaseProduct[]
}

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([])

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const categoriesData = await productAPI.getCategories()
        // Get top 4 active categories for the home page blocks
        const activeCategories = categoriesData.filter((cat: any) => cat.is_active).slice(0, 4)
        
        const richCategories = await Promise.all(activeCategories.map(async (cat: DatabaseCategory) => {
          const productsResponse = await productAPI.getProducts({ category_id: cat.id, limit: 4 })
          return {
            ...cat,
            products: productsResponse.items || [] // fallback array
          }
        }))
        
        setCategoriesWithProducts(richCategories)
      } catch (error) {
        console.error("Failed to fetch home categories:", error)
      }
    }

    fetchHomeData()
  }, [])

  // SEO Implementation
  useSEO({
    title: t('seo.home.title') || 'SetupDream - PC Gamer et Setups Premium au Maroc',
    description: t('seo.home.description') || 'Le N°1 du PC Gamer au Maroc. PC sur mesure, composants et accessoires gaming. Livraison partout au Maroc.',
    url: window.location.origin,
    canonical: window.location.origin,
    type: 'website',
    keywords: t('seo.home.keywords') || 'pc gamer maroc, composants pc casablanca, setup gamer rabat, matériel gaming',
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        generateWebSiteSchema(),
        generateLocalBusinessSchema()
      ]
    }
  })

  // Banner images mapped for distinct sections
  const bannerImages = [
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1000&auto=format&fit=crop", // PC Gamer
    "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop", // Chairs / Components
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000&auto=format&fit=crop", // Monitors
    "https://images.unsplash.com/photo-1615663245857-ac1aeb6c4de0?q=80&w=1000&auto=format&fit=crop"  // Accessories
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ScrollProgress />
      <OrganizationSchema />

      <OptimizedHero />
      <TrustStrip />
      <InfiniteMarquee />

      {/* Stack of Featured Category Blocks (Dynamic from DB) */}
      <div className="flex flex-col w-full bg-white">
        {categoriesWithProducts.map((cat, index) => (
          <FeaturedCategoryBlock
            key={cat.id}
            title={i18n.language === 'fr' && (cat as any).name_fr ? (cat as any).name_fr : cat.name}
            subtitle={t(`categories.${cat.name}.subtitle`, `Découvrez notre collection premium de ${cat.name.toLowerCase()}`)}
            bannerImage={bannerImages[index % bannerImages.length]}
            bannerLink={`/categories?category=${cat.id}`}
            products={cat.products}
            // Alternate layout between 2x2 grid and 1x4 row for visual breaks
            layout={index % 2 === 0 ? 'grid2x2' : 'row4'}
          />
        ))}
      </div>

    </div>
  )
}
