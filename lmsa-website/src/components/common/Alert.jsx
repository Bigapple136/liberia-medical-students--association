import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

// Surfaces are defined by their fill, so each variant steps one tone off the page
// instead of drawing a 1px outline around itself.
const VARIANT_STYLES = {
  info: {
    container: 'bg-blue-100 text-blue-900',
    icon: Info,
  },
  warning: {
    container: 'bg-amber-100 text-amber-900',
    icon: AlertTriangle,
  },
  success: {
    container: 'bg-lmsa-100 text-lmsa-900',
    icon: CheckCircle,
  },
  error: {
    container: 'bg-red-100 text-red-900',
    icon: AlertCircle,
  },
};

export default function Alert({ variant = 'info', children, className = '' }) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      role="alert"
      className={`rounded-xl p-5 ${style.container} ${className}`}
    >
      <div className="flex gap-3">
        <Icon size={20} className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
