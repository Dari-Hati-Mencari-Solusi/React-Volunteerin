import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook untuk lazy loading gambar
 * Menggunakan Intersection Observer untuk memuat gambar saat terlihat di viewport
 * 
 * @param {string} src - URL gambar asli
 * @param {string} placeholder - URL gambar placeholder
 * @returns {Object} - { imgRef, imageSrc, isLoading, hasError }
 */
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    const imgElement = imgRef.current;

    if (imgElement) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Mulai load gambar asli
              const img = new Image();
              img.src = src;
              
              img.onload = () => {
                setImageSrc(src);
                setIsLoading(false);
              };
              
              img.onerror = () => {
                setHasError(true);
                setIsLoading(false);
                setImageSrc(placeholder); // Fallback ke placeholder
              };
              
              // Stop observing setelah load dimulai
              observer.unobserve(imgElement);
            }
          });
        },
        {
          rootMargin: '50px', // Mulai load 50px sebelum terlihat
        }
      );

      observer.observe(imgElement);
    }

    return () => {
      if (observer && imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src, placeholder]);

  return { imgRef, imageSrc, isLoading, hasError };
};
