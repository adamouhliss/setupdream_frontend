import { ShoppingCartIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline'

interface HeaderIconsProps {
    cartCount: number
    onCartClick: () => void
    onUserClick: () => void
    isAuthenticated: boolean
    userInitial?: string
}

export default function HeaderIcons({
    cartCount,
    onCartClick,
    onUserClick,
    isAuthenticated,
    userInitial
}: HeaderIconsProps) {
    return (
        <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist (Mockup for now) */}
            <button
                className="hidden sm:flex p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors relative group"
                aria-label="Wishlist"
            >
                <HeartIcon className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* User */}
            <button
                onClick={onUserClick}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300 group"
                aria-label={isAuthenticated ? "Account" : "Login"}
            >
                {isAuthenticated && userInitial ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-primary-500/20">
                        {userInitial}
                    </div>
                ) : (
                    <UserIcon className="w-6 h-6" />
                )}
            </button>

            {/* Cart */}
            <button
                onClick={onCartClick}
                className="relative p-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-full transition-all duration-300 group"
                aria-label={`Cart (${cartCount} items)`}
            >
                <ShoppingCartIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900 shadow-sm animate-pulse-slow">
                        {cartCount}
                    </span>
                )}
            </button>
        </div>
    )
}
