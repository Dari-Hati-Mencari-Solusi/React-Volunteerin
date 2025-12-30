import React, { Suspense } from 'react';
import { useInView } from '../../hooks/useInView';

/**
 * Generic lazy section component
 * Untuk lazy loading section berat (Marketing, Comments, dll)
 * 
 * Props:
 * @param {ReactNode} children - Konten yang akan di-lazy load
 * @param {ReactNode} fallback - Skeleton/placeholder saat loading
 * @param {number} threshold - Threshold untuk Intersection Observer
 * @param {string} rootMargin - Root margin untuk Intersection Observer
 */
const LazySection = ({ 
  children, 
  fallback, 
  threshold = 0.1, 
  rootMargin = '100px' 
}) => {
  const { elementRef, hasBeenInView } = useInView({
    threshold,
    rootMargin,
  });

  return (
    <div ref={elementRef} className="w-full">
      {hasBeenInView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazySection;
