#!/bin/bash
set -e

echo ""
echo "📸 Lumière Studio — Local Setup"
echo "================================"
echo ""

# Backend
echo "🔧 Setting up backend..."
cd backend
npm install --silent
npx prisma generate --silent
npx prisma db push --silent
npx ts-node prisma/seed.ts
echo "✅ Backend ready"

cd ..

# Frontend
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install --silent
echo "✅ Frontend ready"

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Demo credentials:"
echo "   Admin:  admin@lumierestudio.com / admin123"
echo "   Client: client@example.com / client123"
echo ""
echo "🚀 To start the app, open TWO terminals:"
echo ""
echo "   Terminal 1 (backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "   Then open: http://localhost:3000"
echo ""
