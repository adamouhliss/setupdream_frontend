import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, token, getCurrentUser } = useAuthStore()
  const location = useLocation()

  // Try to get current user if we have a token but no user data
  useEffect(() => {
    if (token && !user) {
      getCurrentUser().catch(() => {
        // If getCurrentUser fails, the auth store will handle logout
      })
    }
  }, [token, user, getCurrentUser])

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If admin access is required but user is not admin
  if (requireAdmin && user && !user.is_superuser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50/30 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-white/20 p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 font-lora mb-6">
            You don't have permission to access this area. Admin privileges are required.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary px-6 py-3 font-montserrat"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  // If we're still loading user data, show loading spinner
  if (token && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-lora">Loading your account...</p>
        </motion.div>
      </div>
    )
  }

  // User is authenticated and authorized, render the protected content
  return <>{children}</>
} 