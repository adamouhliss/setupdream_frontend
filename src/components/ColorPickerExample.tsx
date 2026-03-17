import { useState } from 'react'
import ColorPicker from './ColorPicker'

export default function ColorPickerExample() {
  const [selectedColor, setSelectedColor] = useState<string>('blue')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Color Picker Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Picker */}
          <ColorPicker
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            size="md"
            showLabel={true}
          />
          
          {/* Preview */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Preview
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Selected Color:</span>
                <div className="w-12 h-12 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full ${
                    selectedColor === 'black' ? 'bg-black' :
                    selectedColor === 'white' ? 'bg-white border-2 border-gray-300' :
                    selectedColor === 'gold' ? 'bg-gradient-to-r from-gold-400 to-gold-600' :
                    selectedColor === 'silver' ? 'bg-gray-400' :
                    'bg-blue-500'
                  }`} />
                </div>
                <span className="text-gray-100 font-medium capitalize">
                  {selectedColor}
                </span>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300">
                  Use this color picker in your product forms, theme settings, or anywhere you need color selection!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 