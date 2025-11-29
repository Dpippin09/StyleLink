import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// Only create Prisma client if we have a database URL
function createPrismaClient(): PrismaClient | null {
  // In production (Vercel), if DATABASE_URL is not set, return null
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.log('Production mode: DATABASE_URL not found, using mock data fallbacks')
    } else {
      console.warn('DATABASE_URL not found, database features will be disabled')
    }
    return null
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
