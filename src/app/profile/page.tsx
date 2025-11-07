'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Filter, Grid, List, Bell, Settings, User, Camera, MapPin, Calendar, TrendingUp, Award, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SearchWithSuggestions from '@/components/SearchWithSuggestions';

// Mock wardrobe items (same as demo but can be customized per user)
const mockWardrobeItems = [
  {
    id: 1,
    name: 'Oversized Blazer',
    brand: 'Everlane',
    price: 198,
    image: '/hero-fashion.jpg.png',
    category: 'Outerwear',
    worn: 12,
    favorited: true,
    purchased: '2023-09-15'
  },
  {
    id: 2,
    name: 'Wool Coat',
    brand: 'COS',
    price: 295,
    image: '/man-beige-coat.jpg.png',
    category: 'Outerwear',
    worn: 8,
    favorited: true,
    purchased: '2023-10-02'
  },
  {
    id: 3,
    name: 'Cashmere Cardigan',
    brand: 'Uniqlo',
    price: 99,
    image: '/woman-cardigan.jpg.png',
    category: 'Knitwear',
    worn: 15,
    favorited: false,
    purchased: '2023-08-20'
  }
];

interface UserProfile {
  name: string;
  username: string;
  email: string;
  location: string;
  joinDate: string;
  bio: string;
  followers: string;
  following: string;
  styleScore: string;
  avatar?: string;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Knitwear'];
  
  const filteredItems = selectedCategory === 'all' 
    ? mockWardrobeItems 
    : mockWardrobeItems.filter(item => item.category === selectedCategory);

  // Load user data from URL params or localStorage
  useEffect(() => {
    const firstName = searchParams.get('firstName') || 'Style';
    const lastName = searchParams.get('lastName') || 'Enthusiast';
    const email = searchParams.get('email') || 'user@stylelink.com';
    
    // Determine if this is a returning user (login) or new user (signup)
    const isReturningUser = firstName === 'Welcome' && lastName === 'Back';
    
    // Create user profile from registration data or defaults
    const profile: UserProfile = {
      name: isReturningUser ? 'Welcome Back!' : `${firstName} ${lastName}`,
      username: isReturningUser ? '@styleuser' : `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      email: email,
      location: 'New York, NY',
      joinDate: isReturningUser ? 'Oct 2024' : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      bio: isReturningUser 
        ? `Welcome back to StyleLink! Continue exploring your personal style and discovering amazing fashion pieces.`
        : `Fashion enthusiast exploring personal style through StyleLink. Love discovering new pieces and creating the perfect wardrobe.`,
      followers: isReturningUser ? '24' : '0',
      following: isReturningUser ? '18' : '0',
      styleScore: isReturningUser ? '92' : '85'
    };
    
    setUserProfile(profile);
    
    // Set different user type for header
    setIsReturningUser(isReturningUser);
  }, [searchParams]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
              <span className={`px-3 py-1 rounded-full font-medium ${
                isReturningUser 
                  ? 'bg-green-500/20 text-green-600' 
                  : 'bg-primary/20 text-primary'
              }`}>
                {isReturningUser ? 'WELCOME BACK' : 'NEW USER'}
              </span>
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
                  <h1 className="text-2xl font-bold text-primary mb-1">{userProfile.name}</h1>
                  <p className="text-muted-foreground mb-2">{userProfile.username}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile.location}
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {userProfile.joinDate}
                  </div>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Edit Profile
                </button>
              </div>
              
              <p className="text-foreground mb-4 max-w-2xl">{userProfile.bio}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{userProfile.followers}</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{userProfile.following}</p>
                  <p className="text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{mockWardrobeItems.length}</p>
                  <p className="text-muted-foreground">Items</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{userProfile.styleScore}</p>
                  <p className="text-muted-foreground">Style Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchWithSuggestions />
          </div>
        </div>

        {/* Welcome Message for New Users or Welcome Back for Returning Users */}
        {!isReturningUser ? (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-primary mb-2">Welcome to StyleLink, {userProfile.name.split(' ')[0]}! 🎉</h2>
              <p className="text-muted-foreground mb-4">
                Your style journey begins here. Start by exploring fashion items, building your wardrobe, and discovering your personal style.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/search?q=white" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Browse Fashion
                </Link>
                <Link href="/demo" className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                  See Demo Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-600 mb-2">Welcome back to StyleLink! 👋</h2>
              <p className="text-muted-foreground mb-4">
                Ready to continue your style journey? Discover new pieces or check out what's trending in fashion today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/search?q=new arrivals" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Discover New Arrivals
                </Link>
                <Link href="/search?q=trending" className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                  What's Trending
                </Link>
              </div>
            </div>
          </div>
        )}

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
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Empty State for New Users */}
            {mockWardrobeItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your wardrobe is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start building your dream wardrobe by exploring fashion items and adding your favorites!
                </p>
                <Link href="/search?q=fashion" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Explore Fashion
                </Link>
              </div>
            ) : (
              /* Wardrobe Items Grid/List */
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredItems.map((item) => (
                  <div key={item.id} className={viewMode === 'grid'
                    ? 'bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group'
                    : 'bg-card rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex items-center gap-4'
                  }>
                    <div className={viewMode === 'grid'
                      ? 'aspect-square overflow-hidden relative'
                      : 'w-20 h-20 overflow-hidden rounded-lg relative flex-shrink-0'
                    }>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                        </div>
                        <button className={`text-muted-foreground hover:text-red-500 transition-colors ${item.favorited ? 'text-red-500' : ''}`}>
                          <Heart className={`w-4 h-4 ${item.favorited ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-primary">${item.price}</span>
                        <span className="text-muted-foreground">Worn {item.worn}x</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other tab content placeholders */}
        {activeTab !== 'wardrobe' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              This feature is coming soon! Keep exploring your wardrobe in the meantime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
