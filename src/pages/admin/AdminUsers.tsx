import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  XMarkIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'
import { format } from 'date-fns'

// Automatically detect the environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://carre-sport-production.up.railway.app/api/v1'  // Production

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
  is_influencer?: boolean
  promo_code?: string
  commission_rate?: number
  customer_discount_rate?: number
  created_at: string
  last_login?: string
  total_orders?: number
  total_spent?: number
  profile?: {
    address?: string
    city?: string
    postal_code?: string
    country?: string
    date_of_birth?: string
  }
}

interface UserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userData: Partial<User>) => void
  mode: 'view' | 'edit' | 'create'
}

function UserModal({ user, isOpen, onClose, onSave, mode }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_active: true,
    is_superuser: false,
    is_verified: false
  })

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        is_verified: user.is_verified,
        is_influencer: user.is_influencer || false
      })
    } else if (mode === 'create') {
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        is_active: true,
        is_superuser: false,
        is_verified: false,
        is_influencer: false
      })
    }
  }, [user, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clean up empty strings that backend validators might reject
    const cleanedData = { ...formData }
    if (cleanedData.phone === '') {
      delete cleanedData.phone
    }

    onSave(cleanedData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 shadow-2xl relative"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-playfair">
            {mode === 'create' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">First Name *</label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={mode === 'view'}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Name *</label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={mode === 'view'}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={mode === 'view'}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={mode === 'view'}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-gold-500 outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-4 bg-gray-800/30 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider">Account Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Active Toggle */}
              <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.is_active ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800 border-white/5'}`}>
                <div>
                  <p className={`font-medium ${formData.is_active ? 'text-green-400' : 'text-gray-400'}`}>Active</p>
                  <p className="text-xs text-gray-500">Can login</p>
                </div>
                <input type="checkbox" checked={formData.is_active || false} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} disabled={mode === 'view'} className="hidden" />
                <div className={`w-4 h-4 rounded-full border ${formData.is_active ? 'bg-green-500 border-green-500' : 'border-gray-500'}`} />
              </label>

              {/* Verified Toggle */}
              <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.is_verified ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800 border-white/5'}`}>
                <div>
                  <p className={`font-medium ${formData.is_verified ? 'text-blue-400' : 'text-gray-400'}`}>Verified</p>
                  <p className="text-xs text-gray-500">Email confirmed</p>
                </div>
                <input type="checkbox" checked={formData.is_verified || false} onChange={e => setFormData({ ...formData, is_verified: e.target.checked })} disabled={mode === 'view'} className="hidden" />
                <div className={`w-4 h-4 rounded-full border ${formData.is_verified ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`} />
              </label>

              {/* Admin Toggle */}
              <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.is_superuser ? 'bg-purple-500/10 border-purple-500/30' : 'bg-gray-800 border-white/5'}`}>
                <div>
                  <p className={`font-medium ${formData.is_superuser ? 'text-purple-400' : 'text-gray-400'}`}>Admin</p>
                  <p className="text-xs text-gray-500">Superuser access</p>
                </div>
                <input type="checkbox" checked={formData.is_superuser || false} onChange={e => setFormData({ ...formData, is_superuser: e.target.checked })} disabled={mode === 'view'} className="hidden" />
                <div className={`w-4 h-4 rounded-full border ${formData.is_superuser ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`} />
              </label>

              {/* Influencer Toggle */}
              <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.is_influencer ? 'bg-pink-500/10 border-pink-500/30' : 'bg-gray-800 border-white/5'}`}>
                <div>
                  <p className={`font-medium ${formData.is_influencer ? 'text-pink-400' : 'text-gray-400'}`}>Influencer</p>
                  <p className="text-xs text-gray-500">Partner status</p>
                </div>
                <input type="checkbox" checked={formData.is_influencer || false} onChange={e => setFormData({ ...formData, is_influencer: e.target.checked })} disabled={mode === 'view'} className="hidden" />
                <div className={`w-4 h-4 rounded-full border ${formData.is_influencer ? 'bg-pink-500 border-pink-500' : 'border-gray-500'}`} />
              </label>
            </div>
          </div>

          {user && mode !== 'create' && (
            <div className="bg-gray-800/30 p-4 rounded-xl border border-white/5 text-sm">
              <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-3">Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 block">Member Since</span>
                  <span className="text-white font-medium">{format(new Date(user.created_at), 'MMM dd, yyyy')}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Last Login</span>
                  <span className="text-white font-medium">{user.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy') : 'Never'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Orders</span>
                  <span className="text-white font-medium">{user.total_orders || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Spent</span>
                  <span className="text-white font-medium font-playfair">{user.total_spent ? `${user.total_spent.toLocaleString()} MAD` : '0 MAD'}</span>
                </div>
              </div>
            </div>
          )}

          {mode !== 'view' && (
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-lg shadow-gold-500/20 transition-all active:scale-95"
              >
                {mode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  )
}

function InfluencerModal({ user, isOpen, onClose, onSave }: { user: User | null, isOpen: boolean, onClose: () => void, onSave: (userId: number, data: Partial<User>) => void }) {
  const [formData, setFormData] = useState({
    is_influencer: false,
    promo_code: '',
    commission_rate: 10,
    customer_discount_rate: 10
  })

  useEffect(() => {
    if (user) {
      setFormData({
        is_influencer: user.is_influencer || false,
        promo_code: user.promo_code || '',
        commission_rate: user.commission_rate ?? 10,
        customer_discount_rate: user.customer_discount_rate ?? 10
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      onSave(user.id, formData)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gold-500/30 shadow-2xl relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center text-gold-500">
              <StarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Influencer Settings</h2>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${formData.is_influencer ? 'bg-gold-500/10 border-gold-500/30' : 'bg-gray-800 border-white/5'}`}>
            <div>
              <p className={`font-medium ${formData.is_influencer ? 'text-gold-400' : 'text-gray-400'}`}>Influencer Status</p>
              <p className="text-xs text-gray-500">Enable dashboard and tracking</p>
            </div>
            <input type="checkbox" checked={formData.is_influencer} onChange={e => setFormData({ ...formData, is_influencer: e.target.checked })} className="hidden" />
            <div className={`w-5 h-5 rounded-full border ${formData.is_influencer ? 'bg-gold-500 border-gold-500' : 'border-gray-500'}`} />
          </label>

          {formData.is_influencer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Unique Promo Code (e.g. JB10)</label>
                <input
                  type="text"
                  value={formData.promo_code}
                  onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                  placeholder="Enter Code"
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 outline-none font-bold tracking-widest uppercase"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Commission Earned (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Paid to Influencer</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Customer Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.customer_discount_rate}
                    onChange={(e) => setFormData({ ...formData, customer_discount_rate: parseFloat(e.target.value) })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-gold-500 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Saved by Customer</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold transition-all">
              Save Influencer Settings
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'admin'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInfluencerModalOpen, setIsInfluencerModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error(`Failed to fetch users`)

      const data = await response.json()
      setUsers(data.items || data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUser = async (userData: Partial<User>) => {
    if (!token) return
    try {
      const url = modalMode === 'create'
        ? `${API_BASE_URL}/users/`
        : `${API_BASE_URL}/users/${selectedUser?.id}`

      const method = modalMode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(modalMode === 'create' ? {
          ...userData,
          password: 'temporary123!'
        } : userData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Failed to ${modalMode === 'create' ? 'create' : 'update'} user`)
      }

      await fetchUsers()
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error(`Error:`, err)
      setError(err instanceof Error ? err.message : 'Error saving user')
    }
  }

  const handleSaveInfluencerSettings = async (userId: number, data: Partial<User>) => {
    if (!token) return
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/influencer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update influencer settings')
      }

      await fetchUsers()
      setIsInfluencerModalOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error(`Error:`, err)
      setError(err instanceof Error ? err.message : 'Error updating influencer')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!token || !confirm('Are you sure?')) return
    try {
      await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      await fetchUsers()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === 'all' ? true :
        filterStatus === 'active' ? user.is_active :
          filterStatus === 'inactive' ? !user.is_active :
            filterStatus === 'admin' ? user.is_superuser : true
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const userStats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    admins: users.filter(u => u.is_superuser).length,
    verified: users.filter(u => u.is_verified).length
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-playfair text-white mb-2">Users</h1>
          <p className="text-gray-400 font-light">Manage customer accounts and roles.</p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null)
            setModalMode('create')
            setIsModalOpen(true)
          }}
          className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Error & Loading */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      )}


      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Users', value: userStats.total, icon: UserGroupIcon, color: 'blue' },
          { title: 'Active Users', value: userStats.active, icon: CheckIcon, color: 'green' },
          { title: 'Admins', value: userStats.admins, icon: ShieldCheckIcon, color: 'purple' },
          { title: 'Verified', value: userStats.verified, icon: CheckIcon, color: 'gold' }
        ].map((stat, index) => (
          <div key={index} className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.title}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
              stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-gold-500/10 text-gold-400'
              }`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-gold-500 outline-none"
          />
        </div>
        <div className="relative w-full md:w-48">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white appearance-none outline-none focus:ring-1 focus:ring-gold-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No users found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="w-full text-left text-sm hidden md:table">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 text-xs font-bold text-white">
                          {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded text-xs font-medium ${user.is_superuser ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 border border-white/10'}`}>
                          {user.is_superuser ? 'Admin' : 'Customer'}
                        </span>
                        {user.is_influencer && (
                          <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/30">
                            <StarIcon className="w-3 h-3" /> Influencer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelectedUser(user); setIsInfluencerModalOpen(true) }} title="Manage Influencer" className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors">
                          <StarIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelectedUser(user); setModalMode('edit'); setIsModalOpen(true) }} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="bg-gray-800/50 rounded-xl border border-white/5 p-4 active:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {user.is_influencer && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/30">
                        <StarIcon className="w-3 h-3" /> Influencer
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button onClick={() => { setSelectedUser(user); setIsInfluencerModalOpen(true) }} className="px-3 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-xs font-bold font-medium flex items-center gap-1 hover:bg-gold-500/20">
                      <StarIcon className="w-3.5 h-3.5" /> Promo
                    </button>
                    <button onClick={() => { setSelectedUser(user); setModalMode('edit'); setIsModalOpen(true) }} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg text-xs font-medium text-white">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-white/5 p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 hidden md:block">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
              </p>
              <div className="flex gap-2 w-full md:w-auto justify-center">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-50 hover:bg-white/5"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-50 hover:bg-white/5"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveUser}
        mode={modalMode}
      />

      <InfluencerModal
        user={selectedUser}
        isOpen={isInfluencerModalOpen}
        onClose={() => {
          setIsInfluencerModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveInfluencerSettings}
      />
    </div>
  )
}