'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, Profile } from '@prisma/client'
import { createApiUrl } from '@/lib/api'

export interface AuthUser extends User {
  profile?: Profile | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always provide a default demo user - no authentication required
  const [user, setUser] = useState<AuthUser | null>({
    id: 'demo-user-id',
    email: 'demo@stylelink.com',
    password: '', // Required by type but not used
    name: 'Demo User',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      id: 'demo-profile-id',
      userId: 'demo-user-id',
      bio: 'Fashion enthusiast who loves mixing classic pieces with trendy accessories.',
      location: 'New York, NY',
      birthDate: null,
      gender: 'female',
      styleTypes: 'minimalist,classic,trendy',
      sizePreference: 'M',
      colorPreferences: 'black,white,navy,pink',
      priceRange: 'mid-range',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const [loading, setLoading] = useState(false) // No loading needed
  const router = useRouter()

  // No auth check needed in demo mode
  // useEffect(() => {
  //   checkAuthStatus()
  // }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(createApiUrl('/api/auth/me'), {
        credentials: 'include',
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    // Demo mode - always successful login
    return { success: true }
  }

  const register = async (email: string, password: string, name: string) => {
    // Demo mode - always successful registration
    return { success: true }
  }

  const logout = async () => {
    // Demo mode - no actual logout needed
    return
  }

  const updateProfile = async (profileData: Partial<Profile>) => {
    // Demo mode - update profile locally
    try {
      if (user && user.profile) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            ...profileData,
            updatedAt: new Date()
          }
        }
        setUser(updatedUser)
        return { success: true }
      }
      return { success: false, error: 'No user profile to update' }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}