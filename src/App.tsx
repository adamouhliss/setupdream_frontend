import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import React, { Suspense, lazy } from 'react' // Import lazy and Suspense
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

// Initialize i18n
import './i18n'

// Layout components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'
import MobileBottomNav from './components/layout/header/MobileBottomNav'

// Banner components
import FirstTimeDiscountBanner from './components/banners/FirstTimeDiscountBanner'
import FirstTimeDiscountNotification from './components/banners/FirstTimeDiscountNotification'
import RamadanBanner from './components/banners/RamadanBanner'

// Cookie components
import CookieConsentBanner from './components/cookies/CookieConsentBanner'
import CookieInitializer from './components/cookies/CookieInitializer'

// Cart component
import CartDropdown from './components/cart/CartDropdown'

// WhatsApp component
import WhatsAppFloating from './components/WhatsAppFloating'

// Dynamic Favicon component
import DynamicFavicon from './components/DynamicFavicon'

// Performance monitoring
import PerformanceMonitor from './components/PerformanceMonitor'
import PerformanceOptimizer from './components/PerformanceOptimizer'
import PerformanceTracker from './components/PerformanceTracker'

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'))
const SaleItemsPage = lazy(() => import('./pages/SaleItemsPage'))

// City-specific pages
const CasablancaSportsPage = lazy(() => import('./pages/city/CasablancaSportsPage'))
const RabatSportsPage = lazy(() => import('./pages/city/RabatSportsPage'))
const MarrakechSportsPage = lazy(() => import('./pages/city/MarrakechSportsPage'))

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))

// Performance Page
const PerformanceLabPage = lazy(() => import('./pages/PerformanceLabPage'))
const PerformanceArticlePage = lazy(() => import('./pages/PerformanceArticlePage'))

// Partnership Page
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'))
const MediaKitPage = lazy(() => import('./pages/MediaKitPage'))

// User pages
const OrdersPage = lazy(() => import('./pages/user/OrdersPage'))
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'))
const InfluencerDashboard = lazy(() => import('./pages/user/InfluencerDashboard'))
const LanguageDemo = lazy(() => import('./components/LanguageDemo'))

// Admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminInfluencers = lazy(() => import('./pages/admin/AdminInfluencers'))
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminSEO = lazy(() => import('./pages/admin/AdminSEO'))
const AdminPerformanceTest = lazy(() => import('./pages/admin/AdminPerformanceTest'))
const AdminXMLFeeds = lazy(() => import('./pages/admin/AdminXMLFeeds'))

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

// Customer Layout Component
function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <RamadanBanner />
      <Header />
      <FirstTimeDiscountBanner />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>

      <Footer />

      {/* Discount System */}
      <FirstTimeDiscountNotification />

      {/* Cookie Consent System */}
      <CookieInitializer />
      <CookieConsentBanner />

      {/* WhatsApp Support */}
      <WhatsAppFloating />
      <DynamicFavicon />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      <Routes>
        {/* Admin Routes - separate layout */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="influencers" element={<AdminInfluencers />} />
          <Route path="seo" element={<AdminSEO />} />
          <Route path="performance" element={<AdminPerformanceTest />} />
          <Route path="xml-feeds" element={<AdminXMLFeeds />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Routes - customer layout */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
        <Route path="/products/:slug" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
        <Route path="/categories" element={<CustomerLayout><CategoriesPage /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
        <Route path="/returns" element={<CustomerLayout><ReturnsPage /></CustomerLayout>} />
        <Route path="/cookie-policy" element={<CustomerLayout><CookiePolicyPage /></CustomerLayout>} />
        <Route path="/privacy-policy" element={<CustomerLayout><PrivacyPolicyPage /></CustomerLayout>} />
        <Route path="/new" element={<CustomerLayout><NewArrivalsPage /></CustomerLayout>} />
        <Route path="/sale" element={<CustomerLayout><SaleItemsPage /></CustomerLayout>} />
        <Route path="/performance-lab" element={<CustomerLayout><PerformanceLabPage /></CustomerLayout>} />
        <Route path="/performance-lab/:slug" element={<CustomerLayout><PerformanceArticlePage /></CustomerLayout>} />
        <Route path="/partnerships" element={<CustomerLayout><PartnershipPage /></CustomerLayout>} />
        <Route path="/media-kit" element={<CustomerLayout><MediaKitPage /></CustomerLayout>} />

        {/* City-specific SEO pages for local search traffic */}
        <Route path="/casablanca" element={<CustomerLayout><CasablancaSportsPage /></CustomerLayout>} />
        <Route path="/rabat" element={<CustomerLayout><RabatSportsPage /></CustomerLayout>} />
        <Route path="/marrakech" element={<CustomerLayout><MarrakechSportsPage /></CustomerLayout>} />

        {/* Auth Routes */}
        <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />
        <Route path="/register" element={<CustomerLayout><RegisterPage /></CustomerLayout>} />

        {/* User Routes */}
        <Route path="/orders" element={<CustomerLayout><OrdersPage /></CustomerLayout>} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <CustomerLayout><ProfilePage /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/influencer" element={
          <ProtectedRoute>
            <CustomerLayout><InfluencerDashboard /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/language-demo" element={<CustomerLayout><LanguageDemo /></CustomerLayout>} />
      </Routes>

      {/* Global Components */}
      <CartDropdown />

      {/* Performance Monitoring */}
      <PerformanceMonitor />

      {/* Performance Optimization */}
      <PerformanceOptimizer />

      {/* Performance Tracking */}
      <PerformanceTracker />

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />

      {/* Global Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  )
}

export default App




