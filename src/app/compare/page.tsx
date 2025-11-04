'use client';

import { useState } from 'react';
import { ArrowLeft, Share2, BarChart3, TrendingDown, TrendingUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock comparison data
const comparisonData = {
  item: "Premium Cashmere Sweater",
  category: "Sweaters",
  deals: [
    {
      store: "Nordstrom",
      price: 179,
      originalPrice: 299,
      discount: 40,
      rating: 4.8,
      reviews: 324,
      shipping: "Free",
      availability: "In Stock",
      color: "Cream",
      sizes: ["XS", "S", "M", "L", "XL"],
      url: "#"
    },
    {
      store: "Saks Fifth Avenue",
      price: 195,
      originalPrice: 299,
      discount: 35,
      rating: 4.7,
      reviews: 156,
      shipping: "Free",
      availability: "In Stock",
      color: "Cream",
      sizes: ["S", "M", "L"],
      url: "#"
    },
    {
      store: "Bloomingdale's",
      price: 209,
      originalPrice: 299,
      discount: 30,
      rating: 4.6,
      reviews: 89,
      shipping: "$9.95",
      availability: "Low Stock",
      color: "Cream",
      sizes: ["XS", "S", "M", "XL"],
      url: "#"
    },
    {
      store: "Macy's",
      price: 224,
      originalPrice: 299,
      discount: 25,
      rating: 4.5,
      reviews: 203,
      shipping: "Free over $89",
      availability: "In Stock",
      color: "Cream",
      sizes: ["S", "M", "L", "XL", "XXL"],
      url: "#"
    }
  ]
};

const priceHistory = [
  { date: "Jan", price: 299 },
  { date: "Feb", price: 285 },
  { date: "Mar", price: 270 },
  { date: "Apr", price: 250 },
  { date: "May", price: 220 },
  { date: "Jun", price: 179 },
];

export default function ComparePage() {
  const [selectedStore, setSelectedStore] = useState(0);
  const bestDeal = comparisonData.deals[0];
  const avgPrice = Math.round(comparisonData.deals.reduce((sum, deal) => sum + deal.price, 0) / comparisonData.deals.length);
  const maxSavings = Math.max(...comparisonData.deals.map(deal => deal.originalPrice - deal.price));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{comparisonData.item}</h1>
                <p className="text-sm text-muted-foreground">Comparing {comparisonData.deals.length} stores</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">${bestDeal.price}</div>
                  <div className="text-sm text-muted-foreground">Best Price</div>
                  <div className="text-xs text-green-400 flex items-center justify-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Save ${bestDeal.originalPrice - bestDeal.price}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">${avgPrice}</div>
                  <div className="text-sm text-muted-foreground">Average Price</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center mt-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Across all stores
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">${maxSavings}</div>
                  <div className="text-sm text-muted-foreground">Max Savings</div>
                  <div className="text-xs text-green-400 flex items-center justify-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    vs. Original
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Store Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Store Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonData.deals.map((deal, index) => (
                    <div 
                      key={deal.store}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedStore === index 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedStore(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{deal.store}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-accent">${deal.price}</span>
                              <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                              <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium">
                                {deal.discount}% OFF
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Shipping:</span>
                              <div className="font-medium">{deal.shipping}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Availability:</span>
                              <div className={`font-medium ${
                                deal.availability === 'In Stock' ? 'text-green-400' : 'text-yellow-400'
                              }`}>
                                {deal.availability}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Rating:</span>
                              <div className="font-medium">{deal.rating} ⭐ ({deal.reviews})</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sizes:</span>
                              <div className="font-medium">{deal.sizes.join(', ')}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(deal.url, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Deal
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Image */}
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-muted-foreground">Product Image</div>
                </div>
                <h3 className="font-semibold mb-2">{comparisonData.item}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Premium quality cashmere sweater in cream color. Soft, comfortable, and perfect for any season.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">Add to Wishlist</Button>
                  <Button variant="outline">Set Alert</Button>
                </div>
              </CardContent>
            </Card>

            {/* Price History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {priceHistory.map((point, index) => (
                    <div key={point.date} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{point.date}</span>
                      <span className="font-medium">${point.price}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-green-400 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Price dropped 40% in 6 months
                </div>
              </CardContent>
            </Card>

            {/* Similar Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Wool Blend Sweater", price: 129, store: "J.Crew" },
                    { name: "Luxury Cashmere Cardigan", price: 215, store: "Nordstrom" },
                    { name: "Merino Wool Pullover", price: 89, store: "Uniqlo" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-secondary rounded">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.store}</div>
                      </div>
                      <div className="text-sm font-medium">${item.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
