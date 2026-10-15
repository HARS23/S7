import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const NeuCard = ({ variant = 'extruded', hoverable = false, children, className, ...props }) => {
    const variantStyles = {
        extruded: 'bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.65),-9px_-9px_16px_rgba(255,255,255,0.6)]',
        inset: 'bg-[#E0E5EC] shadow-[inset_6px_6px_10px_rgba(163,177,198,0.65),inset_-6px_-6px_10px_rgba(255,255,255,0.6)]',
        deep: 'bg-[#E0E5EC] shadow-[inset_10px_10px_20px_rgba(163,177,198,0.75),inset_-10px_-10px_20px_rgba(255,255,255,0.7)]',
        flat: 'bg-[#E0E5EC]',
    };
    const hoverStyles = hoverable
        ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[12px_12px_20px_rgba(163,177,198,0.75),-12px_-12px_20px_rgba(255,255,255,0.7)]'
        : '';
    return (_jsx("div", { className: twMerge(clsx('rounded-[32px] p-6 text-[#3D4852]', variantStyles[variant], hoverStyles, className)), ...props, children: children }));
};
//# sourceMappingURL=NeuCard.js.map