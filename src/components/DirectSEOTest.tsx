import { useSEO } from '../hooks/useSEO'
import { useTranslation } from 'react-i18next'

export default function DirectSEOTest() {
  const { i18n } = useTranslation()
  
  // Test useSEO directly
  useSEO({
    title: i18n.language === 'en' ? 'Test English Title' : 'Test French Title',
    description: i18n.language === 'en' 
      ? 'This is a test English description to verify language switching'
      : 'Ceci est une description de test française pour vérifier le changement de langue',
    type: 'website'
  })

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      right: '10px',
      background: 'blue',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>Direct SEO Test Active</div>
      <div>Current Lang: {i18n.language}</div>
      <div>HTML Lang: {document.documentElement.lang}</div>
    </div>
  )
}