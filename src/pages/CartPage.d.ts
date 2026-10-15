import React from 'react';
import type { CartItem } from '../types';
interface CartPageProps {
    cart: CartItem[];
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    navigate: (path: string) => void;
}
export declare const CartPage: React.FC<CartPageProps>;
export {};
//# sourceMappingURL=CartPage.d.ts.map