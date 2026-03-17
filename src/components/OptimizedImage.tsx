import { useState, useRef, useEffect, memo } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean // For LCP images
  sizes?: string
  width?: number
  height?: number
  onClick?: () => void
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width,
  height,
  onClick,
  loading = 'lazy',
  fetchPriority = 'auto'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)

  // Check if image is already loaded (from cache)
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      if (fetchPriority) link.fetchPriority = fetchPriority
      document.head.appendChild(link)

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [src, priority, fetchPriority])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    // If we haven't tried the fallback yet, try it
    const fallbackUrl = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'

    if (currentSrc !== fallbackUrl) {
      setCurrentSrc(fallbackUrl)
    } else {
      setHasError(true)
    }
  }

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div className={`absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse flex items-center justify-center z-10 ${className}`}>
      <div className="w-8 h-8 text-gray-400">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )

  return (
    <div className="relative w-full h-full">
      {/* Loading state */}
      {!isLoaded && !hasError && <LoadingPlaceholder />}

      {/* Error state */}
      {hasError && (
        <div className={`absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 z-10 ${className}`}>
          <span className="text-sm">Image unavailable</span>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        data-priority={priority}
        className={`${!priority ? 'transition-opacity duration-300' : ''} ${isLoaded || priority ? 'opacity-100' : 'opacity-0'} ${className}`}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : loading}
        {...({ fetchpriority: priority ? fetchPriority : undefined } as any)}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
      />

      {/* Critical CSS for immediate display */}
      {priority && (
        <style>{`
          img[data-priority="true"] {
            content-visibility: visible;
            display: block;
          }
        `}</style>
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage 