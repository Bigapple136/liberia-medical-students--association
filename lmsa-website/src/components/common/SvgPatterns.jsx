/**
 * SVG Pattern Library
 *
 * Lightweight, reusable SVG patterns for editorial backgrounds.
 * Each pattern is designed to complement the LMSA brand palette.
 *
 * Usage:
 *   <PatternBackground pattern="dots" color="lmsa-600" opacity={0.08} />
 *   <SectionDivider pattern="wave" color="lmsa-200" />
 */

const patterns = {
  /**
   * Uniform dot grid — clean, modern, works everywhere
   */
  dots: (id, color) => (
    <pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill={color} />
    </pattern>
  ),

  /**
   * Diagonal lines — adds movement and energy
   */
  diagonal: (id, color) => (
    <pattern id={id} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="16" stroke={color} strokeWidth="1" />
    </pattern>
  ),

  /**
   * Cross/plus grid — academic, structured feel
   */
  crosses: (id, color) => (
    <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M14 0h4v32h-4zM0 14h32v4H0z" fill={color} />
    </pattern>
  ),

  /**
   * Diamond grid — geometric, decorative
   */
  diamonds: (id, color) => (
    <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M14 0L28 14L14 28L0 14Z" fill="none" stroke={color} strokeWidth="0.75" />
    </pattern>
  ),

  /**
   * Hexagonal — scientific, medical feel
   */
  hexagons: (id, color) => (
    <pattern id={id} x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
      <path
        d="M28 0l28 16v16l-28 16L0 32V16z"
        fill="none"
        stroke={color}
        strokeWidth="0.75"
      />
    </pattern>
  ),

  /**
   * Concentric circles — soft, organic feel
   */
  circles: (id, color) => (
    <pattern id={id} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="24" r="8" fill="none" stroke={color} strokeWidth="0.75" />
      <circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="24" cy="24" r="24" fill="none" stroke={color} strokeWidth="0.25" />
    </pattern>
  ),

  /**
   * Wave — flowing, organic, great for section transitions
   */
  wave: (id, color) => (
    <pattern id={id} x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
      <path
        d="M0 10 Q25 0 50 10 T100 10"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    </pattern>
  ),

  /**
   * Grid — simple, clean, editorial
   */
  grid: (id, color) => (
    <pattern id={id} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0v40M0 40h40" fill="none" stroke={color} strokeWidth="0.5" />
    </pattern>
  ),
};

/**
 * Render an SVG pattern background.
 *
 * @param {Object} props
 * @param {'dots'|'diagonal'|'crosses'|'diamonds'|'hexagons'|'circles'|'wave'|'grid'} props.pattern
 * @param {string} [props.color='#0C8950'] - Fill/stroke color
 * @param {number} [props.opacity=0.1] - Pattern opacity (0–1)
 * @param {string} [props.className=''] - Additional classes for the wrapper
 */
export function PatternBackground({
  pattern = 'dots',
  color = '#0C8950',
  opacity = 0.1,
  className = '',
}) {
  const patternId = `pattern-${pattern}-${color.replace('#', '')}`;
  const renderPattern = patterns[pattern] || patterns.dots;

  return (
    <svg
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>{renderPattern(patternId, color)}</defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * Decorative wave divider between sections.
 *
 * @param {Object} props
 * @param {string} [props.color='#E8F7F0'] - Wave fill color
 * @param {number} [props.height=60] - SVG height
 * @param {string} [props.flip=false] - Flip vertically
 * @param {string} [props.className=''] - Additional classes
 */
export function WaveDivider({ color = '#E8F7F0', height = 60, flip = false, className = '' }) {
  return (
    <svg
      className={`block w-full ${flip ? 'rotate-180' : ''} ${className}`}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      style={{ height }}
      aria-hidden="true"
    >
      <path
        d="M0 30 Q360 0 720 30 T1440 30 V60 H0 Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Decorative corner ornament for hero sections.
 *
 * @param {Object} props
 * @param {string} [props.color='white'] - Stroke color
 * @param {string} [props.position='top-left'] - Position variant
 * @param {string} [props.className=''] - Additional classes
 */
export function CornerOrnament({ color = 'white', position = 'top-left', className = '' }) {
  const transforms = {
    'top-left': '',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)',
  };

  return (
    <svg
      className={`absolute ${className}`}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      style={{ transform: transforms[position] }}
    >
      <circle cx="60" cy="60" r="45" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <circle cx="60" cy="60" r="30" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <line x1="15" y1="60" x2="105" y2="60" stroke={color} strokeWidth="0.5" opacity="0.15" />
      <line x1="60" y1="15" x2="60" y2="105" stroke={color} strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

export default PatternBackground;
