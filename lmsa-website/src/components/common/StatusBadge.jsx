import { MEMBERSHIP_STATUS } from '@utils/constants';

/**
 * Membership status badge (spec §4.4.2/§4.6).
 *
 * Status is always the visible *text* — color alone never carries the
 * meaning. Green on `active` is deliberate (portal spec D5: active
 * standing is the service-to-community state, so the brand green is
 * earned there); amber pending, gray inactive, red suspended per the
 * brand guide's reserved-use rule for Liberian red.
 */
const STATUS_STYLES = {
  [MEMBERSHIP_STATUS.ACTIVE]: 'bg-lmsa-50 text-lmsa-700',
  [MEMBERSHIP_STATUS.PENDING]: 'bg-amber-50 text-amber-700',
  [MEMBERSHIP_STATUS.INACTIVE]: 'bg-gray-100 text-gray-700',
  [MEMBERSHIP_STATUS.SUSPENDED]: 'bg-red-50 text-red-700',
};

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide rounded ${style} ${className}`}
    >
      {capitalize(status)}
    </span>
  );
}
