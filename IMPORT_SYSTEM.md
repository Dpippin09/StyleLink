# 🛍️ StyleLink Product Import System

The StyleLink Product Import System automatically populates your database with products from multiple e-commerce platforms (Walmart, Amazon, Etsy) to create a rich shopping experience without relying on a single API.

## 🚀 Quick Setup

### Option 1: Run Setup Script (Recommended)
```bash
# For Unix/Mac/WSL
./setup-imports.sh

# For Windows
setup-imports.bat
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install cron @types/cron

# Update database schema
npx prisma db push
npx prisma generate

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings
```

## 📋 Features

### 🔄 Multi-Platform Product Import
- **Walmart**: Large inventory, competitive prices
- **Amazon**: Extensive product catalog
- **Etsy**: Unique and handmade items
- **eBay**: (Available but excluded from auto-import due to rate limits)

### ⏰ Automated Scheduling
- **Daily Import**: 3:00 AM - 10 products per category
- **Weekly Deep Import**: Sunday 2:00 AM - 20 products per category
- **Customizable**: Adjust timing, categories, and quantities

### 🎯 Smart Deduplication
- Prevents duplicate products across platforms
- Updates existing products with latest information
- Maintains data integrity

### 📊 Admin Dashboard
- Real-time import monitoring
- Scheduler controls (start/stop/status)
- Import statistics and error tracking
- Manual import configuration

## 🏗️ Architecture

### Core Components

1. **Product Import Service** (`src/lib/product-import.ts`)
   - Multi-platform product fetching
   - Database synchronization
   - Deduplication and cleanup

2. **Scheduled Import Service** (`src/lib/scheduled-import.ts`)
   - Cron job management
   - Automatic import scheduling
   - Production-ready configuration

3. **Search Aggregator** (`src/lib/search-aggregator.ts`)
   - Real-time search across platforms
   - Rate limiting and fallbacks
   - Mock data for development

4. **Admin Interface** (`src/app/admin/import/page.tsx`)
   - Import configuration UI
   - Scheduler controls
   - Real-time monitoring

### Database Schema

New fields added to `Product` model:
```prisma
model Product {
  // ... existing fields ...
  externalId       String?   // Platform-specific product ID
  externalPlatform String?   // Source platform (walmart, amazon, etc.)
  lastSyncedAt     DateTime? // Last import/update timestamp
}
```

## 🔧 Configuration

### Environment Variables (`.env.local`)

```env
# Enable automatic imports in production
AUTO_START_IMPORTS=true

# Default import settings
DEFAULT_IMPORT_CATEGORIES="dress,shoes,shirt,pants,accessories,jacket"
DEFAULT_IMPORT_PLATFORMS="walmart,amazon,etsy"
DAILY_IMPORT_LIMIT=10
WEEKLY_IMPORT_LIMIT=20
```

### Customizable Categories
- `dress`, `shoes`, `shirt`, `pants`
- `accessories`, `jacket`, `tops`, `skirts`
- `shorts`, `swimwear`, `activewear`
- `bags`, `jewelry`, `watches`, `sunglasses`

## 📖 Usage

### 1. Admin Dashboard
Navigate to `/admin/import` to:
- Configure import settings
- Start/stop manual imports
- Control scheduled imports
- Monitor import statistics

### 2. API Endpoints

#### Manual Import
```bash
POST /api/admin/import
{
  "categories": ["dress", "shoes"],
  "productsPerCategory": 5,
  "platforms": ["walmart", "amazon"],
  "updateExisting": true
}
```

#### Scheduler Control
```bash
# Get scheduler status
GET /api/admin/scheduler

# Start/stop scheduler
POST /api/admin/scheduler
{
  "action": "start" // or "stop"
}
```

### 3. Programmatic Usage

```typescript
import { productImportService } from '@/lib/product-import'
import { scheduledImportService } from '@/lib/scheduled-import'

// Manual import
const stats = await productImportService.importProducts({
  categories: ['dress', 'shoes'],
  productsPerCategory: 10,
  platforms: ['walmart', 'amazon'],
  updateExisting: true
})

// Start scheduled imports
scheduledImportService.startAll()
```

## 📊 Monitoring

### Import Statistics
```typescript
interface ImportStats {
  totalSearched: number    // Products searched
  totalImported: number    // New products added
  totalUpdated: number     // Existing products updated
  totalSkipped: number     // Duplicates/errors skipped
  errors: string[]         // Error messages
  duration: number         // Import time (ms)
}
```

### Scheduler Status
- Job running status
- Next execution times
- Error monitoring

## 🛠️ Troubleshooting

### Common Issues

1. **Database Schema Errors**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. **Missing Dependencies**
   ```bash
   npm install cron @types/cron
   ```

3. **Rate Limiting**
   - eBay excluded by default due to strict limits
   - Other platforms have built-in rate limiting
   - Automatic fallbacks and retries

4. **Import Not Starting**
   - Check scheduler status in admin panel
   - Verify `AUTO_START_IMPORTS=true` in production
   - Ensure valid API endpoints

### Debug Mode
Set `NODE_ENV=development` for verbose logging:
```bash
# Logs show detailed import progress
🕒 Running scheduled daily product import...
📦 Importing from walmart: dress
✅ Added product: Walmart Dress Item
📊 Daily import completed: {...stats}
```

## 🚀 Production Deployment

### 1. Environment Setup
```env
NODE_ENV=production
AUTO_START_IMPORTS=true
DATABASE_URL=your_production_database_url
```

### 2. Scheduler Initialization
The scheduler automatically starts in production when:
- `NODE_ENV=production`
- `AUTO_START_IMPORTS=true`

### 3. Monitoring
- Use admin dashboard for real-time monitoring
- Set up alerts for failed imports
- Monitor database growth and performance

## 📈 Performance

### Optimizations
- **Concurrent Processing**: Multiple platforms searched in parallel
- **Smart Caching**: Reduces redundant API calls
- **Incremental Updates**: Only update changed products
- **Cleanup Jobs**: Remove old/stale products automatically

### Scaling
- **Horizontal**: Run multiple import workers
- **Vertical**: Increase memory/CPU for faster processing
- **Database**: Optimize indexes on `externalId` and `externalPlatform`

## 🔮 Future Enhancements

1. **Additional Platforms**
   - AliExpress integration
   - Shopify store connections
   - Fashion-specific APIs

2. **Smart Categorization**
   - AI-powered product categorization
   - Automatic brand detection
   - Style preference matching

3. **Advanced Scheduling**
   - Demand-based import frequency
   - Seasonal category prioritization
   - User behavior-driven imports

---

📚 **Need Help?** Check the admin dashboard at `/admin/import` for real-time status and controls.
