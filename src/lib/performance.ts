// Performance optimization utilities
import React from 'react';
import { startTransition } from 'react';

// Debounce function for expensive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for frequent events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Optimized React state update wrapper
export const optimizedUpdate = (updateFn: () => void) => {
  startTransition(() => {
    updateFn();
  });
};

// Image lazy loading utility
export const createImageLoader = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const [element, setElement] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, callback, options]);

  return setElement;
};

// Resource prefetching utility
export const prefetchResource = (url: string, type: 'script' | 'style' | 'image' | 'fetch') => {
  if (typeof window === 'undefined') return;

  switch (type) {
    case 'script':
    case 'style':
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      if (type === 'style') link.as = 'style';
      if (type === 'script') link.as = 'script';
      document.head.appendChild(link);
      break;

    case 'image':
      const img = new Image();
      img.src = url;
      break;

    case 'fetch':
      fetch(url, { mode: 'no-cors' }).catch(() => {});
      break;
  }
};

// Memory management utilities
export const cleanupTimeouts = (() => {
  const timeouts: Set<NodeJS.Timeout> = new Set();
  
  return {
    add: (timeout: NodeJS.Timeout) => {
      timeouts.add(timeout);
      return timeout;
    },
    clear: () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    }
  };
})();

// Virtual scrolling helper for large lists
export const calculateVisibleItems = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex, visibleItems: endIndex - startIndex + 1 };
};

// Performance monitoring
export const performanceMonitor = {
  mark: (name: string) => {
    if (performance.mark) {
      performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  },
  
  getEntries: (type?: string) => {
    if (performance.getEntriesByType) {
      return type ? performance.getEntriesByType(type) : performance.getEntries();
    }
    return [];
  }
};