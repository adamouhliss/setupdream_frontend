// Utility function to fix image URLs
export function fixImageUrl(url: string | any | null | undefined): string | null {
  if (!url) return null;

  // Handle cases where url is an object (e.g., {id, url, image_url})
  if (typeof url === 'object') {
    const extracted = url.url || url.image_url || url.path || url.src || null;
    if (!extracted || typeof extracted !== 'string') return null;
    return fixImageUrl(extracted);
  }

  // Ensure url is a string
  if (typeof url !== 'string') {
    return null;
  }

  // Handle base64 images
  if (url.startsWith('data:image')) {
    return url;
  }

  // Handle absolute URLs (http/https)
  if (url.startsWith('http')) {
    // If it points to setupdream.ma, replace with Railway URL
    if (url.includes('setupdream.ma')) {
      return url.replace(/https?:\/\/(www\.)?setupdream\.ma/, 'https://projects-backend.mlqyyh.easypanel.host');
    }
    return url;
  }

  // Handle relative URLs
  // Ensure we have a leading slash
  const path = url.startsWith('/') ? url : `/${url}`;

  // If it's a path that looks like an upload or static asset from backend
  return `https://projects-backend.mlqyyh.easypanel.host${path}`;
}

// Helper function to get the correct image URL for display
export function getImageUrl(imageUrl: string | null | undefined): string {
  const fixedUrl = fixImageUrl(imageUrl);

  if (!fixedUrl) {
    return '/placeholder-image.jpg'; // Fallback image
  }

  // Always return the Railway URL for images
  return fixedUrl;
} 