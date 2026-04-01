# 📸 Lumière Studio — Photography Booking System

A full-stack photography studio booking website built with **Next.js 14** (frontend) and **Express.js + Prisma** (backend).

---

## 🚀 Quick Start (Local Testing)

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up the database (SQLite for local dev)
npx prisma generate
npx prisma db push

# Seed with demo data
npm run db:seed

# Start the server
npm run dev
```

Backend runs on: **http://localhost:3001**

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role  | Email                      | Password   |
|-------|----------------------------|------------|
| Admin | admin@lumierestudio.com    | admin123   |
| Client | client@example.com        | client123  |

---

## 📁 Project Structure

```
photo-studio/
├── backend/          # Express.js REST API
│   ├── prisma/       # Database schema & seed
│   └── src/          # Controllers, routes, middleware
└── frontend/         # Next.js 14 App
    └── src/
        ├── app/      # Pages (App Router)
        ├── components/
        ├── store/    # Zustand state
        └── types/
```

---

## 🌐 Key Pages

| URL | Description |
|-----|-------------|
| `/` | Home / Landing page |
| `/services` | All photography services |
| `/book` | 3-step booking flow |
| `/book/success` | Booking confirmation |
| `/login` | Client / Admin login |
| `/register` | New client registration |
| `/dashboard` | Client booking dashboard |
| `/admin` | Admin overview (stats) |
| `/admin/bookings` | All bookings management |
| `/admin/services` | CRUD for services |
| `/admin/clients` | Client list |

---

## 🔌 API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | — | Register client |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/services` | — | List services |
| GET | `/api/availability` | — | Get time slots |
| POST | `/api/bookings` | JWT | Create booking |
| GET | `/api/bookings/mine` | JWT | My bookings |
| PATCH | `/api/bookings/:id/cancel` | JWT | Cancel booking |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/bookings` | Admin | All bookings |
| GET | `/api/admin/clients` | Admin | All clients |

---

## 🚢 Production Deployment

### Backend → Railway
1. Create a Railway project
2. Add PostgreSQL plugin
3. Change `prisma/schema.prisma` datasource to `postgresql`
4. Change `DATABASE_URL` in Railway env vars
5. Push repo — Railway auto-deploys

### Frontend → Vercel
1. Import repo to Vercel
2. Set `NEXT_PUBLIC_API_URL` = your Railway backend URL
3. Deploy

---

## ⚙️ Environment Variables

**Backend `.env`**
```
PORT=3001
DATABASE_URL="file:./dev.db"   # SQLite local
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```
