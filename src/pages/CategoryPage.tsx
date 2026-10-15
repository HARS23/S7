import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import type { Product, CategorySlug } from '../types';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInput } from '../components/ui/NeuInput';
import { Badge } from '../components/ui/Badge';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: CategorySlug;
  navigate: (path: string) => void;
  addToCart: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  navigate,
  addToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(3500);

  const categoryTitles: Record<CategorySlug, { title: string; subtitle: string }> = {
    phones: {
      title: 'Smartphones & Mobile Devices',
      subtitle: 'Neural bionic processors, titanium frames, and folding displays',
    },
    laptops: {
      title: 'Laptops & Mobile Workstations',
      subtitle: 'Extreme performance notebooks engineered for professionals',
    },
    accessories: {
      title: 'Audio, Wearables & Power',
      subtitle: 'Audiophile ANC headphones, tactile smart watches, and GaN fast chargers',
    },
  };

  const currentInfo = categoryTitles[categorySlug] || categoryTitles.phones;

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.category === categorySlug)
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((p) => p.price <= maxPrice)
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [categorySlug, searchTerm, sortBy, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 pb-20">
      
      {/* Category Header */}
      <NeuCard variant="deep" className="p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#3D4852]">
            {currentInfo.title}
          </h1>
          <p className="text-sm font-medium text-[#6B7280]">
            {currentInfo.subtitle}
          </p>
        </div>

        {/* Quick Category Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
          {(['phones', 'laptops', 'accessories'] as CategorySlug[]).map((slug) => (
            <button
              key={slug}
              onClick={() => navigate(`/category/${slug}`)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-bold capitalize transition-all ${
                categorySlug === slug
                  ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                  : 'text-[#6B7280] hover:text-[#3D4852]'
              }`}
            >
              {slug}
            </button>
          ))}
        </div>
      </NeuCard>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Search */}
        <NeuInput
          placeholder={`Search ${categorySlug}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        {/* Price Slider */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
          <SlidersHorizontal className="w-4 h-4 text-[#6C63FF] shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#6B7280]">
              <span>Max Price:</span>
              <span className="text-[#6C63FF]">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#6C63FF] cursor-pointer"
            />
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
          <ArrowUpDown className="w-4 h-4 text-[#6C63FF] shrink-0" />
          <span className="text-xs font-bold text-[#6B7280] shrink-0">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-[#3D4852] outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <NeuCard className="text-center py-16 space-y-4">
          <p className="text-lg font-bold font-display text-[#3D4852]">No products found matching your filter.</p>
          <NeuButton variant="secondary" onClick={() => { setSearchTerm(''); setMaxPrice(3500); }}>
            Reset Filters
          </NeuButton>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <NeuCard key={product.id} hoverable className="flex flex-col justify-between p-6 space-y-6">
              
              <div 
                onClick={() => navigate(`/product/${product.id}`)}
                className="cursor-pointer relative aspect-square rounded-2xl bg-[#E0E5EC] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.65),inset_-6px_-6px_12px_rgba(255,255,255,0.6)] p-4 flex items-center justify-center overflow-hidden group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="accent">${product.price}</Badge>
                </div>
                {product.stock < 20 && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="stepup" size="sm">Only {product.stock} left</Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6C63FF] font-display">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#D69E2E]">
                    ★ {product.rating} <span className="text-[#6B7280]">({product.reviewCount})</span>
                  </div>
                </div>

                <h3 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="font-display font-bold text-lg text-[#3D4852] hover:text-[#6C63FF] cursor-pointer transition-colors"
                >
                  {product.name}
                </h3>
                <p className="text-xs text-[#6B7280] font-medium line-clamp-2">
                  {product.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <NeuButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </NeuButton>
                <NeuButton
                  variant="secondary"
                  size="md"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View
                </NeuButton>
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  );
};
