import { getProductUrl } from '../utils/productUrls'
import { DatabaseProduct } from '../services/productApi';

interface ProductSchemaProps {
  product: DatabaseProduct;
  reviewCount?: number;
  averageRating?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

export default function ProductSchema({ 
  product, 
  reviewCount = 0, 
  averageRating = 0,
  availability = 'InStock'
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.map((img: any) => img.url) || [],
    "brand": {
      "@type": "Brand",
      "name": "Carré Sport"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Carré Sport",
      "url": "https://carresports.ma"
    },
    "category": product.category_id ? `Category ${product.category_id}` : 'Sports Equipment',
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "MAD",
      "availability": `https://schema.org/${availability}`,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      "seller": {
        "@type": "Organization",
        "name": "Carré Sport",
        "url": "https://carresports.ma"
      },
      "url": getProductUrl(product),
      "itemCondition": "https://schema.org/NewCondition"
    },
    ...(reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating,
        "reviewCount": reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    ...(product.sizes && product.sizes.length > 0 && {
      "additionalProperty": product.sizes.map((size: string) => ({
        "@type": "PropertyValue",
        "name": "Size",
        "value": size
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 

