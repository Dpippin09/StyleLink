const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearMockData() {
  try {
    console.log('🧹 Clearing mock data from database...');
    
    // Delete in correct order to handle foreign key constraints
    await prisma.productImage.deleteMany({});
    console.log('  ✓ Deleted product images');
    
    await prisma.product.deleteMany({});
    console.log('  ✓ Deleted products');
    
    await prisma.brand.deleteMany({});
    console.log('  ✓ Deleted brands');
    
    await prisma.category.deleteMany({});
    console.log('  ✓ Deleted categories');
    
    console.log('✅ Mock data cleared successfully!');
    console.log('');
    console.log('📋 Database is now empty and ready for real API integrations.');
    console.log('   Real products will be populated when:');
    console.log('   • eBay, Amazon, and Google Shopping APIs are connected');
    console.log('   • API keys are properly configured');
    console.log('   • Users search for products');
    
  } catch (error) {
    console.error('❌ Error clearing mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMockData();
