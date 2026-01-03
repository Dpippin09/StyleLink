const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testLogin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing login functionality...');
    
    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@stylelink.com' }
    });
    
    if (!user) {
      console.log('❌ Demo user not found');
      return;
    }
    
    console.log('✅ Demo user found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    // Test password verification
    const testPasswords = ['demo123', 'Demo123', 'password', '123456'];
    
    for (const testPassword of testPasswords) {
      try {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log(`Password "${testPassword}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
      } catch (error) {
        console.log(`Password "${testPassword}": ❌ Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
