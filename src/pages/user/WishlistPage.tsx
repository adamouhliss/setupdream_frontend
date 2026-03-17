import { motion } from 'framer-motion'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-600 border-t-gold-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-lora">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-100 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-300 font-lora">
            Save your favorite items for later
          </p>
        </motion.div>

        {/* Empty Wishlist State */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 p-12 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gold-800/30 to-gold-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-12 h-12 text-gold-400" />
          </div>
          <h3 className="text-xl font-bold font-playfair text-gray-100 mb-2">Your Wishlist is Empty</h3>
          <p className="text-gray-300 font-lora mb-6 max-w-md mx-auto">
            Start adding items to your wishlist by clicking the heart icon on any product you love!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/products'}
              className="btn-primary px-6 py-3 font-montserrat inline-flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Browse Products
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-outline px-6 py-3 font-montserrat"
            >
              Back to Home
            </button>
          </div>
          
          {/* Coming Soon Badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-600/30 rounded-full">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium font-montserrat text-blue-300">
              Full wishlist functionality coming soon!
            </span>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
} 