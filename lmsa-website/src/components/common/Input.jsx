import { forwardRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  success,
  disabled = false,
  required = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-600 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`input 
            ${error ? 'border-red-600 focus:ring-red-600 pr-10' : ''} 
            ${success ? 'border-lmsa-600 focus:ring-lmsa-600 pr-10' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${className}`}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none">
            <AlertCircle size={18} />
          </div>
        )}
        {success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-lmsa-600 pointer-events-none">
            <Check size={18} />
          </div>
        )}
        {rightIcon && !error && !success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;