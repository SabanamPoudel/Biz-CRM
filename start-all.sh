#!/bin/bash

echo "Starting BizCRM Project..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations for backend
echo "🔄 Running backend migrations..."
cd apps/backend && pnpm prisma migrate deploy && cd ../..

# Run migrations for frontend
echo "🔄 Running frontend migrations..."
cd frontend && pnpm prisma migrate deploy && cd ..

# Start services
echo "🚀 Starting backend and frontend..."
echo "Backend will run on http://localhost:3001"
echo "Frontend will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Start backend and frontend concurrently
pnpm run dev
