'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, ExternalLink, Star, Heart } from 'lucide-react'
import Image from 'next/image'

interface RealSearchResultsProps {
  query: string
  onAddToCart?: (product: any) => void
  onToggleWishlist?: (product: any) => void
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl: string
  retailerUrl: string
  affiliate_url?: string
  retailer: string
  brand: string
  category: string
  sizes?: string[]
  colors?: string[]
  inStock: boolean
  rating?: number
  reviews?: number
  condition: 'new' | 'used' | 'refurbished'
}

export default function RealSearchResults({ query, onAddToCart, onToggleWishlist }: RealSearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})

  // Search for real products
  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/search/real?q=${encodeURIComponent(searchQuery)}&maxResults=20`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        setError(data.error || 'Search failed')
      }
    } catch (err) {
      setError('Failed to search products')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add product to StyleLink cart
  const handleAddToCart = async (product: Product) => {
    const productKey = product.id
    setAddingToCart(prev => ({ ...prev, [productKey]: true }))
    
    try {
      const selectedSize = selectedSizes[productKey]
      const selectedColor = selectedColors[productKey]
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          imageUrl: product.imageUrl,
          retailerUrl: product.retailerUrl,
          affiliate_url: product.affiliate_url,
          retailer: product.retailer,
          brand: product.brand,
          category: product.category,
          selectedSize,
          selectedColor,
          quantity: 1
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Success feedback
        alert(`${product.title} added to your StyleLink cart!`)
        
        // Call parent callback if provided
        if (onAddToCart) {
          onAddToCart(product)
        }
      } else {
        alert('Failed to add to cart: ' + data.error)
      }
      
    } catch (err) {
      alert('Failed to add to cart')
      console.error('Add to cart error:', err)
    } finally {
      setAddingToCart(prev => ({ ...prev, [productKey]: false }))
    }
  }

  // Format price with currency
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  // Auto-search when query changes
  useEffect(() => {
    if (query && query.length > 2) {
      searchProducts(query)
    }
  }, [query])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Searching real products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => searchProducts(query)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!products.length && query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No products found for "{query}"</p>
        <p className="text-sm text-muted-foreground">
          Try searching for items like "white shirt", "black dress", "sneakers", or "jeans"
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      {products.length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Found {products.length} real products for "{query}"
          </h3>
          <div className="text-sm text-muted-foreground">
            Shop through StyleLink and earn rewards
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="relative h-64 bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist?.(product)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
              
              {/* Retailer Badge */}
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 text-white text-xs rounded">
                {product.retailer}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
              <div className="mb-2">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {product.title}
                </h4>
                <p className="text-xs text-gray-500">{product.brand}</p>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating!) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviews})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Size:</label>
                  <select
                    value={selectedSizes[product.id] || ''}
                    onChange={(e) => setSelectedSizes(prev => ({
                      ...prev,
                      [product.id]: e.target.value
                    }))}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select Size</option>
                    {product.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 1 && (
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Color:</label>
                  <select
                    value={selectedColors[product.id] || product.colors[0]}
                    onChange={(e) => setSelectedColors(prev => ({
                      ...prev,
                      [product.id]: e.target.value
                    }))}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    {product.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart[product.id] || !product.inStock}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-white text-xs rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-3 h-3" />
                  {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                </button>
                
                <a
                  href={product.affiliate_url || product.retailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {!product.inStock && (
                <p className="text-xs text-red-500 mt-2 text-center">Out of Stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
