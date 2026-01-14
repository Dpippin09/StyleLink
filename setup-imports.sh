#!/bin/bash

echo "🚀 Setting up StyleLink Product Import System"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the StyleLink root directory"
    exit 1
fi

echo "📦 Installing required dependencies..."
npm install cron @types/cron

echo "🗄️ Updating database schema..."
npx prisma db push

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📋 Creating environment configuration..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
else
    echo "⚠️  .env.local already exists, skipping copy"
fi

echo ""
echo "✅ Setup complete! 🎉"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Set AUTO_START_IMPORTS=true to enable automatic imports"
echo "3. Start your development server: npm run dev"
echo "4. Visit /admin/import to configure and test imports"
echo ""
echo "🕒 Scheduled Import Schedule:"
echo "   - Daily: 3:00 AM (10 products per category)"
echo "   - Weekly: Sunday 2:00 AM (20 products per category)"
echo ""
