import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black font-playfair bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-clip-text text-transparent mb-4">
            About Carré Sports
          </h1>
          <p className="text-xl text-gray-300 font-lora max-w-2xl mx-auto">
            Your premier destination for high-quality sports equipment and gear in Morocco.
          </p>
        </motion.div>
      </div>
    </div>
  )
} 