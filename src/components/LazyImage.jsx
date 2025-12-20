import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage Component
 * Implements lazy loading with intersection observer for optimal performance
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  fallbackSrc = null,
  blurPlaceholder = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${placeholderClassName}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 ${
            blurPlaceholder 
              ? 'bg-slate-700 animate-pulse' 
              : 'bg-slate-800'
          }`}
        />
      )}
      
      {/* Actual Image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
        />
      )}
      
      {/* Error State */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * LazyBackground Component
 * For lazy loading background images
 */
export const LazyBackground = ({
  src,
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);

  return (
    <div
      ref={containerRef}
      className={`transition-opacity duration-500 ${className}`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        opacity: isLoaded ? 1 : 0.8
      }}
    >
      {children}
    </div>
  );
};

/**
 * useIntersectionObserver Hook
 * For custom lazy loading implementations
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options.threshold, options.rootMargin, options.root, hasIntersected]);

  return { targetRef, isIntersecting, hasIntersected };
};

/**
 * LazySection Component
 * For lazy rendering of heavy sections
 */
export const LazySection = ({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin
  });

  return (
    <div ref={targetRef} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
};

/**
 * Preload critical images
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = (srcs) => {
  return Promise.all(srcs.map(preloadImage));
};

export default LazyImage;
