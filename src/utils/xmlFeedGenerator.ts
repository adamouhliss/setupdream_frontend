/**
 * Frontend XML Feed Generator Utility
 * Can be used as backup or for client-side generation
 */

export interface ProductForXML {
  id: number
  name: string
  description?: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  brand?: string
  color?: string
  sizes?: string[]
  category?: {
    name: string
  }
  image_url?: string
  is_active: boolean
}

export class XMLFeedGenerator {
  private baseUrl: string

  constructor(baseUrl: string = 'https://www.carresports.ma') {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  }

  generateBasicXMLFeed(products: ProductForXML[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Carré Sport - Équipements Sportifs Premium</title>
    <description>Découvrez notre collection premium d'équipements sportifs au Maroc</description>
    <link>${this.baseUrl}</link>`

    const items = products
      .filter(p => p.is_active)
      .map(product => this.generateProductItem(product))
      .join('\n')

    const footer = `
  </channel>
</rss>`

    return header + '\n' + items + footer
  }

  private generateProductItem(product: ProductForXML): string {
    const price = product.sale_price || product.price
    const imageUrl = this.getImageUrl(product.image_url)
    const availability = this.getAvailability(product.stock_quantity)
    const description = this.cleanDescription(product.description || product.name)

    return `    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:price>${price.toFixed(2)} MAD</g:price>
      <g:condition>new</g:condition>
      <g:link>${this.baseUrl}/products/${product.id}</g:link>
      <g:availability>${availability}</g:availability>
      <g:image_link>${imageUrl}</g:image_link>
      ${product.category ? `<g:product_type>${product.category.name}</g:product_type>` : ''}
      ${product.brand ? `<g:brand><![CDATA[${product.brand}]]></g:brand>` : ''}
      ${product.sku ? `<g:mpn>${product.sku}</g:mpn>` : ''}
      ${product.color ? `<g:color>${product.color}</g:color>` : ''}
      ${product.sizes && product.sizes.length > 0 ? `<g:size>${product.sizes.join('/')}</g:size>` : ''}
      ${product.sale_price && product.sale_price < product.price ? `<g:sale_price>${product.sale_price.toFixed(2)} MAD</g:sale_price>` : ''}
      <g:shipping>MA:Standard:50 MAD</g:shipping>
      <g:identifier_exists>${product.sku ? 'yes' : 'no'}</g:identifier_exists>
    </item>`
  }

  private getImageUrl(imageUrl?: string): string {
    if (!imageUrl) {
      return `${this.baseUrl}/images/products/placeholder.jpg`
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl
    }

    if (imageUrl.startsWith('/')) {
      return `https://projects-backend.mlqyyh.easypanel.host${imageUrl}`
    }

    return `https://projects-backend.mlqyyh.easypanel.host/uploads/products/${imageUrl}`
  }

  private getAvailability(stockQuantity: number): string {
    if (stockQuantity <= 0) {
      return 'out of stock'
    } else if (stockQuantity <= 10) {
      return 'limited availability'
    } else {
      return 'in stock'
    }
  }

  private cleanDescription(description: string): string {
    if (!description) {
      return 'Équipement sportif de qualité premium chez Carré Sport'
    }

    // Remove HTML tags
    const cleanDesc = description.replace(/<[^>]+>/g, '').trim()
    
    // Limit length
    if (cleanDesc.length > 1000) {
      return cleanDesc.substring(0, 997) + '...'
    }

    return cleanDesc
  }

  generateGoogleShoppingXML(products: ProductForXML[]): string {
    const basicXML = this.generateBasicXMLFeed(products)
    
    // Add Google Shopping specific fields
    return basicXML.replace(
      /<g:shipping>MA:Standard:50 MAD<\/g:shipping>/g,
      `<g:shipping>MA:Standard:50 MAD</g:shipping>
      <g:adult>no</g:adult>
      <g:age_group>adult</g:age_group>
      <g:gender>unisex</g:gender>`
    )
  }

  downloadXMLFile(xmlContent: string, filename: string = 'product_feed.xml'): void {
    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// Export convenience function
export const generateProductXML = (products: ProductForXML[], baseUrl?: string): string => {
  const generator = new XMLFeedGenerator(baseUrl)
  return generator.generateBasicXMLFeed(products)
}

// Export download function
export const downloadProductXML = (products: ProductForXML[], filename?: string, baseUrl?: string): void => {
  const generator = new XMLFeedGenerator(baseUrl)
  const xmlContent = generator.generateBasicXMLFeed(products)
  generator.downloadXMLFile(xmlContent, filename)
} 