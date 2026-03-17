import { useTranslation } from 'react-i18next'

export default function LanguageDebugger() {
  const { i18n } = useTranslation()
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'red',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>i18n.language: {i18n.language}</div>
      <div>i18n.resolvedLanguage: {i18n.resolvedLanguage}</div>
      <div>HTML lang: {document.documentElement.lang}</div>
      <div>localStorage: {localStorage.getItem('i18nextLng')}</div>
    </div>
  )
}