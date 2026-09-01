import { useState, useCallback } from 'react';

/**
 * Photo component with lazy loading, error fallback, and optional overlay.
 *
 * When the image fails to load, it falls back to a gradient background
 * so the layout never looks broken.
 *
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} props.alt - Accessible alt text (required)
 * @param {string} [props.className=''] - Wrapper classes
 * @param {string} [props.imgClassName=''] - <img> classes
 * @param {string} [props.fallbackGradient='bg-gradient-to-br from-lmsa-900 to-lmsa-700'] - Fallback bg
 * @param {string} [props.overlay=''] - Gradient overlay class (e.g. 'bg-gradient-to-t from-black/60')
 * @param {string} [props.size='cover'] - Object-fit: 'cover' | 'contain'
 * @param {number} [props.width] - Image width (for aspect ratio)
 * @param {number} [props.height] - Image height (for aspect ratio)
 * @param {boolean} [props.loading='lazy'] - Loading strategy
 * @param {function} [props.onLoad] - Callback when image loads
 */
export default function Photo({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackGradient = 'bg-gradient-to-br from-lmsa-900 to-lmsa-700',
  overlay = '',
  size = 'cover',
  width,
  height,
  loading = 'lazy',
  onLoad,
  children,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${fallbackGradient} ${className}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          style={{ objectFit: size }}
        />
      )}
      {overlay && <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />}
      {children}
    </div>
  );
}
