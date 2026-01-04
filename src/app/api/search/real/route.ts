import { NextRequest, NextResponse } from 'next/server'
import { EbayAPI, GoogleShoppingAPI, ShopifyAPI, type RealAPIProduct, type APISearchResponse } from '@/lib/real-apis'

export interface RealProduct {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl: string
  retailerUrl: string
  affiliate_url?: string
  retailer: string
  brand: string
  category: string
  sizes?: string[]
  colors?: string[]
  inStock: boolean
  rating?: number
  reviews?: number
  condition: 'new' | 'used' | 'refurbished'
}

export interface SearchAPIResponse {
  success: boolean
  products: RealProduct[]
  totalResults: number
  searchTime: number
  sources: string[]
  error?: string
  nextPage?: string
}

// Real product search API endpoint with live integrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('query')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const maxResults = parseInt(searchParams.get('maxResults') || '20')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const useRealAPIs = searchParams.get('useRealAPIs') === 'true'

    // Search real products from multiple sources
    const results = await searchRealProducts(query, {
      maxResults,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      useRealAPIs
    })
    
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes for real APIs
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Real product search API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        products: [],
        totalResults: 0,
        searchTime: 0,
        sources: [],
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// Search real products from multiple live APIs
async function searchRealProducts(
  query: string, 
  options: {
    maxResults?: number
    category?: string | null
    minPrice?: number
    maxPrice?: number
    useRealAPIs?: boolean
  } = {}
): Promise<SearchAPIResponse> {
  const startTime = Date.now()
  
  try {
    const { maxResults = 20, useRealAPIs = true } = options
    
    if (!useRealAPIs) {
      // Fallback to enhanced mock data
      const mockResults = await generateEnhancedProducts(query, options)
      return {
        success: true,
        products: mockResults,
        totalResults: mockResults.length * 5,
        searchTime: Date.now() - startTime,
        sources: ['Enhanced Mock Data']
      }
    }
    
    // Initialize real APIs
    const apis = [
      new EbayAPI(),
      new GoogleShoppingAPI(),
      // new ShopifyAPI() // Enable when you have store credentials
    ]
    
    // Search all APIs in parallel
    const searchPromises = apis.map(async (api) => {
      try {
        const result = await api.searchProducts(query, {
          maxResults: Math.ceil(maxResults / apis.length),
          minPrice: options.minPrice,
          maxPrice: options.maxPrice
        })
        return result
      } catch (error) {
        console.error(`API search error:`, error)
        return {
          success: false,
          products: [],
          totalResults: 0,
          searchTime: 0,
          source: 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        } as APISearchResponse
      }
    })
    
    const apiResults = await Promise.all(searchPromises)
    
    // Combine results from all APIs
    const allProducts: RealProduct[] = []
    const successfulSources: string[] = []
    let totalResults = 0
    
    for (const result of apiResults) {
      if (result.success && result.products.length > 0) {
        allProducts.push(...result.products.map(convertAPIProduct))
        successfulSources.push(result.source)
        totalResults += result.totalResults
      }
    }
    
    // If no real API results, fallback to enhanced mock data
    if (allProducts.length === 0) {
      console.log('No real API results, falling back to mock data')
      const mockResults = await generateEnhancedProducts(query, options)
      return {
        success: true,
        products: mockResults,
        totalResults: mockResults.length * 5,
        searchTime: Date.now() - startTime,
        sources: ['Enhanced Mock Data (Fallback)']
      }
    }
    
    // Sort by relevance and price
    const sortedProducts = allProducts
      .slice(0, maxResults)
      .sort((a, b) => {
        // Prioritize in-stock items
        if (a.inStock && !b.inStock) return -1
        if (!a.inStock && b.inStock) return 1
        
        // Then by price (ascending)
        return a.price - b.price
      })
    
    return {
      success: true,
      products: sortedProducts,
      totalResults,
      searchTime: Date.now() - startTime,
      sources: successfulSources
    }
    
  } catch (error) {
    console.error('Real product search error:', error)
    
    // Fallback to mock data on any error
    const mockResults = await generateEnhancedProducts(query, options)
    return {
      success: true,
      products: mockResults,
      totalResults: mockResults.length * 5,
      searchTime: Date.now() - startTime,
      sources: ['Enhanced Mock Data (Error Fallback)'],
      error: `Real APIs failed, using mock data: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Convert API product to our standard format
function convertAPIProduct(apiProduct: RealAPIProduct): RealProduct {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: apiProduct.originalPrice,
    currency: apiProduct.currency,
    imageUrl: apiProduct.imageUrl,
    retailerUrl: apiProduct.retailerUrl,
    affiliate_url: apiProduct.affiliate_url,
    retailer: apiProduct.retailer,
    brand: apiProduct.brand,
    category: apiProduct.category,
    sizes: apiProduct.sizes,
    colors: apiProduct.colors,
    inStock: apiProduct.inStock,
    rating: apiProduct.rating,
    reviews: apiProduct.reviews,
    condition: apiProduct.condition
  }
}

// Generate enhanced realistic products that simulate real retailer data
async function generateEnhancedProducts(
  query: string,
  options: {
    maxResults?: number
    category?: string | null
    minPrice?: number
    maxPrice?: number
  } = {}
): Promise<RealProduct[]> {
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { maxResults = 20, category, minPrice, maxPrice } = options
  const queryLower = query.toLowerCase()
  
  // Real retailer data templates
  const realRetailers = [
    {
      name: 'Amazon',
      baseUrl: 'https://amazon.com',
      affiliateParam: '?tag=stylelink-20'
    },
    {
      name: 'Zara',
      baseUrl: 'https://zara.com',
      affiliateParam: '?ref=stylelink'
    },
    {
      name: 'H&M',
      baseUrl: 'https://hm.com',
      affiliateParam: '?affiliate=stylelink'
    },
    {
      name: 'ASOS',
      baseUrl: 'https://asos.com',
      affiliateParam: '?affid=stylelink'
    },
    {
      name: 'Nordstrom',
      baseUrl: 'https://nordstrom.com',
      affiliateParam: '?campaign=stylelink'
    }
  ]
  
  // Enhanced product templates with real-world data structure
  const productTemplates = [
    // Shirts & Tops
    {
      keywords: ['shirt', 'top', 'blouse', 'tee', 'tank'],
      items: [
        {
          title: 'Classic Cotton Button-Up Shirt',
          category: 'Tops',
          priceRange: [29, 89],
          brands: ['Everlane', 'J.Crew', 'Banana Republic'],
          images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['White', 'Blue', 'Black', 'Striped']
        },
        {
          title: 'Vintage Graphic T-Shirt',
          category: 'Tops',
          priceRange: [18, 45],
          brands: ['Urban Outfitters', 'Forever 21'],
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'White', 'Navy', 'Gray']
        }
      ]
    },
    // Dresses
    {
      keywords: ['dress', 'gown', 'sundress', 'maxi'],
      items: [
        {
          title: 'Floral Midi Dress',
          category: 'Dresses',
          priceRange: [45, 120],
          brands: ['Free People', 'Anthropologie', 'Zara'],
          images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
          sizes: ['XS', 'S', 'M', 'L'],
          colors: ['Floral', 'Black', 'Navy']
        }
      ]
    },
    // Jeans & Pants
    {
      keywords: ['jeans', 'denim', 'pants', 'trouser'],
      items: [
        {
          title: 'High-Waist Skinny Jeans',
          category: 'Bottoms',
          priceRange: [59, 150],
          brands: ['Levi\'s', 'AG Jeans', 'Citizens of Humanity'],
          images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'],
          sizes: ['24', '25', '26', '27', '28', '29', '30'],
          colors: ['Dark Wash', 'Light Wash', 'Black']
        }
      ]
    },
    // Shoes
    {
      keywords: ['shoes', 'sneakers', 'boots', 'heels', 'sandals'],
      items: [
        {
          title: 'White Leather Sneakers',
          category: 'Shoes',
          priceRange: [79, 200],
          brands: ['Nike', 'Adidas', 'Veja', 'Common Projects'],
          images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'],
          sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
          colors: ['White', 'Black', 'Gray']
        }
      ]
    }
  ]
  
  // Find matching products
  let matchingItems: any[] = []
  
  productTemplates.forEach(template => {
    if (template.keywords.some(keyword => queryLower.includes(keyword))) {
      matchingItems.push(...template.items)
    }
  })
  
  // If no specific matches, use all items
  if (matchingItems.length === 0) {
    matchingItems = productTemplates.flatMap(t => t.items)
  }
  
  // Generate realistic products
  const products: RealProduct[] = []
  
  for (let i = 0; i < Math.min(maxResults, matchingItems.length * 3); i++) {
    const template = matchingItems[i % matchingItems.length]
    const retailer = realRetailers[i % realRetailers.length]
    const brand = template.brands[Math.floor(Math.random() * template.brands.length)]
    
    // Generate realistic price
    const basePrice = Math.random() * (template.priceRange[1] - template.priceRange[0]) + template.priceRange[0]
    const price = Math.round(basePrice * 100) / 100
    const originalPrice = Math.random() > 0.7 ? Math.round(price * 1.4 * 100) / 100 : undefined
    
    // Apply price filter
    if (minPrice && price < minPrice) continue
    if (maxPrice && price > maxPrice) continue
    
    const productId = `real-${retailer.name.toLowerCase()}-${i + 1}`
    const productSlug = template.title.toLowerCase().replace(/\s+/g, '-')
    
    products.push({
      id: productId,
      title: `${template.title} - ${brand}`,
      description: `High-quality ${template.title.toLowerCase()} from ${brand}. Available in multiple sizes and colors.`,
      price,
      originalPrice,
      currency: 'USD',
      imageUrl: template.images[0],
      retailerUrl: `${retailer.baseUrl}/products/${productSlug}`,
      affiliate_url: `${retailer.baseUrl}/products/${productSlug}${retailer.affiliateParam}`,
      retailer: retailer.name,
      brand,
      category: template.category,
      sizes: template.sizes,
      colors: template.colors,
      inStock: Math.random() > 0.1, // 90% chance in stock
      rating: 3.5 + Math.random() * 1.5, // 3.5 - 5.0 rating
      reviews: Math.floor(Math.random() * 500) + 10,
      condition: 'new'
    })
  }
  
  return products.slice(0, maxResults)
}
