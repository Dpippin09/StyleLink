// Affiliate link management for StyleLink price comparison platform
// This handles commission tracking and affiliate URL generation

export interface AffiliateConfig {
  amazon: {
    tag: string // Amazon Associates tag
  }
  ebay: {
    campId: string
    customId: string
  }
  walmart: {
    publisherId: string
  }
}

// Default affiliate configuration (replace with your actual affiliate IDs)
const DEFAULT_AFFILIATE_CONFIG: AffiliateConfig = {
  amazon: {
    tag: 'stylelink-20' // Replace with your Amazon Associates tag
  },
  ebay: {
    campId: '5338849056', // Replace with your eBay Partner Network campaign ID
    customId: 'stylelink'
  },
  walmart: {
    publisherId: 'your-walmart-publisher-id' // Replace with your Walmart affiliate ID
  }
}

export function generateAffiliateUrl(originalUrl: string, platform: string, productId?: string): string {
  try {
    const config = DEFAULT_AFFILIATE_CONFIG
    const url = new URL(originalUrl)
    
    switch (platform.toLowerCase()) {
      case 'amazon':
        // Add Amazon Associates tag
        url.searchParams.set('tag', config.amazon.tag)
        break
        
      case 'ebay':
        // Add eBay Partner Network parameters
        url.searchParams.set('_sacat', '0')
        url.searchParams.set('_nkw', '')
        url.searchParams.set('mkevt', '1')
        url.searchParams.set('mkcid', '1')
        url.searchParams.set('mkrid', '711-53200-19255-0')
        url.searchParams.set('campid', config.ebay.campId)
        url.searchParams.set('customid', config.ebay.customId)
        break
        
      case 'walmart':
        // Add Walmart affiliate parameters
        url.searchParams.set('wmlspartner', config.walmart.publisherId)
        break
        
      default:
        // For other platforms, add generic tracking
        url.searchParams.set('utm_source', 'stylelink')
        url.searchParams.set('utm_medium', 'affiliate')
        url.searchParams.set('utm_campaign', 'price_comparison')
        if (productId) {
          url.searchParams.set('utm_content', productId)
        }
        break
    }
    
    return url.toString()
  } catch (error) {
    console.error('Error generating affiliate URL:', error)
    return originalUrl // Return original URL if there's an error
  }
}

export function trackClick(productId: string, platform: string, price: number) {
  // Track affiliate clicks for analytics and commission calculation
  try {
    const clickData = {
      productId,
      platform,
      price,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('stylelink_user_id') || 'anonymous'
    }
    
    // Send to analytics endpoint
    fetch('/api/affiliate/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clickData)
    }).catch(error => {
      console.error('Failed to track click:', error)
    })
    
    // Also store locally for backup
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]')
    clicks.push(clickData)
    // Keep only last 100 clicks
    if (clicks.length > 100) {
      clicks.splice(0, clicks.length - 100)
    }
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks))
    
  } catch (error) {
    console.error('Error tracking click:', error)
  }
}

export function calculatePotentialSavings(prices: Array<{ platform: string; price: number }>) {
  if (prices.length < 2) return null
  
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price)
  const cheapest = sortedPrices[0]
  const mostExpensive = sortedPrices[sortedPrices.length - 1]
  
  const savings = mostExpensive.price - cheapest.price
  const percentage = Math.round((savings / mostExpensive.price) * 100)
  
  return {
    amount: savings,
    percentage,
    cheapestPlatform: cheapest.platform,
    mostExpensivePlatform: mostExpensive.platform,
    recommendation: `Save $${savings.toFixed(2)} (${percentage}%) by shopping at ${cheapest.platform} instead of ${mostExpensive.platform}`
  }
}

// Price comparison utilities
export function getBestPrice(products: Array<{ platform: string; price: number; inStock?: boolean }>) {
  const availableProducts = products.filter(p => p.inStock !== false)
  if (availableProducts.length === 0) return null
  
  return availableProducts.reduce((best, current) => 
    current.price < best.price ? current : best
  )
}

export function getPriceHistory(productId: string): Array<{ date: string; price: number; platform: string }> {
  // This would typically fetch from a database
  // For now, return mock data
  const mockHistory = JSON.parse(localStorage.getItem(`price_history_${productId}`) || '[]')
  return mockHistory
}

export function addToPriceHistory(productId: string, price: number, platform: string) {
  const history = getPriceHistory(productId)
  const newEntry = {
    date: new Date().toISOString(),
    price,
    platform
  }
  
  history.push(newEntry)
  
  // Keep only last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const filteredHistory = history.filter(entry => 
    new Date(entry.date) > thirtyDaysAgo
  )
  
  localStorage.setItem(`price_history_${productId}`, JSON.stringify(filteredHistory))
}
