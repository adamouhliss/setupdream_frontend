import { useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ChevronRightIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../LanguageSwitcher'
import { useAuthStore } from '../../../store/authStore'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    navigationItems: Array<{ name: string; href: string }>
}

export default function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isAuthenticated, user, logout } = useAuthStore()
    const menuRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside (optional, but good UX)
    // Since we have a backdrop, the backdrop click handles it.

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleLogout = () => {
        logout()
        onClose()
        navigate('/')
    }

    const menuVariants = {
        closed: {
            x: '-100%',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        },
        open: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={menuRef}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-gray-900 border-r border-gray-800 shadow-2xl z-50 md:hidden overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-800">
                            <span className="text-xl font-black font-playfair bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                                Menu
                            </span>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-900 to-black pb-20">
                            {/* Navigation Links */}
                            <nav className="flex-1 px-6 py-8 space-y-4">
                                {navigationItems.map((item) => (
                                    <motion.div key={item.href} variants={itemVariants}>
                                        <Link
                                            to={item.href}
                                            onClick={onClose}
                                            className="flex items-center justify-between py-4 text-gray-400 hover:text-white transition-all group border-b border-gray-800/50"
                                        >
                                            <span className="font-playfair text-3xl font-bold tracking-wide group-hover:bg-gradient-to-r group-hover:from-gold-300 group-hover:to-gold-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                                {item.name}
                                            </span>
                                            <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors">
                                                <ChevronRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mt-auto p-5 border-t border-gray-800 bg-gray-900/50">
                                {/* Auth Section */}
                                {isAuthenticated && user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {user.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white font-playfair">{user.first_name || t('auth.user')}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                to="/profile"
                                                onClick={onClose}
                                                className="flex items-center justify-center gap-2 p-3 bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                {t('navigation.account')}
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center justify-center gap-2 p-3 bg-red-900/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-900/30 transition-colors border border-red-900/50"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                                {t('auth.signOut')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <Link
                                            to="/login"
                                            onClick={onClose}
                                            className="flex items-center justify-center p-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            {t('auth.signIn')}
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={onClose}
                                            className="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold hover:shadow-lg hover:shadow-gold-500/20 transition-all"
                                        >
                                            {t('auth.signUp')}
                                        </Link>
                                    </div>
                                )}

                                {/* Language Switcher */}
                                <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                                    <span className="text-sm text-gray-500 font-medium font-montserrat uppercase tracking-wider">Language</span>
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
