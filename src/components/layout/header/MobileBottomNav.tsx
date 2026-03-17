import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolid, ShoppingBagIcon as ShopSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../../../store/cartStore'
import { useAuthStore } from '../../../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'

export default function MobileBottomNav() {
    const { t } = useTranslation()
    const location = useLocation()
    const { getTotalItems } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const cartItemsCount = getTotalItems()

    useEffect(() => {
        let lastScrollY = window.pageYOffset

        const updateScrollDirection = () => {
            const scrollY = window.pageYOffset
            const direction = scrollY > lastScrollY ? 'down' : 'up'
            if (direction !== 'up' && scrollY - lastScrollY > 10) {
                setIsVisible(false)
            } else if (direction === 'up' || scrollY < 50) {
                setIsVisible(true)
            }
            lastScrollY = scrollY > 0 ? scrollY : 0
        }

        window.addEventListener('scroll', updateScrollDirection) // add event listener
        return () => {
            window.removeEventListener('scroll', updateScrollDirection) // clean up
        }
    }, [])

    const navItems = [
        {
            name: t('navigation.home'),
            href: '/',
            icon: HomeIcon,
            activeIcon: HomeSolid
        },
        {
            name: t('common.search', 'Search'),
            action: () => setIsSearchOpen(true),
            icon: MagnifyingGlassIcon,
            activeIcon: MagnifyingGlassIcon
        },
        {
            name: t('navigation.cart'),
            href: '/cart',
            icon: ShoppingBagIcon,
            activeIcon: ShopSolid,
            badge: cartItemsCount > 0 ? cartItemsCount : null
        },
        {
            name: t('navigation.account'),
            href: isAuthenticated ? '/profile' : '/login',
            icon: UserIcon,
            activeIcon: UserSolid
        }
    ]

    return (
        <>
            <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Spacer to prevent content from hiding behind the navbar */}
            <div className="h-16 md:hidden"></div>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 pb-safe md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                    >
                        <nav className="flex items-center justify-around h-16 px-2">
                            {navItems.map((item) => {
                                const isActive = item.href ? location.pathname === item.href : isSearchOpen
                                const Icon = isActive ? item.activeIcon : item.icon

                                const content = (
                                    <div className="relative flex flex-col items-center justify-center w-full h-full space-y-1">
                                        <div className="relative">
                                            <Icon className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-gold-400' : 'text-gray-400 group-hover:text-gray-200'}`} />

                                            {/* Badge */}
                                            {item.badge !== null && item.badge !== undefined && (
                                                <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border border-gray-900 shadow-sm">
                                                    {item.badge > 9 ? '9+' : item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-medium transition-colors duration-200 font-montserrat ${isActive ? 'text-gold-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {item.name}
                                        </span>
                                    </div>
                                )

                                if (item.action) {
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={item.action}
                                            className="group flex-1 flex h-full items-center justify-center"
                                        >
                                            {content}
                                        </button>
                                    )
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href!}
                                        className="group flex-1 flex h-full items-center justify-center"
                                    >
                                        {content}
                                    </Link>
                                )
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
