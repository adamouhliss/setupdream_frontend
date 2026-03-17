import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'

interface SessionExpiredModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function SessionExpiredModal({ isOpen, onClose, onSuccess }: SessionExpiredModalProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login, isLoading, user } = useAuthStore()

    // Pre-fill email if available
    useState(() => {
        if (user?.email) setEmail(user.email)
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            await login({ email, password })
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.')
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-gray-900 border border-red-500/20 rounded-2xl p-6 w-full max-w-md relative z-10 shadow-2xl shadow-red-900/20"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Session Expired</h2>
                            <p className="text-sm text-gray-400">Please log in again to continue. Your changes will be saved.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-gold-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-gold-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Resume Session'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
