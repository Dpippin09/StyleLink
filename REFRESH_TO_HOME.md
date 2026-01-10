# Browser Refresh to Home Feature 🏠

This feature intercepts browser refresh attempts and automatically redirects users to the home page instead of refreshing the current page.

## 🎯 **How It Works:**

### **Automatic Browser Refresh Interception:**
- Detects browser refresh events (F5, Ctrl+R, Cmd+R, browser refresh button)
- Automatically redirects to home page (`/`) instead of refreshing current page
- Works on **all pages** throughout the StyleLink app
- **No visible UI elements** - purely background functionality

## 🛠️ **Implementation:**

### **Files Created/Modified:**

1. **`src/hooks/useRefreshToHome.ts`** - Custom hook for refresh behavior
2. **`src/components/RefreshToHomeWrapper.tsx`** - Global wrapper component
3. **`src/app/layout.tsx`** - Root layout integration

### **Usage:**

```tsx
// Automatic (already integrated globally)
import { useRefreshToHome } from '@/hooks/useRefreshToHome';

function MyComponent() {
  useRefreshToHome(); // Enables refresh-to-home behavior
  return <div>My content</div>;
}
```

## 🎮 **User Experience:**

### **Before:**
- User on `/search` page → Presses F5 → Page refreshes, stays on `/search`
- User on `/cart` page → Clicks browser refresh → Page refreshes, stays on `/cart`

### **After:**
- User on `/search` page → Presses F5 → Goes to home page (`/`)
- User on `/cart` page → Clicks browser refresh → Goes to home page (`/`)
- User on `/profile` page → Presses Ctrl+R → Goes to home page (`/`)

## 🔧 **Technical Details:**

### **Event Handling:**
- `keydown` - Catches F5, Ctrl+R, and Cmd+R keyboard shortcuts
- `beforeunload` - Intercepts browser refresh button clicks
- Prevents default browser refresh behavior
- Uses Next.js router for client-side navigation

### **Cross-Platform Support:**
- **Windows/Linux**: F5, Ctrl+R
- **Mac**: F5, Cmd+R
- **All Platforms**: Browser refresh button interception

### **Next.js Integration:**
- Uses Next.js `useRouter` for navigation
- Client-side routing (no page reload)
- Integrated into root layout for global coverage

## 🎯 **Benefits:**

- **Consistent UX**: Users always return to a familiar starting point
- **Reduced Confusion**: No more staying on random pages after refresh
- **Better Navigation**: Clear path back to main marketplace
- **Invisible**: No UI clutter - works seamlessly in background
- **Universal**: Works on all devices and platforms

## 🚀 **Ready to Use:**

The feature is now active on all pages! When users try to refresh:
1. Press **F5** → Goes to home page
2. Press **Ctrl+R** (or **Cmd+R** on Mac) → Goes to home page
3. Click **browser refresh button** → Goes to home page

Perfect for your StyleLink fashion marketplace! 🛍️

## 🧪 **Testing:**

To test the feature:
1. Navigate to any page (e.g., `/search`, `/cart`, `/profile`)
2. Press F5 or Ctrl+R - you should be redirected to home page
3. Click the browser's refresh button - you should go to home page
4. Only works when NOT already on the home page (home page can refresh normally)
