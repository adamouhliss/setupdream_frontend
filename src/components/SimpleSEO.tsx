import { useTranslation } from 'react-i18next'
import { useSEO } from '../hooks/useSEO'

export default function SimpleSEO() {
  const { i18n } = useTranslation()
  
  // Debug logging
  console.log('SimpleSEO - Current language:', i18n.language)
  console.log('SimpleSEO - HTML lang before useSEO:', document.documentElement.lang)
  
  const currentLanguage = i18n.language === 'en' ? 'en' : 'fr'
  
  const seoData = {
    title: currentLanguage === 'fr' 
      ? 'SetupDream - Test Français'
      : 'SetupDream - English Test',
    description: currentLanguage === 'fr'
      ? 'Description française de test pour vérifier le changement de langue'
      : 'English test description to verify language switching',
    type: 'website' as const
  }
  
  console.log('SimpleSEO - SEO Data:', seoData)
  
  // Apply SEO
  useSEO(seoData)
  
  console.log('SimpleSEO - HTML lang after useSEO:', document.documentElement.lang)
  
  return null
}