import { cn } from '../../utils/cn';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  removable,
  onRemove,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        {
          'bg-surface-100 text-surface-600': variant === 'default',
          'bg-brand-50 text-brand-700': variant === 'brand',
          'bg-emerald-50 text-emerald-700': variant === 'success',
          'bg-amber-50 text-amber-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'danger',
        },
        {
          'text-xs px-2 py-0.5': size === 'sm',
          'text-sm px-2.5 py-1': size === 'md',
        },
        className
      )}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-surface-900 transition-colors"
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
