// Simple API URL helper - use relative URLs for client-side calls
export function createApiUrl(endpoint: string): string {
  // Always use relative URLs in the browser for better compatibility
  return endpoint
}
