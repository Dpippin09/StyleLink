'use client';

import { useRefreshToHome } from '@/hooks/useRefreshToHome';

interface RefreshToHomeWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that enables automatic refresh-to-home functionality
 * Intercepts browser refresh attempts (F5, Ctrl+R, browser refresh button)
 * and redirects to home page instead of refreshing the current page
 */
export default function RefreshToHomeWrapper({ children }: RefreshToHomeWrapperProps) {
  // Apply the refresh-to-home behavior globally
  useRefreshToHome();

  return <>{children}</>;
}
