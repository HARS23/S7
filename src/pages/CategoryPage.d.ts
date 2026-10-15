import React from 'react';
import type { Product, CategorySlug } from '../types';
interface CategoryPageProps {
    categorySlug: CategorySlug;
    navigate: (path: string) => void;
    addToCart: (product: Product) => void;
}
export declare const CategoryPage: React.FC<CategoryPageProps>;
export {};
//# sourceMappingURL=CategoryPage.d.ts.map