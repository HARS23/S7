import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const IconWell = ({ children, size = 'md', variant = 'deep', className, }) => {
    const sizeStyles = {
        sm: 'w-10 h-10 rounded-xl text-base',
        md: 'w-14 h-14 rounded-2xl text-xl',
        lg: 'w-18 h-18 rounded-3xl text-2xl p-4',
        xl: 'w-24 h-24 rounded-4xl text-3xl p-6',
    };
    const variantStyles = {
        deep: 'bg-[#E0E5EC] text-[#6C63FF] shadow-[inset_8px_8px_16px_rgba(163,177,198,0.75),inset_-8px_-8px_16px_rgba(255,255,255,0.7)]',
        standard: 'bg-[#E0E5EC] text-[#3D4852] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.65),inset_-5px_-5px_10px_rgba(255,255,255,0.6)]',
        accent: 'bg-[#6C63FF] text-white shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25)]',
        teal: 'bg-[#E0E5EC] text-[#38B2AC] shadow-[inset_8px_8px_16px_rgba(163,177,198,0.75),inset_-8px_-8px_16px_rgba(255,255,255,0.7)]',
    };
    return (_jsx("div", { className: twMerge(clsx('inline-flex items-center justify-center shrink-0 transition-transform duration-300', sizeStyles[size], variantStyles[variant], className)), children: children }));
};
//# sourceMappingURL=IconWell.js.map