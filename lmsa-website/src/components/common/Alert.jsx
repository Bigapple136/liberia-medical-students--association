import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const VARIANT_STYLES = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertTriangle,
  },
  success: {
    container: 'bg-lmsa-50 border-lmsa-200 text-lmsa-800',
    icon: CheckCircle,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertCircle,
  },
};

export default function Alert({ variant = 'info', children, className = '' }) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      role="alert"
      className={`rounded-xl border p-5 ${style.container} ${className}`}
    >
      <div className="flex gap-3">
        <Icon size={20} className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
