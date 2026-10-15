import React from 'react';
import type { Product } from '../types';
interface ProductDetailPageProps {
    productId: string;
    navigate: (path: string) => void;
    addToCart: (product: Product, quantity: number) => void;
}
export declare const ProductDetailPage: React.FC<ProductDetailPageProps>;
export {};
//# sourceMappingURL=ProductDetailPage.d.ts.map