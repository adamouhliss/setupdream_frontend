const fs = require('fs');
const path = require('path');

// Files that need product URL updates
const filesToUpdate = [
  'src/pages/ProductsPage.tsx',
  'src/pages/SaleItemsPage.tsx', 
  'src/pages/NewArrivalsPage.tsx',
  'src/pages/CartPage.tsx',
  'src/pages/city/MarrakechSportsPage.tsx',
  'src/pages/city/RabatSportsPage.tsx',
  'src/pages/city/CasablancaSportsPage.tsx',
  'src/components/QuickSizeSelector.tsx',
  'src/components/sales/ProductRecommendations.tsx',
  'src/components/sales/RecentlyViewedProducts.tsx'
];

// Function to update a file
function updateProductUrls(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // Check if getProductUrl import exists
    if (!content.includes('getProductUrl') && content.includes('/products/${product.id}')) {
      // Add import if it doesn't exist
      const importLine = "import { getProductUrl } from '../utils/productUrls'";
      const importSection = content.match(/(import.*from.*\n)+/);
      if (importSection) {
        content = content.replace(importSection[0], importSection[0] + importLine + '\n');
        updated = true;
      }
    }
    
    // Replace URLs
    const urlReplacements = [
      // Standard Link components
      [/to={\`\/products\/\$\{product\.id\}\`}/g, 'to={getProductUrl(product)}'],
      [/href={\`\/products\/\$\{product\.id\}\`}/g, 'href={getProductUrl(product)}'],
      [/window\.location\.href = \`\/products\/\$\{product\.id\}\`/g, 'window.location.href = getProductUrl(product)'],
      // For item.product.id cases (like in cart)
      [/to={\`\/products\/\$\{item\.product\.id\}\`}/g, 'to={getProductUrl(item.product)}']
    ];
    
    urlReplacements.forEach(([regex, replacement]) => {
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all files
console.log('🔄 Starting product URL updates...\n');
filesToUpdate.forEach(updateProductUrls);
console.log('\n✨ Product URL updates complete!'); 