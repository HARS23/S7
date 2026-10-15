import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import type { Product } from '../types';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { Badge } from '../components/ui/Badge';
import { ShoppingBag, ArrowLeft, ShieldCheck, Check, Star, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  navigate: (path: string) => void;
  addToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  navigate,
  addToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 pb-20">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(`/category/${product.category}`)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E0E5EC] text-[#3D4852] font-display text-xs font-bold shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] transition-all"
      >
        <ArrowLeft className="w-4 h-4 text-[#6C63FF]" />
        Back to {product.category}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Product Visual Presentation */}
        <NeuCard variant="deep" className="p-8 sm:p-12 aspect-square flex items-center justify-center relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-6 left-6">
            <Badge variant="ring">{product.category}</Badge>
          </div>
          {product.featured && (
            <div className="absolute top-6 right-6">
              <Badge variant="accent">FEATURED</Badge>
            </div>
          )}
        </NeuCard>

        {/* Product Details & Actions */}
        <div className="space-y-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-bold text-[#D69E2E]">
                <Star className="w-4 h-4 fill-current" />
                {product.rating}
              </div>
              <span className="text-xs font-semibold text-[#6B7280]">
                ({product.reviewCount} customer reviews)
              </span>
              <span className="text-xs font-bold text-[#38B2AC]">In Stock ({product.stock} units)</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#3D4852]">
              {product.name}
            </h1>

            <p className="text-base text-[#6B7280] font-medium leading-relaxed">
              {product.tagline}
            </p>

            <div className="pt-2 text-4xl font-display font-extrabold text-[#3D4852] flex items-baseline gap-2">
              ${product.price}
              <span className="text-xs font-semibold text-[#6B7280]">Free Express Delivery</span>
            </div>
          </div>

          {/* Specs Table */}
          <NeuCard variant="extruded" className="p-6 space-y-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#3D4852] border-b border-[#A3B1C6]/30 pb-2">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex flex-col p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
                  <span className="font-bold text-[#6B7280] font-display">{key}</span>
                  <span className="font-semibold text-[#3D4852]">{val}</span>
                </div>
              ))}
            </div>
          </NeuCard>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Quantity:
              </span>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl font-bold text-lg text-[#3D4852] flex items-center justify-center hover:bg-black/5"
                >
                  -
                </button>
                <span className="w-8 text-center font-display font-extrabold text-sm text-[#3D4852]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-xl font-bold text-lg text-[#3D4852] flex items-center justify-center hover:bg-black/5"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NeuButton
                variant={added ? 'accent' : 'primary'}
                size="lg"
                className="w-full"
                onClick={handleAdd}
                icon={added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              >
                {added ? 'Added to Cart!' : `Add ${quantity} to Cart — $${(product.price * quantity).toFixed(2)}`}
              </NeuButton>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#A3B1C6]/30 text-center font-display text-xs text-[#6B7280]">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-[#6C63FF]" />
              <span>Express Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-[#38B2AC]" />
              <span>Real-time Fraud Shield</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-[#6C63FF]" />
              <span>30-Day Returns</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
