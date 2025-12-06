# External API Documentation

StyleLink now includes powerful external API endpoints for searching clothing deals across multiple e-commerce platforms.

## API Endpoints

### 1. External Search API

**Endpoint:** `/api/search/external`  
**Method:** `GET`

Search for clothing products across eBay, Walmart, Amazon, Google Shopping, and Etsy.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` or `query` | string | Search query (required) | `shirt`, `running shoes` |
| `platforms` | string | Comma-separated platforms to search | `ebay,walmart,amazon,etsy` |
| `category` | string | Product category | `dresses`, `shoes`, `jeans` |
| `maxResults` | number | Max results per platform (default: 10) | `20` |
| `sortBy` | string | Sort order: `price`, `relevance`, `rating` | `price` |
| `minPrice` | number | Minimum price filter | `10.00` |
| `maxPrice` | number | Maximum price filter | `100.00` |

#### Example Requests

```bash
# Basic search
GET /api/search/external?q=shirt

# Search specific platforms with price range
GET /api/search/external?q=running+shoes&platforms=amazon,walmart,etsy&minPrice=20&maxPrice=100

# Search with category and sort
GET /api/search/external?q=dress&category=dresses&sortBy=price&maxResults=15
```

#### Response Format

```json
{
  "success": true,
  "query": "shirt",
  "totalProducts": 13,
  "totalResults": 13,
  "products": [
    {
      "id": "walmart-1",
      "title": "Comfortable Cotton Blend Shirt",
      "description": "Soft, breathable cotton blend perfect for everyday wear",
      "price": 12.97,
      "originalPrice": 19.97,
      "currency": "USD",
      "imageUrl": "https://images.unsplash.com/photo-...",
      "productUrl": "https://walmart.com/ip/123456789",
      "platform": "walmart",
      "brand": "Hanes",
      "condition": "new",
      "shipping": {
        "cost": 0,
        "free": true
      },
      "rating": 4.3,
      "reviewCount": 1247
    }
  ],
  "platformResults": {
    "walmart": { "success": true, "products": [...] },
    "amazon": { "success": true, "products": [...] },
    "ebay": { "success": false, "error": "API error" },
    "google": { "success": true, "products": [...] }
  },
  "searchTime": 512,
  "averagePlatformTime": 455.75
}
```

### 2. Deals API

**Endpoint:** `/api/search/deals`  
**Method:** `GET`

Get curated deals and special offers across all platforms.

#### Query Parameters

| Parameter | Type | Description | Options |
|-----------|------|-------------|---------|
| `q` or `query` | string | Search query (default: "clothing fashion") | Any search term |
| `type` | string | Deal type (default: "best") | `best`, `discounts`, `rated` |
| `limit` | number | Number of deals to return (default: 10) | 1-50 |

#### Deal Types

- **`best`** - Best deals with lowest prices
- **`discounts`** - Biggest percentage discounts (requires original price)
- **`rated`** - Highest rated products with reviews

#### Example Requests

```bash
# Get best deals (lowest prices)
GET /api/search/deals?q=shirt&type=best&limit=5

# Get biggest discounts
GET /api/search/deals?q=shoes&type=discounts&limit=10

# Get top-rated products
GET /api/search/deals?type=rated&limit=8
```

#### Response Format

```json
{
  "success": true,
  "dealType": "best",
  "dealTypeDescription": "Best Deals (Lowest Prices)",
  "query": "shirt",
  "totalDeals": 5,
  "deals": [
    {
      "id": "walmart-1",
      "title": "Comfortable Cotton Blend Shirt",
      "price": 12.97,
      "originalPrice": 19.97,
      "platform": "walmart",
      "brand": "Hanes",
      // ... additional product fields
    }
  ],
  "searchTime": 423,
  "platforms": ["walmart", "amazon", "google"],
  "generatedAt": "2025-12-05T20:05:27.821Z"
}
```

## Platform Support

### Currently Integrated

- ✅ **eBay** - Using eBay Finding API (with mock fallback)
- ✅ **Walmart** - Using Walmart Open API (with mock fallback)  
- ✅ **Amazon** - Product Advertising API 5.0 (mock implementation)
- ✅ **Google Shopping** - Custom Search API (mock implementation)
- ✅ **Etsy** - Etsy API v3 (with mock fallback)

### API Keys Required

To enable real API calls, add these environment variables:

```env
# eBay (https://developer.ebay.com/)
EBAY_APP_ID=your_ebay_app_id

# Walmart (https://developer.walmartlabs.com/)
WALMART_API_KEY=your_walmart_api_key

# Amazon (https://webservices.amazon.com/paapi5/)
AMAZON_ACCESS_KEY_ID=your_access_key
AMAZON_SECRET_ACCESS_KEY=your_secret_key  
AMAZON_PARTNER_TAG=your_associate_id

# Google (https://developers.google.com/custom-search/)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# Etsy (https://developers.etsy.com/)
ETSY_API_KEY=your_etsy_api_key
```

## Features

### Multi-Platform Aggregation
- Searches multiple platforms simultaneously
- Combines results with unified product schema
- Handles platform-specific errors gracefully

### Smart Filtering & Sorting
- Price range filtering
- Category-based search
- Multiple sort options (price, rating, relevance)

### Deal Detection
- Automatic discount calculation
- Best price identification
- Top-rated product curation

### Performance Optimized
- Parallel API calls for faster results
- Response caching (5-10 minutes)
- Configurable result limits

### Error Handling
- Graceful fallback to mock data
- Individual platform error isolation
- Comprehensive error reporting

## Usage Examples

### Frontend Integration

```typescript
// Search for products
const searchProducts = async (query: string) => {
  const response = await fetch(
    `/api/search/external?q=${encodeURIComponent(query)}&sortBy=price`
  )
  const data = await response.json()
  return data.products
}

// Get daily deals
const getDailyDeals = async () => {
  const response = await fetch('/api/search/deals?type=best&limit=20')
  const data = await response.json()
  return data.deals
}
```

### Testing Commands

```bash
# Test external search
curl "http://localhost:3000/api/search/external?q=shirt&platforms=walmart,amazon,etsy"

# Test deals API
curl "http://localhost:3000/api/search/deals?type=discounts&limit=5"
```
