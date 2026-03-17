import { getImageUrl } from './imageUrl'

// Hardcoded product images for legacy products (products 1-12)
export const productImages: { [key: number]: string[] } = {
  1: [
    'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=2070&auto=format&fit=crop', // Tactical Gloves
    'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop'
  ],
  2: [
    'https://images.unsplash.com/photo-1595590424283-b8f1fa8419c6?q=80&w=2070&auto=format&fit=crop', // Chest Rig (Vest)
    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop'
  ],
  3: [
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop', // Bulletproof/Tactical Vest
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=2050&auto=format&fit=crop'
  ],
  4: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', // Tactical Boots (Red Shoe placeholder)
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop' // Shoe
  ],
  5: [
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=2069&auto=format&fit=crop', // Helmet
    'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?q=80&w=2070&auto=format&fit=crop'
  ],
  6: [
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop', // Knee Pads (Equipment)
    'https://images.unsplash.com/photo-1518617691760-0a4030669d23?q=80&w=2070&auto=format&fit=crop'
  ],
  7: [
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=2070&auto=format&fit=crop', // Tactical Belt / Bag
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2187&auto=format&fit=crop'
  ],
  8: [
    'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=2072&auto=format&fit=crop', // Night Vision (Goggles/Optics)
    'https://images.unsplash.com/photo-1588619460287-c335b2487eec?q=80&w=1974&auto=format&fit=crop'
  ],
  9: [
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop', // Camouflage
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop'
  ],
  10: [
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop', // Radio
    'https://images.unsplash.com/photo-1589405858862-2ac9cbb6d5d5?q=80&w=2070&auto=format&fit=crop'
  ],
  11: [
    'https://images.unsplash.com/photo-1603398938378-e54eab4e6292?q=80&w=2071&auto=format&fit=crop', // First Aid
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop'
  ],
  12: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop', // Watch
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop'
  ]
}

// Get images for a specific product
export const getProductImages = (productId: number): string[] => {
  return productImages[productId] || ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop']
}

// Get primary image for a product with Railway URL handling
export const getProductPrimaryImage = (productId: number, productImageUrl?: string): string => {
  // If we have an actual uploaded image URL from the backend, use the fixed URL
  if (productImageUrl) {
    return getImageUrl(productImageUrl) || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
  }

  // Fallback to hardcoded images for existing products (products 1-12)
  const images = getProductImages(productId)
  // Apply URL fixing to hardcoded images too
  return getImageUrl(images[0]) || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
}

// Generate thumbnail versions of images
export const getProductThumbnails = (productId: number): string[] => {
  return getProductImages(productId).map(url =>
    // For Railway URLs, thumbnails are the same as regular images
    url
  )
}

// Category-based fallback images
export const getCategoryImages = (_category: string): string[] => {
  // Return placeholder images for all categories
  const placeholderImages = [
    '/uploads/products/placeholder.jpg',
    '/uploads/products/placeholder-2.jpg',
    '/uploads/products/placeholder-3.jpg',
    '/uploads/products/placeholder-4.jpg'
  ]

  return placeholderImages.map(url => getImageUrl(url) || url)
} 