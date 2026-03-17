import { useState, useEffect } from 'react';
import { usePageSpeed } from '../hooks/usePageSpeed';
import { useAuthStore } from '../store/authStore';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: string;
  timestamp: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const { getVitalRating } = usePageSpeed();
  const { isAuthenticated, user } = useAuthStore();

  // Only show if user is authenticated and is an admin
  const isAdmin = isAuthenticated && user?.is_superuser === true;

  useEffect(() => {
    // Only set up event listeners if user is admin
    if (!isAdmin) return;

    // Listen for web vitals events
    const handleWebVitals = (event: CustomEvent) => {
      const metric = event.detail;
      const newMetric: PerformanceMetric = {
        name: metric.name,
        value: metric.value,
        rating: getVitalRating(metric.name, metric.value),
        timestamp: Date.now()
      };
      
      setMetrics(prev => {
        const filtered = prev.filter(m => m.name !== metric.name);
        return [...filtered, newMetric];
      });
    };

    // Create a custom event listener for web vitals
    window.addEventListener('web-vitals', handleWebVitals as EventListener);

    return () => {
      window.removeEventListener('web-vitals', handleWebVitals as EventListener);
    };
  }, [getVitalRating, isAdmin]);

  // Don't render anything if user is not an admin
  if (!isAdmin) {
    return null;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatValue = (name: string, value: number) => {
    switch (name) {
      case 'CLS':
        return value.toFixed(3);
      case 'INP': // Updated for INP instead of FID
      case 'LCP':
      case 'FCP':
      case 'TTFB':
        return `${Math.round(value)}ms`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg mb-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {showMetrics ? 'Hide' : 'Show'} Performance
      </button>

      {/* Metrics Panel */}
      {showMetrics && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Core Web Vitals</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              Admin Only
            </span>
          </div>
          
          {metrics.length === 0 ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading metrics...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-medium text-gray-700">
                    {metric.name}:
                  </span>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${getRatingColor(metric.rating)}`}>
                      {formatValue(metric.name, metric.value)}
                    </span>
                    <div className={`text-xs capitalize ${getRatingColor(metric.rating)}`}>
                      {metric.rating.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between items-center">
                <span>Good:</span>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">●</span>
                  <span>Optimal</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Needs Improvement:</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">●</span>
                  <span>Fair</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Poor:</span>
                <div className="flex items-center gap-1">
                  <span className="text-red-500">●</span>
                  <span>Needs Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 