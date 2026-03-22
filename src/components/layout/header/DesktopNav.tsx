import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

interface DesktopNavProps {
    navigationItems: Array<{ name: string; href: string }>
}

export default function DesktopNav({ navigationItems }: DesktopNavProps) {
    const location = useLocation()

    return (
        <nav className="hidden lg:flex items-center justify-center space-x-10">
            {navigationItems.map((item) => {
                const isActive = location.pathname === item.href

                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`
              relative py-2 px-1 text-sm font-bold tracking-wider uppercase transition-colors duration-300
              ${isActive ? 'text-white' : 'text-white/80 hover:text-white'}
            `}
                    >
                        {item.name}

                        {/* Active Indicator */}
                        {isActive && (
                            <motion.span
                                layoutId="navIndicator"
                                className="absolute inset-x-0 -bottom-1 h-0.5 bg-white rounded-full"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}

                        {/* Hover Indicator (Only when not active) */}
                        {!isActive && (
                            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white/50 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100" />
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}
