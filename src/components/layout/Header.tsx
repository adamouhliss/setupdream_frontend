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
    sticky top-0 z-40 transition-all duration-300 w-full
    ${isScrolled
      ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800'
      : 'bg-gray-900 border-b border-gray-800'
    }
  `

  return (
    <>
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left: Mobile Toggle & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Open Menu"
              >
                <Bars3Icon className="w-7 h-7" />
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                {settings?.store_logo_url ? (
                  <img
                    src={getImageUrl(settings.store_logo_url)}
                    alt={settings?.store_name || 'SetupDream'}
                    className="w-10 h-10 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-all duration-300">
                    <span className="text-xl font-black text-white font-playfair">
                      {settings?.store_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black font-playfair text-white tracking-tight group-hover:text-gold-400 transition-colors duration-300">
                    {settings?.store_name || 'SetupDream'}
                  </h1>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <DesktopNav navigationItems={navigationItems} />

            {/* Right: Icons & Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Language Switcher */}
              <div className="hidden sm:block mr-2">
                <LanguageSwitcher />
              </div>

              {/* Search Trigger (Mobile/Desktop unique) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                aria-label={t('common.search') || "Search"}
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>

              <div className="w-px h-6 bg-gray-800 mx-1 hidden sm:block"></div>

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
