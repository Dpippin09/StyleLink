import type { PrismaClient } from '@prisma/client'

let PrismaClientConstructor: typeof PrismaClient | null = null

// Try to import Prisma, but handle gracefully if it fails
try {
  const { PrismaClient: PrismaClientImport } = require('@prisma/client')
  PrismaClientConstructor = PrismaClientImport
} catch (error) {
  console.log('Prisma client not available, will use mock data')
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// Only create Prisma client if we have both the constructor and database URL
function createPrismaClient(): PrismaClient | null {
  // Check if Prisma client is available
  if (!PrismaClientConstructor) {
    console.log('Prisma client constructor not available, using mock data')
    return null
  }

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
    return new PrismaClientConstructor({
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
