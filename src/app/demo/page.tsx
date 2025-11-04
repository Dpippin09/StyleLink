'use client';

import { useState } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Filter, Grid, List, Bell, Settings, User, Camera, MapPin, Calendar, TrendingUp, Award, Target, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock user data
const demoUser = {
  name: "Emma Chen",
  username: "@emmastyle",
  bio: "Fashion enthusiast & sustainable style advocate. Curating timeless pieces for the modern woman.",
  followers: "12.3K",
  following: "892",
  savedItems: "156",
  location: "New York, NY",
  joinDate: "March 2023",
  styleScore: 94,
  topBrands: ["Everlane", "Reformation", "COS", "& Other Stories"],
  avatar: "/demo-avatar.jpg"
};

// Mock wardrobe data
const wardrobeItems = [
  { id: 1, name: "Oversized Blazer", brand: "Everlane", price: "$168", image: "/demo-blazer.jpg", category: "Outerwear", worn: 12, favorite: true },
  { id: 2, name: "Silk Midi Dress", brand: "Reformation", price: "$248", image: "/demo-dress.jpg", category: "Dresses", worn: 8, favorite: false },
  { id: 3, name: "White Button Shirt", brand: "COS", price: "$89", image: "/demo-shirt.jpg", category: "Tops", worn: 24, favorite: true },
  { id: 4, name: "High-Waist Jeans", brand: "Everlane", price: "$98", image: "/demo-jeans.jpg", category: "Bottoms", worn: 18, favorite: false },
  { id: 5, name: "Cashmere Sweater", brand: "Everlane", price: "$138", image: "/demo-sweater.jpg", category: "Knitwear", worn: 15, favorite: true },
  { id: 6, name: "Leather Ankle Boots", brand: "Everlane", price: "$225", image: "/demo-boots.jpg", category: "Shoes", worn: 22, favorite: true }
];

// Mock recommendations
const recommendations = [
  { id: 1, name: "Cropped Cardigan", brand: "& Other Stories", price: "$65", image: "/rec-cardigan.jpg", match: "95%" },
  { id: 2, name: "Wide-Leg Trousers", brand: "COS", price: "$119", image: "/rec-trousers.jpg", match: "92%" },
  { id: 3, name: "Minimalist Watch", brand: "MVMT", price: "$125", image: "/rec-watch.jpg", match: "89%" }
];

// Mock analytics data
const styleAnalytics = {
  mostWornCategory: "Tops",
  avgPricePerItem: "$142",
  sustainabilityScore: 87,
  costPerWear: "$8.50",
  monthlySpend: "$284"
};

export default function DemoProfile() {
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Knitwear'];
  
  const filteredItems = selectedCategory === 'all' 
    ? wardrobeItems 
    : wardrobeItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[var(--header-bg)] text-[var(--header-text)] py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-sm hover:opacity-75 transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to StyleLink
            </Link>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-bold tracking-wider">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">DEMO MODE</span>
              <Bell className="w-5 h-5" />
              <Settings className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-card rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary mb-1">{demoUser.name}</h1>
                  <p className="text-muted-foreground mb-2">{demoUser.username}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {demoUser.location}
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {demoUser.joinDate}
                  </div>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Edit Profile
                </button>
              </div>
              
              <p className="text-foreground mb-4 max-w-2xl">{demoUser.bio}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{demoUser.followers}</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{demoUser.following}</p>
                  <p className="text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{demoUser.savedItems}</p>
                  <p className="text-muted-foreground">Saved Items</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{demoUser.styleScore}</p>
                  <p className="text-muted-foreground">Style Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for any product across hundreds of retailers..."
                className="w-full px-6 py-4 rounded-full border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-secondary rounded-full transition-colors">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {searchTerm && (
              <div className="mt-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Searching for "{searchTerm}" across all retailers...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-border mb-8">
          {[
            { id: 'wardrobe', label: 'My Wardrobe', icon: ShoppingBag },
            { id: 'recommendations', label: 'For You', icon: Target },
            { id: 'analytics', label: 'Style Analytics', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'wardrobe' && (
          <div>
            {/* Wardrobe Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-input border border-border rounded-lg px-3 py-1 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Items' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wardrobe Items */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredItems.map((item) => (
                <div key={item.id} className={viewMode === 'grid' 
                  ? "group cursor-pointer" 
                  : "flex items-center space-x-4 p-4 bg-card rounded-lg"
                }>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3 relative">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <p className="text-xs">{item.name}</p>
                        </div>
                        <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className={`w-4 h-4 ${item.favorite ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                          Worn {item.worn}x
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-primary mb-1">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                        <p className="text-sm font-semibold text-primary">{item.price}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-20 bg-secondary rounded-lg flex items-center justify-center">
                        <p className="text-xs text-center">{item.name}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <p className="text-sm font-semibold text-primary">{item.price}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Worn {item.worn} times</p>
                        <p className="text-xs">Cost per wear: ${(parseFloat(item.price.slice(1)) / item.worn).toFixed(2)}</p>
                      </div>
                      <button>
                        <Heart className={`w-5 h-5 ${item.favorite ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary mb-2">Personalized for You</h2>
              <p className="text-muted-foreground">Based on your style preferences and wardrobe analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((item) => (
                <div key={item.id} className="bg-card rounded-lg p-4">
                  <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-4 relative">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <p className="text-xs text-center">{item.name}</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {item.match} match
                    </div>
                  </div>
                  <h3 className="font-medium text-primary mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                  <p className="text-lg font-semibold text-primary mb-3">{item.price}</p>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4">Style Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Most worn category:</span>
                  <span className="font-medium">{styleAnalytics.mostWornCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. price per item:</span>
                  <span className="font-medium">{styleAnalytics.avgPricePerItem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost per wear:</span>
                  <span className="font-medium">{styleAnalytics.costPerWear}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4">Sustainability Score</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{styleAnalytics.sustainabilityScore}</div>
                <p className="text-sm text-muted-foreground">Excellent! You're making sustainable choices.</p>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4">Monthly Spending</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{styleAnalytics.monthlySpend}</div>
                <p className="text-sm text-muted-foreground">Average over last 6 months</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Style Curator", description: "Created 10+ outfit combinations", earned: true },
              { title: "Sustainable Shopper", description: "80% sustainable brand purchases", earned: true },
              { title: "Wardrobe Optimizer", description: "Achieved 90%+ utilization rate", earned: true },
              { title: "Trendsetter", description: "First to try 5 trending styles", earned: false },
              { title: "Budget Master", description: "Stayed under budget for 3 months", earned: true },
              { title: "Social Stylist", description: "Helped 20+ friends with outfit advice", earned: false }
            ].map((achievement, index) => (
              <div key={index} className={`bg-card rounded-lg p-6 ${achievement.earned ? 'border-l-4 border-primary' : 'opacity-60'}`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.earned && (
                      <span className="inline-block mt-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Earned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
