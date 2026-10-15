import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'approved' | 'stepup' | 'blocked' | 'neutral' | 'accent' | 'ring';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className,
}) => {
  const variantStyles = {
    approved: 'bg-[#38B2AC]/15 text-[#2C9D97] border border-[#38B2AC]/30 shadow-[inset_2px_2px_4px_rgba(56,178,172,0.2)]',
    stepup: 'bg-[#D69E2E]/15 text-[#B7791F] border border-[#D69E2E]/30 shadow-[inset_2px_2px_4px_rgba(214,158,46,0.2)]',
    blocked: 'bg-[#E53E3E]/15 text-[#E53E3E] border border-[#E53E3E]/30 shadow-[inset_2px_2px_4px_rgba(229,62,62,0.2)]',
    ring: 'bg-[#6C63FF]/20 text-[#6C63FF] font-bold border border-[#6C63FF]/40 shadow-[inset_2px_2px_6px_rgba(108,99,255,0.3)]',
    neutral: 'bg-[#E0E5EC] text-[#6B7280] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]',
    accent: 'bg-[#6C63FF] text-white shadow-[3px_3px_6px_rgba(108,99,255,0.3)]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold rounded-lg gap-1',
    md: 'px-3 py-1 text-xs font-bold rounded-xl gap-1.5',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-display uppercase tracking-wider select-none',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
