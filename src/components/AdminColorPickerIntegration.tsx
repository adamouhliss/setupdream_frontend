import ColorPicker from './ColorPicker'

// Example of how to integrate ColorPicker in AdminProducts.tsx
// Replace the color input field with this component

interface AdminColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

export default function AdminColorPickerIntegration({ selectedColor, onColorChange }: AdminColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
        Color
      </label>
      <ColorPicker
        selectedColor={selectedColor}
        onColorSelect={onColorChange}
        size="sm"
        showLabel={false}
        className="bg-gray-700 border-gray-600"
      />
    </div>
  )
}

// Instructions for AdminProducts.tsx:
// 1. Import: import ColorPicker from '../../components/ColorPicker'
// 2. Replace the color input field (around line 1403) with:
/*
<div>
  <label className="block text-sm font-medium font-montserrat text-gray-300 mb-2">
    Color
  </label>
  <ColorPicker
    selectedColor={productForm.color}
    onColorSelect={(color) => setProductForm({...productForm, color})}
    size="sm"
    showLabel={false}
    className="bg-gray-700 border-gray-600"
  />
</div>
*/ 