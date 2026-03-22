import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import viteCompression from 'vite-plugin-compression'
// @ts-ignore
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 70,
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://projects-backend.mlqyyh.easypanel.host',
        changeOrigin: true,
        secure: true,
      },
      '/sitemap.xml': {
        target: 'https://projects-backend.mlqyyh.easypanel.host',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sitemap\.xml$/, '/api/v1/seo/sitemap.xml')
      }
    }
  },
  build: {
    target: 'es2018',
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React and routing
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI libraries
          'ui-vendor': [
            'framer-motion',
            '@heroicons/react',
            'react-hot-toast'
          ],

          // Analytics and monitoring
          'analytics-vendor': [
            '@vercel/analytics',
            '@vercel/speed-insights',
            'web-vitals'
          ],

          // State management
          'state-vendor': ['zustand'],

          // i18n
          'i18n-vendor': [
            'react-i18next',
            'i18next',
            'i18next-browser-languagedetector'
          ]
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId?.includes('node_modules')) {
            return 'vendor/[name]-[hash].js'
          }
          return 'js/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `images/[name]-[hash].${ext}`
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'framer-motion',
      'react-hot-toast'
    ],
    exclude: [
      '@vercel/analytics',
      '@vercel/speed-insights'
    ]
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  },
  css: {
    devSourcemap: false
  }
}) 