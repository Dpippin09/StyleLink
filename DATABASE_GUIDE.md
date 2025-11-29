# StyleLink Database Management Guide

## 🗃️ Database Setup (Completed)
✅ SQLite database created at `./dev.db`  
✅ Prisma schema configured for fashion e-commerce  
✅ Sample data seeded with products, categories, brands, and user  

## 📊 Database Schema Overview

### Core Entities
- **Users**: Authentication and profile management
- **Categories**: Product categorization (with hierarchy)
- **Brands**: Fashion brands and retailers
- **Products**: Fashion items with images, pricing, and attributes
- **Orders**: Purchase history and order management
- **Reviews**: Product reviews and ratings

### Key Features
- **Wishlist**: Save favorite products
- **Shopping Cart**: Temporary shopping session
- **User Profiles**: Style preferences and personal info
- **Product Images**: Multiple images per product
- **Hierarchical Categories**: Main categories with subcategories

## 🛠️ Useful Commands

### Database Management
```bash
# View database in Prisma Studio (GUI)
npm run db:studio

# Reset database and re-run migrations
npm run db:reset

# Add sample data
npm run db:seed

# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name your-migration-name
```

### API Endpoints (Available Now)
- **Products**: `GET /api/products` (with filtering by category, brand, search)
- **Categories**: `GET /api/categories`
- **Brands**: `GET /api/brands`

## 📁 Important Files

### Database Files
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Sample data script
- `src/lib/db.ts` - Database connection utility
- `src/lib/products.ts` - Product data access functions
- `.env` - Database connection configuration

### Sample Data Included
- **6 Products**: Dresses, tops, shoes, accessories with real images
- **3 Brands**: Zara, H&M, Nike
- **6 Categories**: Clothing (with Dresses, Tops subcategories), Shoes, Accessories
- **1 Sample User**: demo@stylelink.com with profile preferences

## 🔄 Next Steps for Production

When ready to move to production (Supabase), you'll need to:
1. Update DATABASE_URL in .env to Supabase PostgreSQL
2. Change datasource provider in schema.prisma to "postgresql"
3. Enable arrays and JSON types in schema
4. Re-run migrations for production database

## 🎯 Current Status: Option B Complete! ✅

Your local development database is now fully functional with:
- Real data instead of mock data
- Working API endpoints
- Database-powered frontend
- Seeded sample content for testing

Ready to move to **Option A: Supabase Setup** when you're ready!
