'use client';

import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';

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
  cartCount = 3 
}: MobileHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '#', label: 'WARDROBE AI', current: currentPage === 'wardrobe' },
    { href: '/wishlist', label: 'MY WISHLIST', current: currentPage === 'wishlist' },
    { href: '/contact', label: 'CONTACT US', current: currentPage === 'contact' },
    { href: '/demo', label: 'DEMO', current: currentPage === 'demo' },
    { href: '/auth', label: 'LOG IN', current: currentPage === 'auth' }
  ];

  const isHomePage = currentPage === 'home';

  return (
    <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button (non-home) or Mobile Demo Link (home) */}
          {!isHomePage ? (
            <Link href={backLink} className="flex items-center text-xs sm:text-sm hover:opacity-75 transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{backText}</span>
              <span className="sm:hidden">Back</span>
            </Link>
          ) : (
            <div className="flex md:hidden items-center space-x-2 text-xs">
              <Link href="/wishlist" className="hover:opacity-75 transition-opacity">WISHLIST</Link>
              <Link href="/demo" className="bg-white/20 text-white px-2 py-1 rounded-full hover:bg-white/30 transition-colors font-medium border border-white/30">
                DEMO
              </Link>
            </div>
          )}
          
          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg sm:text-xl font-bold tracking-wider">
              STYL
              <span className="inline-block transform scale-x-[-1]">E</span>
              LINK
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {menuItems.map((item) => (
              item.current ? (
                <span key={item.href} className="text-primary font-medium">
                  {item.label}
                </span>
              ) : item.label === 'DEMO' ? (
                <Link key={item.href} href={item.href} className="bg-white/20 text-white px-3 py-1 rounded-full hover:bg-white/30 transition-colors font-medium border border-white/30">
                  {item.label}
                </Link>
              ) : (
                <Link key={item.href} href={item.href} className="hover:opacity-75 transition-opacity">
                  {item.label}
                </Link>
              )
            ))}
            {showCart && (
              <Link href="/cart" className="relative hover:opacity-75 transition-opacity">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center space-x-2">
            {showCart && (
              <Link href="/cart" className="relative hover:opacity-75 transition-opacity">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
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

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-[var(--header-bg)] border-t border-white/20 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
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
