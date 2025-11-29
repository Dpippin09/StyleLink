#!/bin/bash

# Prisma generation script for Vercel deployment
echo "Starting Prisma client generation for Vercel..."

# Clear any existing Prisma client
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# Generate Prisma client with explicit binary targets
PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x npx prisma generate

echo "Prisma client generation completed!"
