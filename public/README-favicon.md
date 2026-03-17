# Favicon Setup for Carré Sports

## Current Setup
- **favicon.svg**: Main scalable favicon with sports equipment design (dumbbell icon)
- **site.webmanifest**: PWA manifest for mobile app-like experience
- **index.html**: Updated with favicon links and theme colors

## Design Details
- **Colors**: Gold (#d4af37) and dark gray (#1f2937) matching the brand
- **Icon**: Stylized dumbbell representing sports equipment
- **Letter**: "C" for Carré Sports at the bottom

## Browser Compatibility
The SVG favicon works in all modern browsers. For maximum compatibility with older browsers, you can generate additional formats:

### To Generate Additional Formats:
1. Go to [favicon.io/favicon-converter/](https://favicon.io/favicon-converter/)
2. Upload the `favicon.svg` file
3. Download the generated package
4. Add these files to the `/public` directory:
   - `favicon.ico` (for IE compatibility)
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180)

### Alternative: Real Favicon Generator
Use [realfavicongenerator.net](https://realfavicongenerator.net) for more comprehensive favicon generation including:
- Various Apple device sizes
- Android Chrome icons
- Windows Metro tiles
- Safari pinned tabs

## Testing
The favicon should appear in:
- Browser tabs
- Bookmarks
- Mobile home screen (when added as PWA)
- Browser history

## Mobile App Features
The web manifest enables:
- "Add to Home Screen" on mobile devices
- App-like appearance when launched from home screen
- Brand colors in mobile UI 