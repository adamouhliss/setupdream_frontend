import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ColorPickerProps {
  selectedColor?: string
  onColorSelect: (color: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

interface ColorGroup {
  name: string
  colors: { name: string; value: string; className: string }[]
}

const colorGroups: ColorGroup[] = [
  {
    name: 'Basic Colors',
    colors: [
      { name: 'Black', value: 'black', className: 'bg-black' },
      { name: 'White', value: 'white', className: 'bg-white border-2 border-gray-300' },
      { name: 'Gray', value: 'gray', className: 'bg-gray-500' },
      { name: 'Red', value: 'red', className: 'bg-red-500' },
      { name: 'Blue', value: 'blue', className: 'bg-blue-500' },
      { name: 'Green', value: 'green', className: 'bg-green-500' },
      { name: 'Yellow', value: 'yellow', className: 'bg-yellow-500' },
      { name: 'Orange', value: 'orange', className: 'bg-orange-500' },
      { name: 'Purple', value: 'purple', className: 'bg-purple-500' },
      { name: 'Pink', value: 'pink', className: 'bg-pink-500' },
    ]
  },
  {
    name: 'Premium Colors',
    colors: [
      { name: 'Gold', value: 'gold', className: 'bg-gradient-to-r from-gold-400 to-gold-600' },
      { name: 'Silver', value: 'silver', className: 'bg-gray-400' },
      { name: 'Rose Gold', value: 'rose gold', className: 'bg-gradient-to-r from-rose-300 to-rose-500' },
      { name: 'Bronze', value: 'bronze', className: 'bg-gradient-to-r from-amber-600 to-amber-800' },
      { name: 'Copper', value: 'copper', className: 'bg-gradient-to-r from-orange-600 to-red-600' },
      { name: 'Platinum', value: 'platinum', className: 'bg-gradient-to-r from-gray-300 to-gray-500' },
    ]
  },
  {
    name: 'Blue Variations',
    colors: [
      { name: 'Light Blue', value: 'light blue', className: 'bg-blue-300' },
      { name: 'Dark Blue', value: 'dark blue', className: 'bg-blue-800' },
      { name: 'Navy', value: 'navy', className: 'bg-blue-900' },
      { name: 'Sky Blue', value: 'sky blue', className: 'bg-sky-400' },
      { name: 'Royal Blue', value: 'royal blue', className: 'bg-blue-600' },
      { name: 'Electric Blue', value: 'electric blue', className: 'bg-blue-400' },
      { name: 'Powder Blue', value: 'powder blue', className: 'bg-blue-200' },
      { name: 'Steel Blue', value: 'steel blue', className: 'bg-blue-500' },
      { name: 'Midnight Blue', value: 'midnight blue', className: 'bg-blue-950' },
      { name: 'Cyan', value: 'cyan', className: 'bg-cyan-500' },
      { name: 'Teal', value: 'teal', className: 'bg-teal-500' },
      { name: 'Turquoise', value: 'turquoise', className: 'bg-cyan-400' },
      { name: 'Aqua', value: 'aqua', className: 'bg-cyan-300' },
      { name: 'Indigo', value: 'indigo', className: 'bg-indigo-500' },
    ]
  },
  {
    name: 'Green Variations',
    colors: [
      { name: 'Light Green', value: 'light green', className: 'bg-green-300' },
      { name: 'Dark Green', value: 'dark green', className: 'bg-green-800' },
      { name: 'Forest Green', value: 'forest green', className: 'bg-green-700' },
      { name: 'Sea Green', value: 'sea green', className: 'bg-teal-600' },
      { name: 'Lime', value: 'lime', className: 'bg-lime-500' },
      { name: 'Emerald', value: 'emerald', className: 'bg-emerald-500' },
      { name: 'Mint', value: 'mint', className: 'bg-green-200' },
      { name: 'Olive', value: 'olive', className: 'bg-green-700' },
      { name: 'Sage', value: 'sage', className: 'bg-green-400' },
      { name: 'Neon Green', value: 'neon green', className: 'bg-lime-400' },
      { name: 'Jungle Green', value: 'jungle green', className: 'bg-green-600' },
      { name: 'Pine Green', value: 'pine green', className: 'bg-green-800' },
    ]
  },
  {
    name: 'Red Variations',
    colors: [
      { name: 'Light Red', value: 'light red', className: 'bg-red-300' },
      { name: 'Dark Red', value: 'dark red', className: 'bg-red-800' },
      { name: 'Maroon', value: 'maroon', className: 'bg-red-900' },
      { name: 'Burgundy', value: 'burgundy', className: 'bg-red-800' },
      { name: 'Crimson', value: 'crimson', className: 'bg-red-600' },
      { name: 'Scarlet', value: 'scarlet', className: 'bg-red-500' },
      { name: 'Cherry', value: 'cherry', className: 'bg-red-400' },
      { name: 'Wine', value: 'wine', className: 'bg-red-900' },
      { name: 'Rose', value: 'rose', className: 'bg-rose-500' },
      { name: 'Coral', value: 'coral', className: 'bg-orange-400' },
      { name: 'Salmon', value: 'salmon', className: 'bg-pink-400' },
      { name: 'Rust', value: 'rust', className: 'bg-red-700' },
    ]
  },
  {
    name: 'Pink & Purple Variations',
    colors: [
      { name: 'Light Pink', value: 'light pink', className: 'bg-pink-300' },
      { name: 'Dark Pink', value: 'dark pink', className: 'bg-pink-700' },
      { name: 'Hot Pink', value: 'hot pink', className: 'bg-pink-600' },
      { name: 'Magenta', value: 'magenta', className: 'bg-fuchsia-600' },
      { name: 'Fuchsia', value: 'fuchsia', className: 'bg-fuchsia-500' },
      { name: 'Violet', value: 'violet', className: 'bg-violet-500' },
      { name: 'Deep Purple', value: 'deep purple', className: 'bg-purple-800' },
      { name: 'Lavender', value: 'lavender', className: 'bg-purple-200' },
      { name: 'Lilac', value: 'lilac', className: 'bg-purple-300' },
      { name: 'Orchid', value: 'orchid', className: 'bg-purple-400' },
      { name: 'Plum', value: 'plum', className: 'bg-purple-600' },
      { name: 'Mauve', value: 'mauve', className: 'bg-purple-400' },
    ]
  },
  {
    name: 'Yellow & Orange Variations',
    colors: [
      { name: 'Light Yellow', value: 'light yellow', className: 'bg-yellow-300' },
      { name: 'Dark Yellow', value: 'dark yellow', className: 'bg-yellow-600' },
      { name: 'Bright Yellow', value: 'bright yellow', className: 'bg-yellow-400' },
      { name: 'Golden Yellow', value: 'golden yellow', className: 'bg-amber-400' },
      { name: 'Lemon', value: 'lemon', className: 'bg-yellow-300' },
      { name: 'Mustard', value: 'mustard', className: 'bg-yellow-700' },
      { name: 'Amber', value: 'amber', className: 'bg-amber-500' },
      { name: 'Peach', value: 'peach', className: 'bg-orange-200' },
      { name: 'Apricot', value: 'apricot', className: 'bg-orange-300' },
      { name: 'Tangerine', value: 'tangerine', className: 'bg-orange-400' },
      { name: 'Pumpkin', value: 'pumpkin', className: 'bg-orange-600' },
      { name: 'Burnt Orange', value: 'burnt orange', className: 'bg-orange-700' },
    ]
  },
  {
    name: 'Neutral & Earth Tones',
    colors: [
      { name: 'Brown', value: 'brown', className: 'bg-amber-800' },
      { name: 'Beige', value: 'beige', className: 'bg-amber-100 border-2 border-amber-300' },
      { name: 'Cream', value: 'cream', className: 'bg-amber-50 border-2 border-amber-200' },
      { name: 'Ivory', value: 'ivory', className: 'bg-yellow-50 border-2 border-yellow-200' },
      { name: 'Khaki', value: 'khaki', className: 'bg-yellow-600' },
      { name: 'Tan', value: 'tan', className: 'bg-amber-600' },
      { name: 'Taupe', value: 'taupe', className: 'bg-stone-500' },
      { name: 'Charcoal', value: 'charcoal', className: 'bg-gray-700' },
      { name: 'Slate', value: 'slate', className: 'bg-slate-500' },
      { name: 'Stone', value: 'stone', className: 'bg-stone-500' },
      { name: 'Sand', value: 'sand', className: 'bg-yellow-200' },
      { name: 'Mushroom', value: 'mushroom', className: 'bg-gray-400' },
    ]
  },
  {
    name: 'Gray Variations',
    colors: [
      { name: 'Light Gray', value: 'light gray', className: 'bg-gray-300' },
      { name: 'Dark Gray', value: 'dark gray', className: 'bg-gray-700' },
      { name: 'Medium Gray', value: 'medium gray', className: 'bg-gray-500' },
      { name: 'Ash Gray', value: 'ash gray', className: 'bg-gray-400' },
      { name: 'Smoke Gray', value: 'smoke gray', className: 'bg-gray-500' },
      { name: 'Storm Gray', value: 'storm gray', className: 'bg-gray-600' },
      { name: 'Zinc', value: 'zinc', className: 'bg-zinc-500' },
      { name: 'Neutral', value: 'neutral', className: 'bg-neutral-500' },
    ]
  },
  {
    name: 'Pastel Colors',
    colors: [
      { name: 'Pastel Pink', value: 'pastel pink', className: 'bg-pink-200' },
      { name: 'Pastel Blue', value: 'pastel blue', className: 'bg-blue-200' },
      { name: 'Pastel Green', value: 'pastel green', className: 'bg-green-200' },
      { name: 'Pastel Yellow', value: 'pastel yellow', className: 'bg-yellow-200' },
      { name: 'Pastel Purple', value: 'pastel purple', className: 'bg-purple-200' },
      { name: 'Pastel Orange', value: 'pastel orange', className: 'bg-orange-200' },
      { name: 'Pastel Mint', value: 'pastel mint', className: 'bg-green-100' },
      { name: 'Pastel Lavender', value: 'pastel lavender', className: 'bg-purple-100' },
    ]
  },
  {
    name: 'Special Colors',
    colors: [
      { name: 'Clear', value: 'clear', className: 'bg-gray-100 border-2 border-gray-300' },
      { name: 'Transparent', value: 'transparent', className: 'bg-transparent border-2 border-gray-400 border-dashed' },
      { name: 'Holographic', value: 'holographic', className: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' },
      { name: 'Iridescent', value: 'iridescent', className: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600' },
      { name: 'Metallic Silver', value: 'metallic silver', className: 'bg-gradient-to-r from-gray-400 to-gray-600' },
      { name: 'Metallic Gold', value: 'metallic gold', className: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
      { name: 'Neon Pink', value: 'neon pink', className: 'bg-pink-400' },
      { name: 'Neon Yellow', value: 'neon yellow', className: 'bg-yellow-300' },
    ]
  }
]

export default function ColorPicker({
  selectedColor,
  onColorSelect,
  size = 'md',
  className = '',
  showLabel = true
}: ColorPickerProps) {
  const [activeGroup, setActiveGroup] = useState(0)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const getSizeClass = sizeClasses[size]

  return (
    <div className={`bg-gray-800 rounded-xl p-4 border border-gray-700 ${className}`}>
      {showLabel && (
        <h3 className="text-lg font-semibold text-gray-100 mb-4 font-montserrat">
          Color Picker
        </h3>
      )}

      {/* Color Group Tabs */}
      <div className="flex overflow-x-auto mb-4 gap-2">
        {colorGroups.map((group, index) => (
          <button
            key={group.name}
            type="button"
            onClick={() => setActiveGroup(index)}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeGroup === index
                ? 'bg-gold-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {colorGroups[activeGroup].colors.map((color) => (
          <motion.button
            key={color.value}
            type="button"
            onClick={() => onColorSelect(color.value)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${getSizeClass} ${color.className} rounded-full relative flex items-center justify-center transition-all hover:shadow-lg`}
            title={color.name}
          >
            {selectedColor === color.value && (
              <CheckIcon className="w-4 h-4 text-white drop-shadow-lg" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Color Display */}
      {selectedColor && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <div className={`w-6 h-6 rounded-full ${
                colorGroups.flatMap(g => g.colors).find(c => c.value === selectedColor)?.className || 'bg-gray-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100">
                Selected: {colorGroups.flatMap(g => g.colors).find(c => c.value === selectedColor)?.name || selectedColor}
              </p>
              <p className="text-xs text-gray-400">
                Value: {selectedColor}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 