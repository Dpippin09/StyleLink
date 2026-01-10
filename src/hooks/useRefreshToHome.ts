'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook that intercepts browser refresh events and redirects to home page
 * Works on any page in the app - when user refreshes, they go to home instead
 */
export function useRefreshToHome() {
  const router = useRouter();

  useEffect(() => {
    // Handle keyboard refresh shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      // F5 key or Ctrl+R
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        router.push('/');
      }
      // Command+R on Mac
      if (event.metaKey && event.key === 'r') {
        event.preventDefault();
        router.push('/');
      }
    };

    // Handle browser refresh button and page reload attempts
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only intercept if we're not already on the home page
      if (window.location.pathname !== '/') {
        event.preventDefault();
        // Redirect to home page instead of refreshing
        router.push('/');
        return '';
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);
}
