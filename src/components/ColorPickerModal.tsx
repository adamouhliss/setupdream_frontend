import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, XMarkIcon, SwatchIcon } from '@heroicons/react/24/outline'

interface ColorPickerModalProps {
  selectedColor?: string
  onColorSelect: (color: string) => void
  isOpen: boolean
  onClose: () => void
}

interface ColorGroup {
  name: string
  colors: { name: string; value: string; className: string }[]
}

const popularColors = [
  { name: 'Black', value: 'black', className: 'bg-black' },
  { name: 'White', value: 'white', className: 'bg-white border-2 border-gray-300' },
  { name: 'Red', value: 'red', className: 'bg-red-500' },
  { name: 'Blue', value: 'blue', className: 'bg-blue-500' },
  { name: 'Green', value: 'green', className: 'bg-green-500' },
  { name: 'Yellow', value: 'yellow', className: 'bg-yellow-500' },
  { name: 'Orange', value: 'orange', className: 'bg-orange-500' },
  { name: 'Purple', value: 'purple', className: 'bg-purple-500' },
  { name: 'Pink', value: 'pink', className: 'bg-pink-500' },
  { name: 'Gray', value: 'gray', className: 'bg-gray-500' },
  { name: 'Brown', value: 'brown', className: 'bg-amber-800' },
  { name: 'Gold', value: 'gold', className: 'bg-gradient-to-r from-gold-400 to-gold-600' },
]

const colorGroups: ColorGroup[] = [
  {
    name: 'Popular',
    colors: popularColors
  },
  {
    name: 'Blues',
    colors: [
      { name: 'Light Blue', value: 'light blue', className: 'bg-blue-300' },
      { name: 'Blue', value: 'blue', className: 'bg-blue-500' },
      { name: 'Dark Blue', value: 'dark blue', className: 'bg-blue-800' },
      { name: 'Navy', value: 'navy', className: 'bg-blue-900' },
      { name: 'Sky Blue', value: 'sky blue', className: 'bg-sky-400' },
      { name: 'Royal Blue', value: 'royal blue', className: 'bg-blue-600' },
      { name: 'Cyan', value: 'cyan', className: 'bg-cyan-500' },
      { name: 'Teal', value: 'teal', className: 'bg-teal-500' },
      { name: 'Turquoise', value: 'turquoise', className: 'bg-cyan-400' },
      { name: 'Indigo', value: 'indigo', className: 'bg-indigo-500' },
    ]
  },
  {
    name: 'Reds',
    colors: [
      { name: 'Light Red', value: 'light red', className: 'bg-red-300' },
      { name: 'Red', value: 'red', className: 'bg-red-500' },
      { name: 'Dark Red', value: 'dark red', className: 'bg-red-800' },
      { name: 'Maroon', value: 'maroon', className: 'bg-red-900' },
      { name: 'Crimson', value: 'crimson', className: 'bg-red-600' },
      { name: 'Cherry', value: 'cherry', className: 'bg-red-400' },
      { name: 'Rose', value: 'rose', className: 'bg-rose-500' },
      { name: 'Coral', value: 'coral', className: 'bg-orange-400' },
      { name: 'Salmon', value: 'salmon', className: 'bg-pink-400' },
      { name: 'Burgundy', value: 'burgundy', className: 'bg-red-800' },
    ]
  },
  {
    name: 'Greens',
    colors: [
      { name: 'Light Green', value: 'light green', className: 'bg-green-300' },
      { name: 'Green', value: 'green', className: 'bg-green-500' },
      { name: 'Dark Green', value: 'dark green', className: 'bg-green-800' },
      { name: 'Forest Green', value: 'forest green', className: 'bg-green-700' },
      { name: 'Lime', value: 'lime', className: 'bg-lime-500' },
      { name: 'Emerald', value: 'emerald', className: 'bg-emerald-500' },
      { name: 'Mint', value: 'mint', className: 'bg-green-200' },
      { name: 'Olive', value: 'olive', className: 'bg-green-700' },
      { name: 'Sage', value: 'sage', className: 'bg-green-400' },
      { name: 'Jungle Green', value: 'jungle green', className: 'bg-green-600' },
    ]
  },
  {
    name: 'Neutrals',
    colors: [
      { name: 'Black', value: 'black', className: 'bg-black' },
      { name: 'White', value: 'white', className: 'bg-white border-2 border-gray-300' },
      { name: 'Gray', value: 'gray', className: 'bg-gray-500' },
      { name: 'Light Gray', value: 'light gray', className: 'bg-gray-300' },
      { name: 'Dark Gray', value: 'dark gray', className: 'bg-gray-700' },
      { name: 'Charcoal', value: 'charcoal', className: 'bg-gray-800' },
      { name: 'Brown', value: 'brown', className: 'bg-amber-800' },
      { name: 'Beige', value: 'beige', className: 'bg-amber-100 border-2 border-amber-300' },
      { name: 'Tan', value: 'tan', className: 'bg-amber-600' },
      { name: 'Cream', value: 'cream', className: 'bg-amber-50 border-2 border-amber-200' },
    ]
  },
  {
    name: 'Premium',
    colors: [
      { name: 'Gold', value: 'gold', className: 'bg-gradient-to-r from-gold-400 to-gold-600' },
      { name: 'Silver', value: 'silver', className: 'bg-gray-400' },
      { name: 'Rose Gold', value: 'rose gold', className: 'bg-gradient-to-r from-rose-300 to-rose-500' },
      { name: 'Bronze', value: 'bronze', className: 'bg-gradient-to-r from-amber-600 to-amber-800' },
      { name: 'Copper', value: 'copper', className: 'bg-gradient-to-r from-orange-600 to-red-600' },
      { name: 'Platinum', value: 'platinum', className: 'bg-gradient-to-r from-gray-300 to-gray-500' },
    ]
  }
]

export default function ColorPickerModal({
  selectedColor,
  onColorSelect,
  isOpen,
  onClose
}: ColorPickerModalProps) {
  const [activeGroup, setActiveGroup] = useState(0)
  const [tempSelectedColor, setTempSelectedColor] = useState(selectedColor || '')

  const handleConfirm = () => {
    onColorSelect(tempSelectedColor)
    onClose()
  }

  const handleColorClick = (color: string) => {
    setTempSelectedColor(color)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={onClose}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-900/20 to-gold-600/20 p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SwatchIcon className="w-6 h-6 text-gold-400" />
                    <h2 className="text-xl font-bold font-playfair text-gray-100">
                      Choose Color
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected Color Preview */}
                {tempSelectedColor && (
                  <div className="mt-4 flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full ${
                        colorGroups.flatMap(g => g.colors).find(c => c.value === tempSelectedColor)?.className || 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-100">
                        {colorGroups.flatMap(g => g.colors).find(c => c.value === tempSelectedColor)?.name || tempSelectedColor}
                      </p>
                      <p className="text-xs text-gray-400">
                        Selected Color
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Color Group Tabs */}
                <div className="flex overflow-x-auto mb-6 gap-2 pb-2">
                  {colorGroups.map((group, index) => (
                    <button
                      key={group.name}
                      type="button"
                      onClick={() => setActiveGroup(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        activeGroup === index
                          ? 'bg-gold-500 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>

                {/* Color Grid */}
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-3 mb-6">
                  {colorGroups[activeGroup].colors.map((color) => (
                    <motion.button
                      key={color.value}
                      type="button"
                      onClick={() => handleColorClick(color.value)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 ${color.className} rounded-full relative flex items-center justify-center transition-all hover:shadow-lg ${
                        tempSelectedColor === color.value ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-gray-800' : ''
                      }`}
                      title={color.name}
                    >
                      {tempSelectedColor === color.value && (
                        <CheckIcon className="w-5 h-5 text-white drop-shadow-lg" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-750 p-6 border-t border-gray-700">
                <div className="flex items-center gap-4 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!tempSelectedColor}
                    className="btn-primary px-6 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select Color
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 