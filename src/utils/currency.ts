/**
 * Format price in Moroccan Dirham (MAD)
 * @param price - The price number to format
 * @param showSymbol - Whether to show the Arabic dirham symbol (د.م.)
 * @returns Formatted price string with MAD currency
 */
export const formatMAD = (price: number, showSymbol: boolean = false): string => {
  const formattedPrice = price.toLocaleString('fr-MA')
  if (showSymbol) {
    return `${formattedPrice} د.م.`
  }
  return `${formattedPrice} MAD`
}

/**
 * Format price in compact Moroccan Dirham format for small displays
 * @param price - The price number to format
 * @param showSymbol - Whether to show the Arabic dirham symbol (د.م.)
 * @returns Compact formatted price string
 */
export const formatMADCompact = (price: number, showSymbol: boolean = false): string => {
  const symbol = showSymbol ? 'د.م.' : 'MAD'
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M ${symbol}`
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}k ${symbol}`
  }
  return `${price} ${symbol}`
}

/**
 * Format price with Moroccan Arabic symbol (د.م.)
 * @param price - The price number to format
 * @returns Formatted price string with Arabic dirham symbol
 */
export const formatMADArabic = (price: number): string => {
  return formatMAD(price, true)
} 