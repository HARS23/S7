import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInput } from '../components/ui/NeuInput';
import { Badge } from '../components/ui/Badge';
import { Search, SlidersHorizontal, ArrowUpDown, Smartphone, Laptop, Headphones } from 'lucide-react';
export const CategoryPage = ({ categorySlug, navigate, addToCart, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [maxPrice, setMaxPrice] = useState(3500);
    const categoryTitles = {
        phones: {
            title: 'Smartphones & Mobile Devices',
            subtitle: 'Neural bionic processors, titanium frames, and folding displays',
            icon: Smartphone,
        },
        laptops: {
            title: 'Laptops & Mobile Workstations',
            subtitle: 'Extreme performance notebooks engineered for professionals',
            icon: Laptop,
        },
        accessories: {
            title: 'Audio, Wearables & Power',
            subtitle: 'Audiophile ANC headphones, tactile smart watches, and GaN fast chargers',
            icon: Headphones,
        },
    };
    const currentInfo = categoryTitles[categorySlug] || categoryTitles.phones;
    const CategoryIcon = currentInfo.icon;
    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter((p) => p.category === categorySlug)
            .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter((p) => p.price <= maxPrice)
            .sort((a, b) => {
            if (sortBy === 'price-low')
                return a.price - b.price;
            if (sortBy === 'price-high')
                return b.price - a.price;
            if (sortBy === 'rating')
                return b.rating - a.rating;
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });
    }, [categorySlug, searchTerm, sortBy, maxPrice]);
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 pb-20", children: [_jsxs(NeuCard, { variant: "deep", className: "p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "space-y-2 max-w-2xl text-center md:text-left", children: [_jsxs("div", { className: "inline-flex items-center gap-2", children: [_jsx(Badge, { variant: "ring", children: categorySlug.toUpperCase() }), _jsxs("span", { className: "text-xs font-semibold text-[#6B7280]", children: [filteredProducts.length, " Products Available"] })] }), _jsxs("h1", { className: "font-display font-extrabold text-3xl sm:text-5xl text-[#3D4852] flex items-center justify-center md:justify-start gap-3", children: [_jsx(CategoryIcon, { className: "w-8 h-8 text-[#6C63FF]" }), currentInfo.title] }), _jsx("p", { className: "text-sm font-medium text-[#6B7280]", children: currentInfo.subtitle })] }), _jsx("div", { className: "flex items-center gap-2 p-1.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]", children: ['phones', 'laptops', 'accessories'].map((slug) => (_jsx("button", { onClick: () => navigate(`/category/${slug}`), className: `px-4 py-2 rounded-xl text-xs font-display font-bold capitalize transition-all ${categorySlug === slug
                                ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                                : 'text-[#6B7280] hover:text-[#3D4852]'}`, children: slug }, slug))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 items-center", children: [_jsx(NeuInput, { placeholder: `Search ${categorySlug}...`, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), icon: _jsx(Search, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-center gap-4 p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]", children: [_jsx(SlidersHorizontal, { className: "w-4 h-4 text-[#6C63FF] shrink-0" }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs font-bold text-[#6B7280]", children: [_jsx("span", { children: "Max Price:" }), _jsxs("span", { className: "text-[#6C63FF]", children: ["$", maxPrice] })] }), _jsx("input", { type: "range", min: "100", max: "3500", step: "50", value: maxPrice, onChange: (e) => setMaxPrice(Number(e.target.value)), className: "w-full accent-[#6C63FF] cursor-pointer" })] })] }), _jsxs("div", { className: "flex items-center gap-2 p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]", children: [_jsx(ArrowUpDown, { className: "w-4 h-4 text-[#6C63FF] shrink-0" }), _jsx("span", { className: "text-xs font-bold text-[#6B7280] shrink-0", children: "Sort By:" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full bg-transparent text-xs font-bold text-[#3D4852] outline-none cursor-pointer", children: [_jsx("option", { value: "featured", children: "Featured First" }), _jsx("option", { value: "price-low", children: "Price: Low to High" }), _jsx("option", { value: "price-high", children: "Price: High to Low" }), _jsx("option", { value: "rating", children: "Top Customer Rating" })] })] })] }), filteredProducts.length === 0 ? (_jsxs(NeuCard, { className: "text-center py-16 space-y-4", children: [_jsx("p", { className: "text-lg font-bold font-display text-[#3D4852]", children: "No products found matching your filter." }), _jsx(NeuButton, { variant: "secondary", onClick: () => { setSearchTerm(''); setMaxPrice(3500); }, children: "Reset Filters" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredProducts.map((product) => (_jsxs(NeuCard, { hoverable: true, className: "flex flex-col justify-between p-6 space-y-6", children: [_jsxs("div", { onClick: () => navigate(`/product/${product.id}`), className: "cursor-pointer relative aspect-square rounded-2xl bg-[#E0E5EC] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.65),inset_-6px_-6px_12px_rgba(255,255,255,0.6)] p-4 flex items-center justify-center overflow-hidden group", children: [_jsx("img", { src: product.image, alt: product.name, className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" }), _jsx("div", { className: "absolute top-3 right-3", children: _jsxs(Badge, { variant: "accent", children: ["$", product.price] }) }), product.stock < 20 && (_jsx("div", { className: "absolute bottom-3 left-3", children: _jsxs(Badge, { variant: "stepup", size: "sm", children: ["Only ", product.stock, " left"] }) }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-[#6C63FF] font-display", children: product.category }), _jsxs("div", { className: "flex items-center gap-1 text-xs font-bold text-[#D69E2E]", children: ["\u2605 ", product.rating, " ", _jsxs("span", { className: "text-[#6B7280]", children: ["(", product.reviewCount, ")"] })] })] }), _jsx("h3", { onClick: () => navigate(`/product/${product.id}`), className: "font-display font-bold text-lg text-[#3D4852] hover:text-[#6C63FF] cursor-pointer transition-colors", children: product.name }), _jsx("p", { className: "text-xs text-[#6B7280] font-medium line-clamp-2", children: product.tagline })] }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(NeuButton, { variant: "primary", size: "md", className: "w-full", onClick: () => addToCart(product), children: "Add to Cart" }), _jsx(NeuButton, { variant: "secondary", size: "md", onClick: () => navigate(`/product/${product.id}`), children: "View" })] })] }, product.id))) }))] }));
};
//# sourceMappingURL=CategoryPage.js.map