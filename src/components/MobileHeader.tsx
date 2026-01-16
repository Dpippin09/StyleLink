'use client';

import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  currentPage?: string;
  backLink?: string;
  backText?: string;
  showCart?: boolean;
  cartCount?: number;
}

export default function MobileHeader({ 
  currentPage = '', 
  backLink = '/', 
  backText = 'Back to StyleLink',
  showCart = true,
  cartCount = 0 
}: MobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // No logout needed in demo mode
  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: '/wishlist', label: 'MY WISHLIST', current: currentPage === 'wishlist' },
    { href: '/contact', label: 'CONTACT US', current: currentPage === 'contact' },
    { href: '/demo', label: 'DEMO', current: currentPage === 'demo' },
    { href: '/profile', label: 'PROFILE', current: currentPage === 'profile' }
  ];

  const isHomePage = currentPage === 'home';

  return (
    <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button (non-home) */}
          {!isHomePage ? (
            <Link href={backLink} className="flex items-center text-xs sm:text-sm hover:opacity-75 transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{backText}</span>
              <span className="sm:hidden">Back</span>
            </Link>
          ) : (
            <div className="w-16"></div> // Spacer for layout balance
          )}
          
          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg sm:text-xl font-bold tracking-wider">
              STYL
              <span className="inline-block transform scale-x-[-1]">E</span>
              LINK
            </h1>
          </div>
          
          {/* Right Side - User Info, Cart & Hamburger Menu (All Screens) */}
          <div className="flex items-center space-x-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name || 'User'}</span>
              </div>
            )}
            {showCart && (
              <Link href="/cart" className="relative hover:opacity-75 transition-opacity">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 hover:opacity-75 transition-opacity"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Hamburger Menu Dropdown - All Screens */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-[var(--header-bg)] border-t border-white/20 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {user && (
                <div className="flex sm:hidden items-center gap-2 px-3 py-2 mb-4 bg-white/20 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.name || 'User'}</span>
                </div>
              )}
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  item.current ? (
                    <span key={item.href} className="block text-sm text-primary font-medium">
                      {item.label}
                    </span>
                  ) : item.label === 'DEMO' ? (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="inline-block bg-white/20 text-white px-3 py-2 rounded-full hover:bg-white/30 transition-colors font-medium border border-white/30 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : item.href.startsWith('http') ? (
                    <a 
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm hover:opacity-75 transition-opacity"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="block text-sm hover:opacity-75 transition-opacity"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
