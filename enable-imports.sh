#!/bin/bash

echo "🔧 StyleLink Import System - Post-Deployment Setup"
echo "=================================================="

echo "📋 This script will re-enable the import system after successful deployment"
echo ""

# Step 1: Generate Prisma client
echo "1️⃣ Generating Prisma client..."
npx prisma generate

# Step 2: Apply database schema
echo "2️⃣ Applying database schema..."
npx prisma db push

# Step 3: Re-enable import routes (manual step for now)
echo "3️⃣ Import routes need to be manually re-enabled:"
echo "   - Edit src/app/api/admin/import/route.ts"
echo "   - Edit src/app/api/admin/scheduler/route.ts" 
echo "   - Uncomment the import statements and service calls"

echo ""
echo "✅ Basic setup complete!"
echo "📝 Next: Manually uncomment the import service calls in API routes"
echo "🚀 Then redeploy to activate full import functionality"
