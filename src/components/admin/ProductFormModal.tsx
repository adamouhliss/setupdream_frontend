import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { XMarkIcon, PhotoIcon, CloudArrowUpIcon, TrashIcon, SwatchIcon, EyeIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { getImageUrl } from '../../utils/imageUrl'
import ColorPickerModal from '../ColorPickerModal'

// Types (mirrored from AdminProducts for now)
interface Category {
    id: number
    name: string
}

interface Subcategory {
    id: number
    name: string
    category_id: number
}

export interface ProductVariant {
    id?: number
    sku: string
    size: string
    color: string
    stock_quantity: number
    price_override?: number
}

export interface ProductFormData {
    name: string
    description: string
    price: number
    sale_price?: number
    sku: string
    stock_quantity: number
    category_id: number
    subcategory_id?: number
    brand: string
    sizes: string[]
    color: string
    material: string
    weight?: number
    dimensions: string
    is_active: boolean
    is_featured: boolean
    images: (File | string | null)[] // Can be File (new), string (existing URL), or null
    meta_title?: string
    meta_description?: string
    slug?: string
    variants: ProductVariant[]
}

interface ProductFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ProductFormData) => Promise<void>
    initialData?: any // Product object
    categories: Category[]
    subcategories?: Subcategory[]
}

export default function ProductFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    categories,
    subcategories = []
}: ProductFormModalProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        sku: '',
        stock_quantity: 0,
        category_id: 0,
        brand: '',
        sizes: [],
        color: '',
        material: '',
        dimensions: '',
        is_active: true,
        is_featured: false,
        images: [null, null, null],
        meta_title: '',
        meta_description: '',
        slug: '',
        variants: []
    })

    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [sizesInput, setSizesInput] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || '',
                price: initialData.price,
                sale_price: initialData.sale_price,
                sku: initialData.sku,
                stock_quantity: initialData.stock_quantity,
                category_id: initialData.category?.id || 0,
                subcategory_id: initialData.subcategory?.id,
                brand: initialData.brand || '',
                sizes: initialData.sizes || [],
                color: initialData.color || '',
                material: initialData.material || '',
                dimensions: initialData.dimensions || '',
                is_active: initialData.is_active,
                is_featured: initialData.is_featured,
                images: initialData.images ?
                    [initialData.images[0] || null, initialData.images[1] || null, initialData.images[2] || null]
                    : [null, null, null],
                meta_title: initialData.meta_title || '',
                meta_description: initialData.meta_description || '',
                slug: initialData.slug || '',
                variants: initialData.variants || []
            })
            // Initialize sizes input string from array
            setSizesInput((initialData.sizes || []).join(', '))
        } else {
            // Reset form for new product
            setFormData({
                name: '',
                description: '',
                price: 0,
                sku: '',
                stock_quantity: 0,
                category_id: 0,
                brand: '',
                sizes: [],
                color: '',
                material: '',
                dimensions: '',
                is_active: true,
                is_featured: false,
                images: [null, null, null],
                meta_title: '',
                meta_description: '',
                slug: '',
                variants: []
            })
            setSizesInput('')
        }
    }, [initialData, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Calculate total stock from variants if they exist
        let finalData = { ...formData }
        if (formData.variants.length > 0) {
            const totalStock = formData.variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
            finalData.stock_quantity = totalStock
        }

        try {
            await onSubmit(finalData)
        } finally {
            setLoading(false)
        }
    }

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                {
                    sku: `${formData.sku}-V${formData.variants.length + 1}`,
                    size: '',
                    color: formData.color || '',
                    stock_quantity: 0
                }
            ]
        })
    }

    const removeVariant = (index: number) => {
        const newVariants = [...formData.variants]
        newVariants.splice(index, 1)
        setFormData({ ...formData, variants: newVariants })
    }

    const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...formData.variants]
        newVariants[index] = { ...newVariants[index], [field]: value }
        setFormData({ ...formData, variants: newVariants })
    }

    const handleImageChange = (file: File, index: number) => {
        const newImages = [...formData.images]
        newImages[index] = file
        setFormData({ ...formData, images: newImages })
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageChange(e.dataTransfer.files[0], index)
        }
    }

    const generateSKU = () => {
        const brandPart = formData.brand ? formData.brand.substring(0, 3).toUpperCase() : 'GEN'
        const catPart = categories.find(c => c.id === formData.category_id)?.name.substring(0, 3).toUpperCase() || 'CAT'
        const colorPart = formData.color ? formData.color.substring(0, 3).toUpperCase() : 'COL'
        const randomPart = Math.floor(1000 + Math.random() * 9000)
        const newSKU = `${brandPart}-${catPart}-${colorPart}-${randomPart}`
        setFormData({ ...formData, sku: newSKU })
    }

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        setFormData({ ...formData, slug })
    }

    const handlePreview = () => {
        const previewData = {
            id: initialData?.id || 0,
            ...formData,
            category: categories.find(c => c.id === formData.category_id),
            subcategory: subcategories.find(s => s.id === (formData.subcategory_id || 0)),
            images: formData.images.map(img => {
                if (typeof img === 'string') return { image_url: img, sort_order: 0 }
                return null
            }).filter(Boolean),
            image_url: typeof formData.images[0] === 'string' ? formData.images[0] : null
        }

        try {
            localStorage.setItem('product_preview', JSON.stringify(previewData))
            window.open('/products/preview', '_blank')
        } catch (e) {
            alert('Preview failed. Content might be too large.')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="flex min-h-screen items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-5xl text-left bg-gray-900 border border-white/10 rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] transform transition-all overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gray-900/50 flex-none backdrop-blur-md z-20">
                                <h2 className="text-xl font-bold text-white font-playfair">
                                    {initialData ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/5">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden relative">
                                <div className="px-6 py-6 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                        {/* Left Column: Main Info (2 cols wide) */}
                                        <div className="lg:col-span-2 space-y-6">

                                            {/* Basic Info Card */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">General Information</h3>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                                                    <input
                                                        required
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder-gray-600"
                                                        placeholder="e.g. Elite Tactical Vest"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                                    <textarea
                                                        rows={5}
                                                        value={formData.description}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder-gray-600"
                                                        placeholder="Describe the product features, benefits, and key specs..."
                                                    />
                                                </div>
                                            </div>

                                            {/* Media Card */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Product Images</h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {[0, 1, 2].map((idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`relative aspect-square bg-gray-900 rounded-xl border-2 border-dashed transition-all overflow-hidden group ${dragActive ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/50'
                                                                }`}
                                                            onDragEnter={handleDrag}
                                                            onDragLeave={handleDrag}
                                                            onDragOver={handleDrag}
                                                            onDrop={(e) => handleDrop(e, idx)}
                                                        >
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                onChange={(e) => {
                                                                    if (e.target.files?.[0]) handleImageChange(e.target.files[0], idx)
                                                                }}
                                                                accept="image/*"
                                                            />

                                                            {formData.images[idx] ? (
                                                                <div className="relative w-full h-full">
                                                                    <img
                                                                        src={
                                                                            formData.images[idx] instanceof File
                                                                                ? URL.createObjectURL(formData.images[idx] as File)
                                                                                : getImageUrl(formData.images[idx] as string)
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                        alt={`Product ${idx + 1}`}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                                        <CloudArrowUpIcon className="w-8 h-8 text-white mb-2" />
                                                                        <span className="text-xs text-gray-200">Click or Drop to Replace</span>
                                                                    </div>
                                                                    {/* Delete Button (Optional - logic implies replacing mostly) */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            const newImages = [...formData.images]
                                                                            newImages[idx] = null
                                                                            setFormData({ ...formData, images: newImages })
                                                                        }}
                                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer pointer-events-auto"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                                                                    <PhotoIcon className="w-8 h-8 mb-2" />
                                                                    <span className="text-xs">Drag & Drop or Click</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Attributes */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Attributes</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowColorPicker(true)}
                                                            className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-left flex items-center gap-2 hover:border-gold-500/50 transition-colors"
                                                        >
                                                            {formData.color ? (
                                                                <>
                                                                    <div className={`w-4 h-4 rounded-full border border-gray-600`} style={{ backgroundColor: formData.color }} />
                                                                    <span className="text-white capitalize">{formData.color}</span>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-500">Select Color...</span>
                                                            )}
                                                            <SwatchIcon className="w-4 h-4 text-gray-500 ml-auto" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">Material</label>
                                                        <input
                                                            value={formData.material}
                                                            onChange={e => setFormData({ ...formData, material: e.target.value })}
                                                            className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                            placeholder="e.g. Nylon"
                                                        />
                                                    </div>
                                                    <div className="col-span-1 sm:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">Sizes (Comma separated)</label>
                                                        <input
                                                            value={sizesInput}
                                                            onChange={e => setSizesInput(e.target.value)}
                                                            onBlur={() => {
                                                                const parsed = sizesInput.split(',').map(s => s.trim()).filter(Boolean)
                                                                setFormData({ ...formData, sizes: parsed })
                                                            }}
                                                            className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                            placeholder="e.g. S, M, L, XL"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.weight || ''}
                                                            onChange={e => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                                                            className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">Dimensions</label>
                                                        <input
                                                            value={formData.dimensions}
                                                            onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                                            className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                            placeholder="L x W x H"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Variants */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Product Variants</h3>
                                                    <button
                                                        type="button"
                                                        onClick={addVariant}
                                                        className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded border border-white/10 transition-colors"
                                                    >
                                                        <PlusIcon className="w-4 h-4" />
                                                        Add Variant
                                                    </button>
                                                </div>

                                                {formData.variants.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left border-collapse">
                                                            <thead>
                                                                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase">
                                                                    <th className="py-2 px-2">Size</th>
                                                                    <th className="py-2 px-2">Color</th>
                                                                    <th className="py-2 px-2">SKU</th>
                                                                    <th className="py-2 px-2 w-24">Stock</th>
                                                                    <th className="py-2 px-2 w-24">Price (+/-)</th>
                                                                    <th className="py-2 px-2 w-10"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5">
                                                                {formData.variants.map((variant, idx) => (
                                                                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                                                        <td className="p-2">
                                                                            <input
                                                                                value={variant.size}
                                                                                onChange={e => updateVariant(idx, 'size', e.target.value)}
                                                                                className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-sm text-white py-1 transition-colors"
                                                                                placeholder="Size"
                                                                            />
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                value={variant.color}
                                                                                onChange={e => updateVariant(idx, 'color', e.target.value)}
                                                                                className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-sm text-white py-1 transition-colors"
                                                                                placeholder="Color"
                                                                            />
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                value={variant.sku}
                                                                                onChange={e => updateVariant(idx, 'sku', e.target.value)}
                                                                                className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-sm text-gray-300 py-1 transition-colors"
                                                                                placeholder="SKU"
                                                                            />
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                type="number"
                                                                                value={variant.stock_quantity}
                                                                                onChange={e => updateVariant(idx, 'stock_quantity', parseInt(e.target.value) || 0)}
                                                                                className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-sm text-white py-1 transition-colors"
                                                                            />
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={variant.price_override || ''}
                                                                                onChange={e => updateVariant(idx, 'price_override', e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                                className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-sm text-white py-1 transition-colors"
                                                                                placeholder="Override"
                                                                            />
                                                                        </td>
                                                                        <td className="p-2 text-right">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeVariant(idx)}
                                                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                                                            >
                                                                                <MinusIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 border border-dashed border-white/10 rounded-lg text-gray-500 text-sm">
                                                        No variants added. Product will use simple inventory.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Status & Pricing (1 col wide) */}
                                        <div className="space-y-6">

                                            {/* Status Card */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Status & Visibility</h3>

                                                <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-900 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                                    <span className="text-sm font-medium text-white">Active Product</span>
                                                    <div className={`relative w-11 h-6 transition-colors rounded-full ${formData.is_active ? 'bg-gold-500' : 'bg-gray-700'}`}>
                                                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'translate-x-5' : ''}`} />
                                                        <input type="checkbox" className="hidden" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-900 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                                    <span className="text-sm font-medium text-white">Featured Product</span>
                                                    <div className={`relative w-11 h-6 transition-colors rounded-full ${formData.is_featured ? 'bg-gold-500' : 'bg-gray-700'}`}>
                                                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_featured ? 'translate-x-5' : ''}`} />
                                                        <input type="checkbox" className="hidden" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Pricing & Stock */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Pricing & Inventory</h3>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Price (MAD)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Sale Price (Optional)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.sale_price || ''}
                                                        onChange={e => setFormData({ ...formData, sale_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
                                                    <div className="flex rounded-lg shadow-sm">
                                                        <input
                                                            required
                                                            value={formData.sku}
                                                            onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                                            className="flex-1 min-w-0 block w-full bg-gray-900 border border-white/10 rounded-l-lg px-4 py-2 text-white outline-none focus:border-gold-500 border-r-0"
                                                            placeholder="e.g. NIK-RUN-BLK-1234"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={generateSKU}
                                                            className="inline-flex items-center px-4 py-2 border border-white/10 border-l-0 rounded-r-lg bg-gray-800 text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors text-sm font-medium whitespace-nowrap"
                                                        >
                                                            Generate
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Stock Quantity</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={formData.variants.length > 0 ? formData.variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) : formData.stock_quantity}
                                                        onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                                                        disabled={formData.variants.length > 0}
                                                        className={`w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500 ${formData.variants.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    />
                                                    {formData.variants.length > 0 && (
                                                        <p className="text-xs text-gray-500 mt-1">Calculated from variants</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Categorization */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Categorization</h3>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                                                    <input
                                                        value={formData.brand}
                                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                                    <select
                                                        value={formData.category_id}
                                                        onChange={e => setFormData({ ...formData, category_id: parseInt(e.target.value), subcategory_id: undefined })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                    >
                                                        <option value={0}>Select Category...</option>
                                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Subcategory</label>
                                                    <select
                                                        value={formData.subcategory_id || ''}
                                                        onChange={e => setFormData({ ...formData, subcategory_id: e.target.value ? parseInt(e.target.value) : undefined })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500"
                                                        disabled={!formData.category_id}
                                                    >
                                                        <option value="">Select Subcategory...</option>
                                                        {subcategories
                                                            .filter(sub => sub.category_id === formData.category_id)
                                                            .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* SEO Settings */}
                                            <div className="bg-gray-800/30 p-6 rounded-xl border border-white/5 space-y-4">
                                                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">SEO Settings</h3>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Meta Title</label>
                                                    <input
                                                        value={formData.meta_title || ''}
                                                        onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500 placeholder-gray-600"
                                                        placeholder="Custom title for search engines"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Meta Description</label>
                                                    <textarea
                                                        rows={3}
                                                        value={formData.meta_description || ''}
                                                        onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                                                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500 placeholder-gray-600"
                                                        placeholder="Summary for search results..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug</label>
                                                    <div className="flex rounded-lg shadow-sm">
                                                        <input
                                                            value={formData.slug || ''}
                                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                            className="flex-1 min-w-0 block w-full bg-gray-900 border border-white/10 rounded-l-lg px-4 py-2 text-white outline-none focus:border-gold-500 placeholder-gray-600 border-r-0"
                                                            placeholder="product-url-slug"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={generateSlug}
                                                            className="inline-flex items-center px-4 py-2 border border-white/10 border-l-0 rounded-r-lg bg-gray-800 text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={!formData.name}
                                                        >
                                                            Auto
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4 bg-gray-900/50 flex-none backdrop-blur-md z-20">
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                        Preview
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-lg shadow-gold-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {loading && (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {initialData ? 'Update Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    <ColorPickerModal
                        isOpen={showColorPicker}
                        onClose={() => setShowColorPicker(false)}
                        selectedColor={formData.color}
                        onColorSelect={(color) => {
                            setFormData({ ...formData, color })
                            setShowColorPicker(false)
                        }}
                    />
                </div>
            )
            }
        </AnimatePresence>
    )
}
