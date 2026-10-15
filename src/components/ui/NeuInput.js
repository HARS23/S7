import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const NeuInput = ({ label, error, icon, className, wrapperClassName, id, ...props }) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (_jsxs("div", { className: twMerge('flex flex-col gap-1.5 w-full', wrapperClassName), children: [label && (_jsx("label", { htmlFor: inputId, className: "text-xs font-bold font-display uppercase tracking-wider text-[#6B7280]", children: label })), _jsxs("div", { className: "relative flex items-center w-full", children: [icon && (_jsx("div", { className: "absolute left-4 text-[#6B7280] pointer-events-none flex items-center justify-center", children: icon })), _jsx("input", { id: inputId, className: twMerge(clsx('w-full h-12 bg-[#E0E5EC] text-[#3D4852] placeholder-[#A0AEC0] font-sans font-medium text-sm rounded-2xl outline-none transition-all duration-300', 'shadow-[inset_6px_6px_10px_rgba(163,177,198,0.65),inset_-6px_-6px_10px_rgba(255,255,255,0.6)]', 'focus:shadow-[inset_10px_10px_20px_rgba(163,177,198,0.75),inset_-10px_-10px_20px_rgba(255,255,255,0.7)]', 'focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]', icon ? 'pl-11 pr-4' : 'px-4', error ? 'ring-2 ring-[#E53E3E] ring-offset-2 ring-offset-[#E0E5EC]' : '', className)), ...props })] }), error && _jsx("span", { className: "text-xs font-semibold text-[#E53E3E] pl-1", children: error })] }));
};
//# sourceMappingURL=NeuInput.js.map