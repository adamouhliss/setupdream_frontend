import { generateProductSlug } from './slugUtils'

/**
 * Generate a product URL with SEO-friendly slug
 * @param product - Product object with necessary fields
 * @returns Product URL with slug
 */
export const getProductUrl = (product: {
  id: number
  name: string
  color?: string
  brand?: string
}): string => {
  const slug = generateProductSlug(product)
  return `/products/${slug}`
}

/**
 * Generate product URL from just ID and name (for minimal data scenarios)
 * @param id - Product ID
 * @param name - Product name
 * @param color - Optional color
 * @param brand - Optional brand
 * @returns Product URL with slug
 */
export const getProductUrlFromData = (
  id: number, 
  name: string, 
  color?: string, 
  brand?: string
): string => {
  return getProductUrl({ id, name, color, brand })
} 