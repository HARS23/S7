import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { ShoppingBag, ShieldAlert, Smartphone, Laptop, Headphones, Menu, X, Cpu } from 'lucide-react';
import { IconWell } from './ui/IconWell';
import { Badge } from './ui/Badge';
export const Navbar = ({ currentPath, navigate, cartCount }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navItems = [
        { label: 'Home', path: '/', icon: Cpu },
        { label: 'Phones', path: '/category/phones', icon: Smartphone },
        { label: 'Laptops', path: '/category/laptops', icon: Laptop },
        { label: 'Accessories', path: '/category/accessories', icon: Headphones },
    ];
    const handleNav = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };
    return (_jsxs("header", { className: "sticky top-0 z-40 bg-[#E0E5EC]/90 backdrop-blur-md transition-all duration-300 py-4 px-4 sm:px-8 border-b border-[#E0E5EC]/50 shadow-[0_10px_20px_rgba(163,177,198,0.25)]", children: [_jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [_jsxs("div", { onClick: () => handleNav('/'), className: "flex items-center gap-3 cursor-pointer group select-none", children: [_jsx(IconWell, { size: "sm", variant: "deep", className: "group-hover:scale-105 transition-transform", children: _jsx(Cpu, { className: "w-5 h-5 text-[#6C63FF]" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { className: "font-display font-extrabold text-xl tracking-tight text-[#3D4852] flex items-center gap-1", children: ["NIMBUS", _jsx("span", { className: "w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" })] }), _jsx("span", { className: "text-[10px] font-semibold tracking-widest text-[#6B7280] uppercase -mt-1", children: "Next-Gen Store" })] })] }), _jsx("nav", { className: "hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]", children: navItems.map((item) => {
                            const isActive = currentPath === item.path;
                            const Icon = item.icon;
                            return (_jsxs("button", { onClick: () => handleNav(item.path), className: `flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-300 ${isActive
                                    ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                                    : 'text-[#6B7280] hover:text-[#3D4852]'}`, children: [_jsx(Icon, { className: `w-4 h-4 ${isActive ? 'text-[#6C63FF]' : 'text-[#6B7280]'}` }), item.label] }, item.path));
                        }) }), _jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [_jsxs("button", { onClick: () => handleNav('/admin/risk'), className: `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl transition-all duration-300 font-display text-xs font-bold ${currentPath === '/admin/risk'
                                    ? 'bg-[#6C63FF] text-white shadow-[4px_4px_10px_rgba(108,99,255,0.4)]'
                                    : 'bg-[#E0E5EC] text-[#3D4852] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)]'}`, title: "Open Fraud Analyst Dashboard", children: [_jsx(ShieldAlert, { className: `w-4 h-4 ${currentPath === '/admin/risk' ? 'text-white' : 'text-[#6C63FF]'}` }), _jsx("span", { className: "hidden sm:inline", children: "Risk Console" }), _jsx(Badge, { variant: currentPath === '/admin/risk' ? 'neutral' : 'ring', size: "sm", className: "hidden lg:inline-flex", children: "LIVE" })] }), _jsxs("button", { onClick: () => handleNav('/cart'), className: "relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E0E5EC] text-[#3D4852] shadow-[5px_5px_10px_rgba(163,177,198,0.65),-5px_-5px_10px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300", "aria-label": "Shopping Cart", children: [_jsx(ShoppingBag, { className: "w-5 h-5 text-[#3D4852]" }), cartCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 flex items-center justify-center text-[11px] font-extrabold text-white bg-[#6C63FF] rounded-full shadow-[0_2px_6px_rgba(108,99,255,0.6)] animate-bounce", children: cartCount }))] }), _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "md:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E0E5EC] text-[#3D4852] shadow-[5px_5px_10px_rgba(163,177,198,0.65),-5px_-5px_10px_rgba(255,255,255,0.6)]", "aria-label": "Toggle menu", children: mobileMenuOpen ? _jsx(X, { className: "w-5 h-5" }) : _jsx(Menu, { className: "w-5 h-5" }) })] })] }), mobileMenuOpen && (_jsx("div", { className: "md:hidden mt-4 p-4 rounded-3xl bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.65),-9px_-9px_16px_rgba(255,255,255,0.6)] flex flex-col gap-2 animate-fadeIn", children: navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;
                    return (_jsxs("button", { onClick: () => handleNav(item.path), className: `flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-display font-semibold text-sm transition-all ${isActive
                            ? 'bg-[#6C63FF] text-white shadow-md'
                            : 'text-[#3D4852] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), item.label] }, item.path));
                }) }))] }));
};
//# sourceMappingURL=Navbar.js.map