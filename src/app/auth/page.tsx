'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

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
            
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Toggle Buttons */}
          <div className="flex bg-secondary rounded-lg p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {isLogin ? 'Welcome back' : 'Join StyleLink'}
              </h2>
              <p className="text-muted-foreground">
                {isLogin 
                  ? 'Sign in to your account to continue your style journey' 
                  : 'Create your account and discover your perfect style'
                }
              </p>
            </div>

            {/* Name Fields (Sign Up Only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Forgot Password Link (Sign In Only) */}
            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-sm text-primary hover:underline underline-offset-4">
                  Forgot your password?
                </a>
              </div>
            )}

            {/* Terms Checkbox (Sign Up Only) */}
            {!isLogin && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-3 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  required={!isLogin}
                />
                <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                  I agree to StyleLink's{' '}
                  <a href="#" className="text-primary hover:underline underline-offset-4">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline underline-offset-4">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>
          </form>

          {/* Bottom Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-primary hover:underline underline-offset-4"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-primary hover:underline underline-offset-4"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
