import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function LanguageDemo() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('admin.inventoryManagement')}
          </h1>
          <LanguageSwitcher />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('navigation.home')}
            </h2>
            <p className="text-gray-600">
              {t('hero.subtitle')}
            </p>
            <button className="bg-gold-600 text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition-colors">
              {t('hero.cta')}
            </button>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('cart.title')}
            </h2>
            <p className="text-gray-600">
              {t('cart.empty')}
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('cart.continueShopping')}
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('admin.productDetails')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">{t('admin.productName')}:</span>
              <p className="font-medium">Sample Product</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">{t('admin.currentStock')}:</span>
              <p className="font-medium">150 {t('admin.units')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">{t('admin.sellingPrice')}:</span>
              <p className="font-medium">500 {t('common.currency')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">{t('status.active')}:</span>
              <p className="font-medium text-green-600">{t('status.available')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 