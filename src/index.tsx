import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import PerformanceSuite from './components/PerformanceSuite'
import CriticalPerformanceOptimizer from './components/CriticalPerformanceOptimizer'

// Dynamic import for App to handle potential compilation issues
const AppWrapper = React.lazy(() => import('./App'))

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CriticalPerformanceOptimizer />
      <PerformanceSuite />
      <React.Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          background: '#1f2937',
          color: 'white',
          fontFamily: 'system-ui'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-critical" style={{ margin: '0 auto 1rem' }}></div>
            <div>Loading SetupDream...</div>
            <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              ⚡ Ultra performance mode active
            </div>
          </div>
        </div>
      }>
        <AppWrapper />
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
) 