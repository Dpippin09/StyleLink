'use client'

import { useState, useEffect } from 'react'
import { User, Camera, MapPin, Calendar, TrendingUp, Award, Target, ShoppingBag, Settings, Bell, Grid, List, Filter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import MobileHeader from '@/components/MobileHeader'
import SearchWithSuggestions from '@/components/SearchWithSuggestions'
import Footer from '@/components/Footer'

// Empty wardrobe items - real items will come from user purchases and uploads
const mockWardrobeItems: any[] = []

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('wardrobe')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { user, loading } = useAuth()
  const router = useRouter()

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Knitwear']
  
  const filteredItems = selectedCategory === 'all' 
    ? mockWardrobeItems 
    : mockWardrobeItems.filter(item => item.category === selectedCategory)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader currentPage="profile" />

      {/* Profile Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-card rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'Profile'}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary mb-2">{user.name || 'Fashion Enthusiast'}</h1>
                  <p className="text-muted-foreground mb-4">
                    {user.profile?.bio || 'Welcome to StyleLink! Start building your fashion journey.'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.profile?.location || 'Add location'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg">
                    <Bell className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">{mockWardrobeItems.length}</p>
                  <p className="text-muted-foreground">Items</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary text-lg">92</p>
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

        {/* Welcome Message for New Users */}
        {!user.profile?.bio && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-primary mb-2">Welcome to StyleLink, {user.name?.split(' ')[0]}! 🎉</h2>
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
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm capitalize ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
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
              <div className="text-center py-12 bg-muted/30 rounded-2xl">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Your Wardrobe is Empty
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your personal style collection by purchasing items or uploading photos of your favorite pieces.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Items you buy through StyleLink will automatically be added to your wardrobe.
                    </p>
                  </div>
                  <Link 
                    href="/search" 
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Discover Items
                  </Link>
                </div>
              </div>
            ) : (
              /* Wardrobe Items */
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
                {filteredItems.map((item) => (
                  <div key={item.id} className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-4 p-4 bg-card rounded-lg' : ''}`}>
                    <div className={`aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3 ${viewMode === 'list' ? 'w-24 h-32 mb-0 flex-shrink-0' : ''}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={266}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="text-sm font-medium text-primary group-hover:underline underline-offset-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                      <p className="text-sm font-semibold text-primary mb-2">${item.price}</p>
                      {viewMode === 'list' && (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Worn {item.worn} times</span>
                          <span>Bought {new Date(item.purchased).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
            <p className="text-muted-foreground">Coming soon! We'll show you items based on your style preferences.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Style Analytics</h3>
            <p className="text-muted-foreground">Track your fashion trends and spending patterns.</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Achievements</h3>
            <p className="text-muted-foreground">Unlock badges as you explore and build your style.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
