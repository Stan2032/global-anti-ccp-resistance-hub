/**
 * Performance Optimization Utilities
 * For the Global Anti-CCP Resistance Hub
 */

/**
 * Debounce function
 * Delays execution until after wait milliseconds have elapsed since last call
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * Limits execution to once per specified time period
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Memoize function
 * Caches results of expensive function calls
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Request Idle Callback polyfill
 * Schedules work during browser idle time
 */
export const requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

export const cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };

/**
 * Schedule low-priority work
 */
export const scheduleIdleWork = (callback, options = { timeout: 2000 }) => {
  return requestIdleCallback(callback, options);
};

/**
 * Chunk array processing
 * Processes large arrays in chunks to avoid blocking the main thread
 */
export const processInChunks = async (array, processor, chunkSize = 100) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(processor));
    results.push(...chunkResults);
    // Yield to the main thread
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return results;
};

/**
 * Virtual scroll helper
 * Calculates visible items for virtual scrolling
 */
export const calculateVisibleItems = ({
  scrollTop,
  containerHeight,
  itemHeight,
  totalItems,
  overscan = 3,
}) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return {
    startIndex,
    endIndex,
    visibleCount: endIndex - startIndex + 1,
    offsetTop: startIndex * itemHeight,
    totalHeight: totalItems * itemHeight,
  };
};

/**
 * Performance measurement utilities
 */
export const measurePerformance = {
  mark: (name) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },
  
  measure: (name, startMark, endMark) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        return entries[entries.length - 1]?.duration;
      } catch (e) {
        console.warn('Performance measurement failed:', e);
        return null;
      }
    }
    return null;
  },
  
  clearMarks: () => {
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks();
    }
  },
  
  clearMeasures: () => {
    if (typeof performance !== 'undefined' && performance.clearMeasures) {
      performance.clearMeasures();
    }
  },
};

/**
 * Resource hints for preloading
 */
export const addResourceHint = (href, rel = 'prefetch', as = null) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.as = as;
  document.head.appendChild(link);
  return link;
};

export const preconnect = (url) => addResourceHint(url, 'preconnect');
export const prefetch = (url, as) => addResourceHint(url, 'prefetch', as);
export const preload = (url, as) => addResourceHint(url, 'preload', as);

/**
 * Local storage with expiration
 */
export const storage = {
  set: (key, value, expirationMinutes = 60) => {
    const item = {
      value,
      expiry: Date.now() + expirationMinutes * 60 * 1000,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('localStorage set failed:', e);
    }
  },
  
  get: (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      console.warn('localStorage get failed:', e);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage remove failed:', e);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('localStorage clear failed:', e);
    }
  },
};

/**
 * Network status detection
 */
export const getNetworkStatus = () => {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const { effectiveType, downlink, rtt, saveData } = navigator.connection;
    return {
      effectiveType, // 'slow-2g', '2g', '3g', '4g'
      downlink, // Mbps
      rtt, // ms
      saveData, // boolean
      isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g',
    };
  }
  return {
    effectiveType: 'unknown',
    downlink: null,
    rtt: null,
    saveData: false,
    isSlowConnection: false,
  };
};

/**
 * Reduce motion preference detection
 */
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

/**
 * Battery status detection (for adjusting features)
 */
export const getBatteryStatus = async () => {
  if (typeof navigator !== 'undefined' && navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      return {
        charging: battery.charging,
        level: battery.level,
        isLow: battery.level < 0.2 && !battery.charging,
      };
    } catch (e) {
      return { charging: true, level: 1, isLow: false };
    }
  }
  return { charging: true, level: 1, isLow: false };
};

export default {
  debounce,
  throttle,
  memoize,
  scheduleIdleWork,
  processInChunks,
  calculateVisibleItems,
  measurePerformance,
  preconnect,
  prefetch,
  preload,
  storage,
  getNetworkStatus,
  prefersReducedMotion,
  getBatteryStatus,
};
