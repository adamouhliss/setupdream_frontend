import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

// Declare gtag function type
declare global {
  function gtag(command: string, action: string, parameters?: any): void;
}

export function usePageSpeed() {
  useEffect(() => {
    // Import web-vitals library dynamically
    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
        
        // Track Core Web Vitals
        onCLS(sendToAnalytics);
        onINP(sendToAnalytics); // Using INP instead of FID
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      } catch (error) {
        console.error('Error loading web-vitals:', error);
      }
    };

    loadWebVitals();
  }, []);

  const sendToAnalytics = (metric: WebVitalsMetric) => {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_parameter_1: metric.id,
        non_interaction: true,
      });
    }

    // Dispatch custom event for PerformanceMonitor
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('web-vitals', {
        detail: {
          name: metric.name,
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: getVitalRating(metric.name, metric.value)
        }
      });
      window.dispatchEvent(event);
    }

    // Log for debugging
    console.log('Web Vitals:', {
      name: metric.name,
      value: metric.value,
      rating: getVitalRating(metric.name, metric.value),
      delta: metric.delta,
      id: metric.id,
    });
  };

  const getVitalRating = (name: string, value: number): string => {
    const thresholds = {
      'CLS': { good: 0.1, poor: 0.25 },
      'INP': { good: 200, poor: 500 }, // Updated for INP
      'LCP': { good: 2500, poor: 4000 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  return { sendToAnalytics, getVitalRating };
} 