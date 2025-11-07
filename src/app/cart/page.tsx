'use client';

import { useState } from 'react';
import { ArrowLeft, Minus, Plus, X, ShoppingBag, CreditCard, Truck, Shield, Gift, Tag, MapPin, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  retailer: string;
  size: string;
  color: string;
  quantity: number;
  inStock: boolean;
  estimatedDelivery: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Oversized White Cotton Shirt',
    brand: 'Everlane',
    price: 68,
    originalPrice: 85,
    image: '/hero-fashion.jpg.png',
    retailer: 'Everlane',
    size: 'M',
    color: 'White',
    quantity: 1,
    inStock: true,
    estimatedDelivery: 'Nov 12, 2025'
  },
  {
    id: '2',
    title: 'Beige Wool Coat',
    brand: 'COS',
    price: 295,
    image: '/man-beige-coat.jpg.png',
    retailer: 'COS',
    size: 'L',
    color: 'Beige',
    quantity: 1,
    inStock: true,
    estimatedDelivery: 'Nov 14, 2025'
  },
  {
    id: '3',
    title: 'Designer Jeans',
    brand: 'Citizens of Humanity',
    price: 198,
    originalPrice: 248,
    image: '/hero-fashion.jpg.png',
    retailer: 'Nordstrom',
    size: '28',
    color: 'Dark Wash',
    quantity: 2,
    inStock: true,
    estimatedDelivery: 'Nov 13, 2025'
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const shippingAddress: ShippingAddress = {
    name: 'John Doe',
    address: '123 Fashion Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'stylelink10') {
      setAppliedPromo('STYLELINK10');
      setPromoCode('');
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setAppliedPromo('WELCOME20');
      setPromoCode('');
    } else {
      // Show error state
      setPromoCode('');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  
  const promoDiscount = appliedPromo === 'STYLELINK10' ? subtotal * 0.1 : 
                       appliedPromo === 'WELCOME20' ? subtotal * 0.2 : 0;
  
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = (subtotal - promoDiscount) * 0.08875; // NY tax rate
  const total = subtotal - promoDiscount + shipping + tax;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsCheckingOut(false);
    setShowOrderSuccess(true);
  };

  if (showOrderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-bold tracking-wider">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            
            <div className="bg-card rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-medium">#SL-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium">Nov 14, 2025</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link 
                href="/profile" 
                className="bg-secondary text-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-xs sm:text-sm hover:opacity-75 transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to StyleLink</span>
              <span className="sm:hidden">Back</span>
            </Link>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-6 text-xs sm:text-sm">
              <a href="#" className="hidden md:inline hover:opacity-75 transition-opacity">WARDROBE AI</a>
              <Link href="/wishlist" className="hover:opacity-75 transition-opacity">
                <span className="hidden sm:inline">MY WISHLIST</span>
                <span className="sm:hidden">WISHLIST</span>
              </Link>
              <Link href="/contact" className="hidden sm:inline hover:opacity-75 transition-opacity">CONTACT US</Link>
              <span className="text-primary font-medium">
                <span className="hidden sm:inline">MY CART ({cartItems.length})</span>
                <span className="sm:hidden">CART ({cartItems.length})</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {cartItems.length === 0 ? (
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-primary mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start exploring our collection!
            </p>
            <Link 
              href="/search?q=fashion" 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Shopping Cart</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.brand} • {item.retailer}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span className="text-green-600">✓ In Stock</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${(item.originalPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Est. delivery: {item.estimatedDelivery}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Shipping Address */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                  </div>
                  <button className="text-primary hover:underline underline-offset-4 text-sm flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{shippingAddress.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-sm sticky top-8">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Promo Code</label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{appliedPromo} Applied</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: STYLELINK10 or WELCOME20
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Savings</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Promo Discount</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Shield className="w-4 h-4" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Gift className="w-4 h-4" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-3"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-3" />
                      Secure Checkout
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
