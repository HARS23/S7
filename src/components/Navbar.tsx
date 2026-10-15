import React, { useState } from 'react';
import { ShoppingBag, ShieldAlert, Menu, X, Cpu } from 'lucide-react';
import { IconWell } from './ui/IconWell';
import { Badge } from './ui/Badge';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, cartCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Phones', path: '/category/phones' },
    { label: 'Laptops', path: '/category/laptops' },
    { label: 'Accessories', path: '/category/accessories' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#E0E5EC]/90 backdrop-blur-md transition-all duration-300 py-4 px-4 sm:px-8 border-b border-[#E0E5EC]/50 shadow-[0_10px_20px_rgba(163,177,198,0.25)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('/')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <IconWell size="sm" variant="deep" className="group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-[#6C63FF]" />
          </IconWell>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-[#3D4852] flex items-center gap-1">
              NIMBUS
              <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse"></span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-[#6B7280] uppercase -mt-1">
              Next-Gen Store
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                    : 'text-[#6B7280] hover:text-[#3D4852]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions (Cart + Risk Console) */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Risk Console Link */}
          <button
            onClick={() => handleNav('/admin/risk')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl transition-all duration-300 font-display text-xs font-bold ${
              currentPath === '/admin/risk'
                ? 'bg-[#6C63FF] text-white shadow-[4px_4px_10px_rgba(108,99,255,0.4)]'
                : 'bg-[#E0E5EC] text-[#3D4852] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)]'
            }`}
            title="Open Fraud Analyst Dashboard"
          >
            <ShieldAlert className={`w-4 h-4 ${currentPath === '/admin/risk' ? 'text-white' : 'text-[#6C63FF]'}`} />
            <span className="hidden sm:inline">Risk Console</span>
            <Badge variant={currentPath === '/admin/risk' ? 'neutral' : 'ring'} size="sm" className="hidden lg:inline-flex">
              LIVE
            </Badge>
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={() => handleNav('/cart')}
            className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E0E5EC] text-[#3D4852] shadow-[5px_5px_10px_rgba(163,177,198,0.65),-5px_-5px_10px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#3D4852]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 flex items-center justify-center text-[11px] font-extrabold text-white bg-[#6C63FF] rounded-full shadow-[0_2px_6px_rgba(108,99,255,0.6)] animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E0E5EC] text-[#3D4852] shadow-[5px_5px_10px_rgba(163,177,198,0.65),-5px_-5px_10px_rgba(255,255,255,0.6)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 p-4 rounded-3xl bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.65),-9px_-9px_16px_rgba(255,255,255,0.6)] flex flex-col gap-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center w-full px-4 py-3 rounded-2xl font-display font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-[#6C63FF] text-white shadow-md'
                    : 'text-[#3D4852] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
