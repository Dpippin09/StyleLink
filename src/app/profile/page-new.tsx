'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Filter, Grid, List, Bell, Settings, User, Camera, MapPin, Calendar, TrendingUp, Award, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SearchWithSuggestions from '@/components/SearchWithSuggestions';

interface WishlistItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  addedAt: string;
}

function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes'];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Fetch user's wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      setLoadingData(true);
      try {
        const response = await fetch('/api/user/wishlist');
        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data.wishlistItems || []);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const filteredItems = selectedCategory === 'all' 
    ? wishlistItems 
    : wishlistItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#8B7355] text-[#F5F1E8] py-3">
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
            
            <div className="flex items-center space-x-1 sm:space-x-4 text-xs sm:text-sm">
              <span className="px-2 sm:px-3 py-1 rounded-full font-medium bg-[#F5F1E8]/20">
                StyleMember
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="bg-gradient-to-r from-[#8B7355] to-[#A0956B] text-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-[#8B7355] rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">{user.name || 'Style Enthusiast'}</h2>
                  <p className="text-white/80 mb-2">@{user.email.split('@')[0]}</p>
                  <p className="text-white/90 text-sm max-w-md">
                    Fashion enthusiast exploring personal style through StyleLink. 
                    Discover amazing pieces and build the perfect wardrobe.
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <p className="font-bold text-primary text-lg">{wishlistItems.length}</p>
                  <p className="text-white/80 text-sm">Saved Items</p>
                </div>
                <div>
                  <p className="font-bold text-primary text-lg">0</p>
                  <p className="text-white/80 text-sm">Following</p>
                </div>
                <div>
                  <p className="font-bold text-primary text-lg">85</p>
                  <p className="text-white/80 text-sm">Style Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { key: 'wardrobe', label: 'Saved Items', icon: Heart },
              { key: 'activity', label: 'Activity', icon: TrendingUp },
              { key: 'goals', label: 'Style Goals', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 py-4 border-b-2 whitespace-nowrap ${
                  activeTab === key 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'wardrobe' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-background text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wishlist Items */}
            {loadingData ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your saved items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No saved items yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your wardrobe by saving items you love
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Discover Fashion
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-4'
              }>
                {filteredItems.map((item) => (
                  <div key={item.id} className={`group ${
                    viewMode === 'grid' ? 'bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow' : 'flex bg-card rounded-lg p-4 hover:shadow-md transition-shadow'
                  }`}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          </button>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{item.brand}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {item.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                              <span className="text-sm font-semibold">${item.price}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 ml-4">
                          <h4 className="font-medium mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                              <span className="font-semibold">${item.price}</span>
                            </div>
                            <button className="p-2 hover:bg-muted rounded-full transition-colors">
                              <Heart className="w-4 h-4 text-red-500 fill-current" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Activity Feed Coming Soon</h3>
            <p className="text-muted-foreground">
              Track your fashion journey and see your style evolution
            </p>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Style Goals Coming Soon</h3>
            <p className="text-muted-foreground">
              Set and track your personal style objectives
            </p>
          </div>
        )}
      </div>

      {/* Search Overlay */}
      <SearchWithSuggestions />
    </div>
  );
}

export default ProfilePage;
