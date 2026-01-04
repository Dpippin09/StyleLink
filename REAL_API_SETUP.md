# 🔑 Real API Integration Setup Guide

## 📋 Quick Setup Checklist

✅ **Copy environment file:**
```bash
cp .env.example .env.local
```

✅ **Add API keys to `.env.local`**

✅ **Deploy and test**

---

## 🛍️ API Provider Setup

### 1. eBay API (Free - Recommended)
**Best for:** Wide product variety, competitive pricing

1. **Sign up:** https://developer.ebay.com/join/
2. **Create app:** https://developer.ebay.com/my/keys
3. **Get App ID:** Copy your "App ID (Client ID)"
4. **Add to `.env.local`:**
   ```
   EBAY_APP_ID=YourEbayAppId-Here123
   ```

### 2. Google Shopping API
**Best for:** High-quality product images, brand recognition

1. **Create project:** https://console.cloud.google.com/
2. **Enable Custom Search API**
3. **Create API key:** IAM & Admin → Service Accounts
4. **Create Custom Search Engine:** https://cse.google.com/
5. **Add to `.env.local`:**
   ```
   GOOGLE_API_KEY=AIzaSyYourGoogleApiKey123
   GOOGLE_CSE_ID=YourCustomSearchEngineId123
   ```

### 3. Shopify API (If you have a store)
**Best for:** Your own product catalog

1. **Shopify Partner account:** https://partners.shopify.com/
2. **Create private app** in your store
3. **Get access token** with product read permissions
4. **Add to `.env.local`:**
   ```
   SHOPIFY_STORE_NAME=your-store-name
   SHOPIFY_ACCESS_TOKEN=shpat_YourAccessToken123
   ```

---

## 🚀 Testing Your Setup

### Test with Real APIs:
```javascript
// Search with real API flag
fetch('/api/search/real?q=white shirt&useRealAPIs=true')
```

### Test Status:
- ✅ **Green dot + "Live APIs"** = Real data working
- 🟡 **Green dot + "Demo Mode"** = Using enhanced mock data
- ❌ **No results** = Check API keys

---

## 💰 Revenue Optimization

### Affiliate Programs to Join:
- **Amazon Associates:** 1-10% commission
- **eBay Partner Network:** 2-6% commission  
- **ShareASale:** Various fashion retailers
- **Commission Junction:** Premium brands
- **Rakuten Advertising:** Department stores

### StyleLink Revenue Streams:
1. **Service Fee:** 3% on all transactions
2. **Affiliate Commission:** 2-8% from retailers
3. **Premium Features:** $9.99/month subscription
4. **Brand Partnerships:** Featured placement fees

---

## 🔧 Advanced Configuration

### Rate Limiting:
```env
API_CACHE_DURATION=300  # 5 minutes
MAX_SEARCH_RESULTS=50
```

### Business Settings:
```env
STYLELINK_SERVICE_FEE_PERCENT=3
FREE_SHIPPING_THRESHOLD=75
```

### Production Mode:
```env
USE_REAL_APIS=true
FALLBACK_TO_MOCK=true  # Backup if APIs fail
```

---

## 📊 API Limits & Costs

| Provider | Free Tier | Rate Limits | Cost After |
|----------|-----------|-------------|------------|
| eBay | 5,000 calls/day | 5/sec | $0.50/1K calls |
| Google Shopping | 100 searches/day | 10/sec | $5/1K searches |
| Shopify | Unlimited | 2/sec | Free for own store |

---

## 🚨 Troubleshooting

### Common Issues:

**"No results found"**
- Check API keys in `.env.local`
- Verify API endpoints are accessible
- Check browser console for errors

**"Demo Mode" always showing**  
- Set `USE_REAL_APIS=true` in production
- Add search query `test-real-api` to force real API testing

**API errors**
- Check rate limits
- Verify API key permissions
- Check network/firewall settings

### Debug Mode:
```bash
# Enable detailed logging
NODE_ENV=development npm run dev
```

---

## 🎯 Next Steps

1. **Start with eBay API** (easiest setup)
2. **Test searches** for your target products  
3. **Add Google Shopping** for better images
4. **Set up affiliate accounts** for revenue
5. **Monitor API usage** and optimize calls

**Ready to go live with real product data!** 🚀
