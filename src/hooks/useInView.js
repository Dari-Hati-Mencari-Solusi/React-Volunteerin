import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook untuk Intersection Observer
 * Digunakan untuk lazy loading berbasis scroll/interaksi
 * 
 * @param {Object} options - Opsi untuk IntersectionObserver
 * @param {number} options.threshold - Persentase visibility (0-1)
 * @param {string} options.rootMargin - Margin untuk trigger loading (e.g., '100px')
 * @returns {Object} - { elementRef, isInView, hasBeenInView }
 */
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Tandai bahwa elemen sudah pernah terlihat
        if (entry.isIntersecting && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1, // Default: trigger ketika 10% elemen terlihat
        rootMargin: '100px', // Default: mulai load 100px sebelum terlihat
        ...options, // Override dengan options custom
      }
    );

    observer.observe(element);

    // Cleanup observer saat unmount
    return () => {
      observer.disconnect();
    };
  }, [hasBeenInView, options]);

  return { elementRef, isInView, hasBeenInView };
};
