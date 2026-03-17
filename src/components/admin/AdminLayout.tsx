import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArchiveBoxIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import { useStoreSettingsStore } from '../../store/storeSettingsStore'
import WhatsAppFloating from '../WhatsAppFloating'
import DynamicFavicon from '../DynamicFavicon'
import { getImageUrl } from '../../utils/imageUrl'

interface Notification {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const { user, logout, token } = useAuthStore()
  const { settings, fetchSettings } = useStoreSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    // Mock notifications for design
    const sampleNotifications: Notification[] = [
      {
        id: 1,
        type: 'warning',
        title: 'Low Stock Alert',
        message: '5 products are running low on stock',
        time: '2 minutes ago',
        read: false
      },
      {
        id: 2,
        type: 'success',
        title: 'New Order',
        message: 'Order #ORD-123 has been placed',
        time: '15 minutes ago',
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: 'System Update',
        message: 'Dashboard analytics have been updated',
        time: '1 hour ago',
        read: true
      }
    ]
    setNotifications(sampleNotifications)
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Check if user is admin
  if (!token || !user?.is_superuser) {
    return <Navigate to="/login" replace />
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Products', href: '/admin/products', icon: CubeIcon },
    { name: 'Inventory', href: '/admin/inventory', icon: ArchiveBoxIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Influencers', href: '/admin/influencers', icon: MegaphoneIcon },
    { name: 'SEO', href: '/admin/seo', icon: GlobeAltIcon },
    { name: 'Performance', href: '/admin/performance', icon: BoltIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircleIcon
      case 'warning': return ExclamationTriangleIcon
      case 'error': return XMarkIcon
      default: return InformationCircleIcon
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-500/10'
      case 'warning': return 'text-amber-400 bg-amber-500/10'
      case 'error': return 'text-red-400 bg-red-500/10'
      default: return 'text-blue-400 bg-blue-500/10'
    }
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans selection:bg-gold-500/30">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3 group">
              {settings?.store_logo_url ? (
                <img
                  src={getImageUrl(settings.store_logo_url)}
                  alt={settings?.store_name}
                  className="w-10 h-10 object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/30 transition-all">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold font-playfair tracking-wide text-white group-hover:text-gold-400 transition-colors">
                  {settings?.store_name || 'CARRÉ'}
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Administration</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                    ? 'text-white bg-white/5 shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-y-0 left-0 w-1 bg-gold-500 rounded-r-full"
                    />
                  )}
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors duration-300 ${isActive ? 'text-gold-400' : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-sm font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.first_name || 'Admin'}
                </p>
                <p className="text-xs text-xs text-gray-500 truncate">Superuser</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-950 relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 bg-gray-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Global Search */}
            <div className="hidden md:flex items-center relative group">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 group-focus-within:text-gold-500 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border border-white/5 text-sm text-white placeholder-gray-500 rounded-full py-2.5 pl-10 pr-4 w-64 focus:w-80 focus:ring-1 focus:ring-gold-500/50 focus:bg-gray-800 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative"
              >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-900 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-96 bg-gray-900 rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden ring-1 ring-black/50"
                    >
                      <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        <span className="text-xs bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                      </div>
                      <div className="max-h-[20rem] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type)
                            return (
                              <div
                                key={notification.id}
                                className={`px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-4 ${!notification.read ? 'bg-white/[0.02]' : ''}`}
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white">{notification.title}</p>
                                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
                                  <p className="text-[10px] text-gray-500 mt-2">{notification.time}</p>
                                </div>
                                {!notification.read && <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />}
                              </div>
                            )
                          })
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                          </div>
                        )}
                      </div>
                      <Link
                        to="/admin/notifications"
                        className="block px-4 py-3 text-center text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
                        onClick={() => setShowNotifications(false)}
                      >
                        View All Activity
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile User Menu Trigger (just logout for now on mobile header) */}
            <div className="lg:hidden">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Render */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth custom-scrollbar p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <WhatsAppFloating />
      <DynamicFavicon />
    </div>
  )
}