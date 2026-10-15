import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const NeuButton = ({ variant = 'secondary', size = 'md', icon, children, className, disabled, ...props }) => {
    const sizeStyles = {
        sm: 'h-10 px-4 text-xs font-semibold rounded-xl gap-1.5',
        md: 'h-12 px-6 text-sm font-semibold rounded-2xl gap-2 min-h-[44px]',
        lg: 'h-14 px-8 text-base font-bold rounded-2xl gap-2.5 min-h-[48px]',
    };
    const variantStyles = {
        primary: 'bg-[#6C63FF] text-white shadow-[6px_6px_14px_rgba(108,99,255,0.35),-6px_-6px_14px_rgba(255,255,255,0.6)] hover:bg-[#5A51E6] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.2)] focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
        secondary: 'bg-[#E0E5EC] text-[#3D4852] shadow-[5px_5px_10px_rgba(163,177,198,0.65),-5px_-5px_10px_rgba(255,255,255,0.6)] hover:shadow-[7px_7px_14px_rgba(163,177,198,0.75),-7px_-7px_14px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.75),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
        accent: 'bg-[#38B2AC] text-white shadow-[6px_6px_14px_rgba(56,178,172,0.35),-6px_-6px_14px_rgba(255,255,255,0.6)] hover:bg-[#2C9D97] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-[#38B2AC] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
        danger: 'bg-[#E53E3E] text-white shadow-[6px_6px_14px_rgba(229,62,62,0.35),-6px_-6px_14px_rgba(255,255,255,0.6)] hover:bg-[#C53030] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#E53E3E] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
        ghost: 'bg-transparent text-[#6B7280] hover:text-[#3D4852] hover:bg-black/5 rounded-xl',
    };
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none pointer-events-none' : '';
    return (_jsxs("button", { disabled: disabled, className: twMerge(clsx('inline-flex items-center justify-center font-display transition-all duration-300 ease-out select-none outline-none', sizeStyles[size], variantStyles[variant], disabledStyles, className)), ...props, children: [icon && _jsx("span", { className: "shrink-0", children: icon }), children] }));
};
//# sourceMappingURL=NeuButton.js.map