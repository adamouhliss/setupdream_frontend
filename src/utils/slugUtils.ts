/**
 * Utility functions for generating SEO-friendly slugs
 */

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to slug
 * @returns URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    // Replace French accented characters
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ß]/g, 'ss')
    .replace(/[æ]/g, 'ae')
    .replace(/[œ]/g, 'oe')
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
}

/**
 * Generate a product slug from product data
 * @param product - Product object with name, color, brand, etc.
 * @returns SEO-friendly product slug
 */
export const generateProductSlug = (product: {
  name: string
  color?: string
  brand?: string
  id: number
}): string => {
  let slugParts = [product.name]
  
  // Add color if available
  if (product.color) {
    slugParts.push(product.color)
  }
  
  // Add brand if available and different from name
  if (product.brand && !product.name.toLowerCase().includes(product.brand.toLowerCase())) {
    slugParts.push(product.brand)
  }
  
  const baseSlug = generateSlug(slugParts.join(' '))
  
  // Ensure uniqueness by adding product ID at the end
  return `${baseSlug}-${product.id}`
}

/**
 * Extract product ID from a slug
 * @param slug - The product slug
 * @returns Product ID or null if not found
 */
export const extractProductIdFromSlug = (slug: string): number | null => {
  if (!slug) return null
  
  // Extract the ID from the end of the slug (after the last hyphen)
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart, 10)
  
  return !isNaN(id) ? id : null
}

/**
 * Generate category slug
 * @param categoryName - Category name
 * @returns SEO-friendly category slug
 */
export const generateCategorySlug = (categoryName: string): string => {
  return generateSlug(categoryName)
}

/**
 * Validate slug format
 * @param slug - Slug to validate
 * @returns Boolean indicating if slug is valid
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug) return false
  
  // Valid slug should only contain lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug) && !slug.startsWith('-') && !slug.endsWith('-')
} 