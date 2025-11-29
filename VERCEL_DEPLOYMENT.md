# Vercel Deployment Instructions

This project has been optimized for Vercel deployment with graceful fallbacks when the database is not available.

## Build Configuration

The app is configured to:
1. Skip Prisma generation during build if it fails
2. Use mock data fallbacks when database is not available
3. Handle Prisma import failures gracefully

## Deployment Notes

- The app will deploy successfully even without a database
- All API routes fallback to mock data when database is unavailable
- Prisma client is imported dynamically to prevent build failures

## Adding a Database Later

To add a production database:
1. Set up Supabase or another PostgreSQL database
2. Add DATABASE_URL to Vercel environment variables
3. Run `npm run prisma:generate` to regenerate the client
4. Deploy again

The app will automatically detect the database and switch from mock data to real data.
