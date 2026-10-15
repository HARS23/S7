import React from 'react';
import type { CartItem } from '../types';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInput } from '../components/ui/NeuInput';
import { IconWell } from '../components/ui/IconWell';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';

interface CartPageProps {
  cart: CartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  navigate,
}) => {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <IconWell size="xl" variant="deep" className="mx-auto">
          <ShoppingBag className="w-10 h-10 text-[#6C63FF]" />
        </IconWell>
        <h1 className="font-display font-extrabold text-3xl text-[#3D4852]">Your Shopping Cart is Empty</h1>
        <p className="text-sm font-medium text-[#6B7280]">
          Explore our collection of flagship smartphones, notebooks, and audio gear.
        </p>
        <NeuButton variant="primary" size="lg" onClick={() => navigate('/category/phones')}>
          Explore Products
        </NeuButton>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 pb-20">
      
      <div className="flex items-center justify-between border-b border-[#A3B1C6]/30 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-[#3D4852]">Shopping Cart</h1>
          <p className="text-xs font-semibold text-[#6B7280]">Review your items before proceeding to real-time checkout protection</p>
        </div>
        <NeuButton variant="ghost" size="sm" onClick={() => navigate('/')} icon={<ArrowLeft className="w-4 h-4" />}>
          Continue Shopping
        </NeuButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Line Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <NeuCard key={item.product.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] p-2 shrink-0 flex items-center justify-center">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] font-display">
                    {item.product.category}
                  </span>
                  <h3 
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className="font-display font-bold text-base text-[#3D4852] hover:text-[#6C63FF] cursor-pointer transition-colors"
                  >
                    {item.product.name}
                  </h3>
                  <div className="text-sm font-extrabold text-[#3D4852] font-display">
                    ${item.product.price} <span className="text-xs font-normal text-[#6B7280]">each</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#A3B1C6]/20">
                <div className="flex items-center gap-2 p-1 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded-lg font-bold text-sm text-[#3D4852] hover:bg-black/5 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-display font-bold text-xs text-[#3D4852]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                    className="w-8 h-8 rounded-lg font-bold text-sm text-[#3D4852] hover:bg-black/5 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="text-right font-display min-w-24">
                  <div className="text-base font-extrabold text-[#3D4852]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 rounded-xl text-[#E53E3E] hover:bg-[#E53E3E]/10 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </NeuCard>
          ))}
        </div>

        {/* Order Summary Box */}
        <NeuCard variant="deep" className="p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-extrabold text-xl text-[#3D4852]">Order Summary</h2>

          <div className="space-y-3 text-sm font-semibold text-[#6B7280]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-[#3D4852]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-[#3D4852]">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-bold text-[#38B2AC]">FREE</span>
            </div>
            
            <div className="pt-4 border-t border-[#A3B1C6]/30 flex justify-between items-baseline text-base font-display">
              <span className="font-bold text-[#3D4852]">Total Due</span>
              <span className="font-extrabold text-2xl text-[#6C63FF]">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2">
            <NeuInput
              placeholder="Promo code (e.g. NIMBUS10)"
              icon={<Tag className="w-4 h-4" />}
            />
          </div>

          <NeuButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/checkout')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Proceed to Checkout
          </NeuButton>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#6B7280] font-display">
            <ShieldCheck className="w-4 h-4 text-[#38B2AC]" />
            <span>Protected by Graph Network Screening</span>
          </div>
        </NeuCard>

      </div>
    </div>
  );
};
