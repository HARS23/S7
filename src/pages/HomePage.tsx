import React from 'react';
import { Smartphone, Laptop, Headphones, ShieldCheck, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import type { Product, CategorySlug } from '../types';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { IconWell } from '../components/ui/IconWell';
import { Badge } from '../components/ui/Badge';

interface HomePageProps {
  navigate: (path: string) => void;
  addToCart: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, addToCart }) => {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured);

  const categories: Array<{ slug: CategorySlug; name: string; icon: any; count: number; desc: string }> = [
    { slug: 'phones', name: 'Smartphones', icon: Smartphone, count: 8, desc: 'Next-gen Bionic Chip flagship phones' },
    { slug: 'laptops', name: 'Laptops & Workstations', icon: Laptop, count: 8, desc: 'Ultra-thin notebooks & monster rigs' },
    { slug: 'accessories', name: 'Audio & Gear', icon: Headphones, count: 8, desc: 'ANC audio, smart watches & GaN chargers' },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-8">
        
        {/* Tactile Neumorphic Ambient Art Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full pointer-events-none opacity-40">
          <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_15px_15px_30px_rgba(163,177,198,0.7),inset_-15px_-15px_30px_rgba(255,255,255,0.7)] flex items-center justify-center p-16">
            <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[15px_15px_30px_rgba(163,177,198,0.7),-15px_-15px_30px_rgba(255,255,255,0.7)] flex items-center justify-center p-16 animate-pulseGlow">
              <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_10px_10px_20px_rgba(108,99,255,0.25),inset_-10px_-10px_20px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#3D4852] leading-[1.1]">
            Engineering Hardware for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] via-[#8B84FF] to-[#38B2AC]">
              The Next Epoch
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#6B7280] font-medium leading-relaxed">
            Experience tactile precision in tech shopping. Powered by embedded real-time graph intelligence to secure every transaction seamlessly.
          </p>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#A3B1C6]/30 pb-4">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#3D4852]">
              Explore Categories
            </h2>
            <p className="text-sm font-medium text-[#6B7280]">
              Crafted hardware built from single-material cool clay aesthetics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <NeuCard
                key={cat.slug}
                hoverable
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="cursor-pointer group relative flex flex-col justify-between h-64 p-8 transition-transform"
              >
                <div className="flex items-start justify-between">
                  <IconWell size="lg" variant="deep" className="group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-[#6C63FF]" />
                  </IconWell>
                  <Badge variant="neutral">{cat.count} Items</Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-xl text-[#3D4852] group-hover:text-[#6C63FF] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-medium text-[#6B7280] line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold font-display text-[#6C63FF]">
                  <span>Browse Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </NeuCard>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#A3B1C6]/30 pb-4">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#3D4852]">
              Featured Hardware
            </h2>
            <p className="text-sm font-medium text-[#6B7280]">
              Top rated devices with instant checkout protection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <NeuCard key={product.id} hoverable className="flex flex-col justify-between p-6 space-y-6">
              
              {/* Product Visual Container */}
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
              </div>

              {/* Specs & Info */}
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

              {/* Action Buttons */}
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
      </section>

      {/* SECURITY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <NeuCard variant="deep" className="p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="ring" size="md">Graph Fraud Engine Embedded</Badge>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#3D4852]">
              Real-time Identity & Network Protection
            </h2>
            <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
              Every order in Nimbus passes through dual parallel scoring: baseline rules combined with graph entity resolution. Multi-account fraud rings sharing hardware devices, IP addresses, or shipping hubs are caught instantly before order fulfillment.
            </p>
          </div>

          <NeuButton
            variant="accent"
            size="lg"
            onClick={() => navigate('/admin/risk')}
            icon={<ShieldCheck className="w-5 h-5" />}
          >
            Launch Risk Console
          </NeuButton>
        </NeuCard>
      </section>
    </div>
  );
};
