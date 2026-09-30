const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-12 w-12',
};

/**
 * Shared loading spinner (spec §4.6).
 *
 * SVG ring matching the in-button spinner in Button.jsx so every loading
 * state shares one visual language. With a `label`, the `role="status"`
 * wrapper plus visually-hidden text make the wait announce itself to
 * screen readers. Without a label it renders as a decorative icon
 * (aria-hidden, no status role) for use next to visible state text —
 * e.g. inside the cancel dialog's busy button.
 *
 * Color follows `currentColor` so the spinner adapts to its context
 * (brand green on page backgrounds, white inside danger buttons); pass
 * a text-color class when the inherited color isn't what you want.
 */
export default function Spinner({ size = 'md', label, className = '' }) {
  const svg = (
    <svg
      className={`animate-spin ${SIZE_CLASSES[size] || SIZE_CLASSES.md}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (!label) {
    return <span className={`inline-flex items-center justify-center ${className}`}>{svg}</span>;
  }

  return (
    <span role="status" className={`inline-flex items-center justify-center ${className}`}>
      {svg}
      <span className="sr-only">{label}</span>
    </span>
  );
}
