import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useStoreSettingsStore } from '../../store/storeSettingsStore'
import { getImageUrl } from '../../utils/imageUrl'

// Sub-components
import MobileMenu from './header/MobileMenu'
import DesktopNav from './header/DesktopNav'
import HeaderIcons from './header/HeaderIcons'
import SearchBar from './header/SearchBar'
import LanguageSwitcher from '../LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const { settings, fetchSettings } = useStoreSettingsStore()
  const navigate = useNavigate()

  const cartItemsCount = getTotalItems()

  useEffect(() => {
    fetchSettings()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchSettings])

  const navigationItems = useMemo(() => {
    const items = [
      { name: t('navigation.home'), href: '/' },
      { name: t('navigation.products'), href: '/products' },
      { name: t('navigation.categories'), href: '/categories' },
      { name: t('navigation.newArrivals') || 'New', href: '/new' },
      { name: t('navigation.sale') || 'Sale', href: '/sale' }
    ]
    if (isAuthenticated && user?.is_influencer) {
      items.push({ name: 'Influencer', href: '/influencer' })
    }
    return items
  }, [t, isAuthenticated, user])

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  // Header specific styles for dynamic scroll effect
  const headerClass = `
    sticky top-0 z-40 transition-all duration-300 w-full flex flex-col
    ${isScrolled
      ? 'shadow-lg border-b border-gray-800'
      : 'border-b border-gray-800'
    }
  `

  return (
    <>
      <header className={headerClass}>
        {/* Top Bar - Dark/Black */}
        <div className="bg-dark-950 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 gap-4">
              
              {/* Left: Mobile Toggle & Logo */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
                  aria-label="Open Menu"
                >
                  <Bars3Icon className="w-7 h-7" />
                </button>

                <Link to="/" className="flex items-center gap-3 md:gap-4 group">
                  {settings?.store_logo_url ? (
                    <img
                      src={getImageUrl(settings.store_logo_url)}
                      alt={settings?.store_name || 'SetupDream'}
                      className="w-12 md:w-auto h-12 object-contain transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center transition-all duration-300">
                      <span className="text-xl md:text-2xl font-black text-white tracking-widest italic uppercase">
                        {settings?.store_name || 'SETUPDREAM'}
                      </span>
                    </div>
                  )}
                </Link>
              </div>

              {/* Center: Integrated Search (Desktop) */}
              <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
                <div className="relative w-full group cursor-text" onClick={() => setIsSearchOpen(true)}>
                  <div className="w-full bg-white text-gray-900 rounded-sm py-2.5 pl-4 pr-10 border-2 border-transparent group-hover:border-primary-500 transition-colors flex items-center">
                    <span className="text-gray-400">Search components or setups...</span>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Right: Icons & Actions */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>

                {/* Mobile Search Trigger */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
                  aria-label={t('common.search') || "Search"}
                >
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </button>

                <div className="w-px h-6 bg-dark-800 hidden sm:block mx-1"></div>

                <HeaderIcons
                  cartCount={cartItemsCount}
                  onCartClick={toggleCart}
                  onUserClick={handleUserClick}
                  isAuthenticated={isAuthenticated}
                  userInitial={user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Red Navigation */}
        <div className="hidden lg:block bg-primary-600 w-full shadow-md z-10 border-t border-primary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-12">
              <DesktopNav navigationItems={navigationItems} />
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </>
  )
}
