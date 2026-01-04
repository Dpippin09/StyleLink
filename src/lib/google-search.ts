import { ExternalProduct, SearchResponse, CLOTHING_CATEGORIES } from './external-search'

// Google Custom Search API with Shopping configuration
export async function searchGoogle(
  query: string,
  category?: string,
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  try {
    // For demo purposes, we'll use enhanced mock data with web search results
    // In production, you would use Google Custom Search API with API keys
    return await searchGoogleEnhanced(query, category, maxResults)

  } catch (error) {
    console.error('Google Search API error:', error)
    return {
      success: false,
      platform: 'google',
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      searchTime: Date.now() - startTime,
      totalResults: 0
    }
  }
}{
      id: `google-${index + 1}`,
      title: item.title,
      description: item.snippet,
      price: extractPriceFromSnippet(item.snippet) || 19.99,
      currency: 'USD',
      imageUrl: item.link,
      productUrl: item.image?.contextLink || item.link,
      platform: 'google' as const,
      brand: extractBrandFromTitle(item.title),
      condition: 'new'
    }))

    return {
      success: true,
      platform: 'Google Shopping',
      products,
      totalResults: parseInt(data.searchInformation?.totalResults) || items.length,
      searchTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('Google search error:', error)
    return searchGoogleMock(query, category, maxResults)
  }
}

// Mock Google search for development
export async function searchGoogleMock(
  query: string,
  category?: string,
  maxResults: number = 20
): Promise<SearchResponse> {
  const startTime = Date.now()
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 350))
  
  const mockProducts: ExternalProduct[] = [
    {
      id: 'google-1',
      title: `${query} - Trendy Fashion Shirt`,
      description: 'Discover the latest trends in fashion with this stylish shirt',
      price: 21.99,
      originalPrice: 29.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&auto=format&fit=crop',
      productUrl: 'https://shop.example.com/trendy-shirt',
      platform: 'google',
      brand: 'Fashion Forward',
      condition: 'new'
    },
    {
      id: 'google-2',
      title: `${query} - Designer Sneakers`,
      description: 'Premium designer sneakers for the fashion-conscious',
      price: 89.99,
      originalPrice: 120.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop',
      productUrl: 'https://shop.example.com/designer-sneakers',
      platform: 'google',
      brand: 'StyleMax',
      condition: 'new'
    },
    {
      id: 'google-3',
      title: `${query} - Casual Summer Dress`,
      description: 'Light and breezy summer dress perfect for warm weather',
      price: 34.50,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&auto=format&fit=crop',
      productUrl: 'https://shop.example.com/summer-dress',
      platform: 'google',
      brand: 'Summer Style',
      condition: 'new'
    },
    {
      id: 'google-4',
      title: `${query} - Premium Denim Jeans`,
      description: 'High-quality denim with perfect fit and comfort',
      price: 67.00,
      originalPrice: 85.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&auto=format&fit=crop',
      productUrl: 'https://shop.example.com/premium-jeans',
      platform: 'google',
      brand: 'Denim Co',
      condition: 'new'
    },
    {
      id: 'google-5',
      title: `${query} - Winter Jacket`,
      description: 'Warm and stylish winter jacket for cold weather',
      price: 95.99,
      originalPrice: 130.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&auto=format&fit=crop',
      productUrl: 'https://shop.example.com/winter-jacket',
      platform: 'google',
      brand: 'WinterWear',
      condition: 'new'
    }
  ]
  
  return {
    success: true,
    platform: 'Google Shopping',
    products: mockProducts.slice(0, maxResults),
    totalResults: mockProducts.length,
    searchTime: Date.now() - startTime
  }
}

// Helper functions for parsing Google results
function extractPriceFromSnippet(snippet: string): number | null {
  const priceMatch = snippet.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
  return priceMatch ? parseFloat(priceMatch[1]) : null;
}

function extractBrandFromTitle(title: string): string | undefined {
  // Common fashion brands to look for
  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Old Navy', 'Forever 21'];
  const foundBrand = brands.find(brand => 
    title.toLowerCase().includes(brand.toLowerCase())
  );
  return foundBrand;
}
