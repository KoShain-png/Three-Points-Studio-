@echo off
echo.
echo 📸 Lumière Studio — Local Setup
echo ================================
echo.

echo 🔧 Setting up backend...
cd backend
call npm install
call npx prisma generate
call npx prisma db push
call npx ts-node prisma/seed.ts
echo ✅ Backend ready

cd ..

echo 🎨 Installing frontend...
cd frontend
call npm install
echo ✅ Frontend ready

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📋 Demo credentials:
echo    Admin:  admin@lumierestudio.com / admin123
echo    Client: client@example.com / client123
echo.
echo 🚀 To start the app, open TWO terminals:
echo.
echo    Terminal 1 (backend):  cd backend ^&^& npm run dev
echo    Terminal 2 (frontend): cd frontend ^&^& npm run dev
echo.
echo    Then open: http://localhost:3000
echo.
pause
