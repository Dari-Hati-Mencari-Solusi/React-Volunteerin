import React from 'react';
import { useLazyImage } from '../../hooks/useLazyImage';

/**
 * Komponen untuk lazy loading gambar
 * Progressive image loading dengan skeleton UI
 * 
 * Props:
 * @param {string} src - URL gambar asli
 * @param {string} alt - Alt text untuk gambar
 * @param {string} placeholder - URL gambar placeholder
 * @param {string} className - CSS classes untuk gambar
 * @param {string} skeletonClassName - CSS classes untuk skeleton
 */
const LazyImage = ({ 
  src, 
  alt, 
  placeholder, 
  className = "",
  skeletonClassName = ""
}) => {
  const { imgRef, imageSrc, isLoading } = useLazyImage(src, placeholder);

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {/* Skeleton dengan shimmer effect */}
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer ${skeletonClassName}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400 animate-pulse"
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      )}
      
      {/* Gambar dengan fade-in effect */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={(e) => {
          e.target.src = placeholder; // Fallback ke placeholder jika error
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
