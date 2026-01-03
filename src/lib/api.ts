// Utility function to get the correct API base URL
function getApiBaseUrl(): string {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Use the current origin
    return window.location.origin
  }
  
  // In server-side environment, try to get from environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  
  // Fallback to localhost for development
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://style-link-sigma.vercel.app'
}

// Helper function to make API calls with proper URL
export function createApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl()
  return `${baseUrl}${endpoint}`
}

export { getApiBaseUrl }
