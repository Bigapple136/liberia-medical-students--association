const STATUS_STYLES = {
  active: 'bg-lmsa-50 text-lmsa-800',
  pending: 'bg-amber-100 text-amber-900',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-50 text-red-800',
};

/**
 * Membership status chip. Color is data (see DESIGN.md): green active,
 * amber pending, gray inactive, red suspended. A missing/unknown status
 * renders as a neutral "—" chip rather than a wrong color.
 */
export default function StatusChip({ status, className = '' }) {
  const key = typeof status === 'string' ? status.toLowerCase() : null;
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : '—';
  const style = STATUS_STYLES[key] || 'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
