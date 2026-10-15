import { useState, useEffect } from 'react';
import type { Product, CartItem, Order, FraudEngineResult, CategorySlug } from './types';
import { MOCK_PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderResultPage } from './pages/OrderResultPage';
import { RiskConsolePage } from './pages/RiskConsolePage';

const CART_STORAGE_KEY = 'nimbus_shopping_cart_v1';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [
        { product: MOCK_PRODUCTS[0], quantity: 1 }, // Seed initial item in cart for quick testing
      ];
    } catch {
      return [{ product: MOCK_PRODUCTS[0], quantity: 1 }];
    }
  });

  const [lastOrderResult, setLastOrderResult] = useState<{ order: Order; result: FraudEngineResult } | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart', e);
    }
  }, [cart]);

  // Client-side router navigation helper
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser popstate (back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Route matching logic
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} addToCart={addToCart} />;
    }

    if (currentPath.startsWith('/category/')) {
      const slug = (currentPath.replace('/category/', '') || 'phones') as CategorySlug;
      return <CategoryPage categorySlug={slug} navigate={navigate} addToCart={addToCart} />;
    }

    if (currentPath.startsWith('/product/')) {
      const id = currentPath.replace('/product/', '');
      return <ProductDetailPage productId={id} navigate={navigate} addToCart={addToCart} />;
    }

    if (currentPath === '/cart') {
      return (
        <CartPage
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/checkout') {
      return (
        <CheckoutPage
          cart={cart}
          clearCart={clearCart}
          navigate={navigate}
          setLastOrderResult={setLastOrderResult}
        />
      );
    }

    if (currentPath.startsWith('/order-result')) {
      return <OrderResultPage lastResult={lastOrderResult} navigate={navigate} />;
    }

    if (currentPath === '/admin/risk') {
      return <RiskConsolePage />;
    }

    // Default Fallback
    return <HomePage navigate={navigate} addToCart={addToCart} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E0E5EC] text-[#3D4852] font-sans selection:bg-[#6C63FF] selection:text-white">
      <Navbar currentPath={currentPath} navigate={navigate} cartCount={totalCartItemsCount} />
      
      <main className="flex-1">
        {renderRoute()}
      </main>

      <footer className="bg-[#E0E5EC] border-t border-[#A3B1C6]/30 py-8 px-4 sm:px-8 text-center text-xs font-semibold text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-display">
          <span>&copy; {new Date().getFullYear()} Nimbus Hardware Systems Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-[#6C63FF]">Storefront</button>
            <button onClick={() => navigate('/admin/risk')} className="hover:text-[#6C63FF]">Risk Console</button>
            <button onClick={() => navigate('/category/phones')} className="hover:text-[#6C63FF]">Catalog</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
