# 🚀 SUPTRACKER - Testing & Deployment Guide

Complete guide to test locally and deploy SUPTRACKER to production.

---

## 📋 Table of Contents
1. [Local Testing](#local-testing)
2. [Testing Checklist](#testing-checklist)
3. [Production Deployment](#production-deployment)
4. [Post-Deployment](#post-deployment)

---

## 🧪 Local Testing

### Prerequisites
- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ installed ([Download](https://www.postgresql.org/download/))
- **Git** installed
- A code editor (VS Code recommended)

### Step 1: Setup PostgreSQL Database

#### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download installer from postgresql.org
   ```

2. **Create Database**
   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE suptracker;

   # Create user (optional)
   CREATE USER suptracker_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE suptracker TO suptracker_user;

   # Exit
   \q
   ```

#### Option B: Docker PostgreSQL (Easier)

```bash
# Run PostgreSQL in Docker
docker run --name suptracker-db \
  -e POSTGRES_DB=suptracker \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

#### Option C: Free Cloud Database (No local setup needed)

Use a free cloud PostgreSQL database:
- **Neon** (https://neon.tech) - Free tier, instant setup
- **Supabase** (https://supabase.com) - Free tier with 500MB
- **ElephantSQL** (https://www.elephantsql.com) - Free tier 20MB

### Step 2: Clone and Configure

```bash
# Clone the repository
git clone https://github.com/HamzaQai/CreditCardFraudDetector.git
cd CreditCardFraudDetector

# Checkout the branch
git checkout claude/suptracker-initial-setup-011CUNt797JCqXgC2zamC9Vo
```

### Step 3: Configure Environment Variables

Create a `.env` file in the **root directory**:

```env
# Database - Update with your credentials
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/suptracker

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-jwt-key-change-this-12345

# Frontend URL
CLIENT_URL=http://localhost:5173

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

**Generate a secure JWT secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### Step 4: Install Dependencies

```bash
# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install

# Return to root
cd ..
```

### Step 5: Seed the Database

```bash
cd server

# This will create tables and populate with 30+ supplements
npm run seed
```

Expected output:
```
🌱 Starting database seeding...
✅ Connected to PostgreSQL database
✅ Database tables initialized successfully
✅ Added: Vitamine D3
✅ Added: Magnésium Glycinate
...
📊 Total supplements added: 30
```

### Step 6: Start Development Servers

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
npm start

# You should see:
# ✅ Connected to PostgreSQL database
# ✅ Database tables initialized successfully
# 🚀 Server running on http://localhost:3000
# 📝 API endpoint: http://localhost:3000/api
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev

# You should see:
# VITE v5.0.8  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

### Step 7: Access the Application

Open your browser and go to: **http://localhost:5173**

You should see the beautiful landing page! 🎉

---

## ✅ Testing Checklist

### 1. Authentication Flow

- [ ] **Landing Page** - Verify it loads correctly
- [ ] **Sign Up**
  - [ ] Click "S'inscrire" button
  - [ ] Fill form: Name, Email, Password (min 8 chars)
  - [ ] Submit and verify redirect to Dashboard
  - [ ] Check browser DevTools → Network tab for successful `/api/auth/signup` call

- [ ] **Login**
  - [ ] Logout (if logged in)
  - [ ] Go to `/login`
  - [ ] Enter credentials
  - [ ] Verify redirect to Dashboard

- [ ] **Protected Routes**
  - [ ] Try accessing `/dashboard` without login → should redirect to `/login`
  - [ ] Login and verify access granted

### 2. Dashboard Features

- [ ] **Today's Schedule**
  - [ ] Should show "Aucun complément" message initially
  - [ ] Stats cards should show zeros

- [ ] **Navigation**
  - [ ] Click "Ma Stack" in sidebar → navigates correctly
  - [ ] Click "Base de données" → navigates correctly
  - [ ] Click "Profil" → navigates correctly
  - [ ] Click "Dashboard" → returns to dashboard

### 3. Supplements Database

- [ ] **Browse Supplements**
  - [ ] Go to `/supplements`
  - [ ] Verify 30+ supplements display
  - [ ] Cards show: Name, Category badge, Description, Benefits, Dosage

- [ ] **Search & Filter**
  - [ ] Search "vitamine" → results filter correctly
  - [ ] Select category "Vitamines" → shows only vitamins
  - [ ] Clear filters → shows all again

- [ ] **Add to Stack**
  - [ ] Click "Ajouter à ma stack" on Vitamine D3
  - [ ] Modal appears with form
  - [ ] Default dosage is pre-filled
  - [ ] Select frequency: "Quotidien"
  - [ ] Select time: "Matin"
  - [ ] Add optional note
  - [ ] Submit → redirects to `/my-stack`
  - [ ] Verify supplement appears in list

### 4. My Stack Management

- [ ] **View Supplements**
  - [ ] Added supplements display as cards
  - [ ] Shows: Name, Category, Dosage, Frequency, Start date

- [ ] **Add More Supplements**
  - [ ] Add 4-5 different supplements
  - [ ] For free users: Try adding 6th → should show limit warning

- [ ] **Delete Supplement**
  - [ ] Click menu (⋮) on a card
  - [ ] Click "Supprimer"
  - [ ] Confirm deletion
  - [ ] Verify it's removed from list

### 5. Dashboard with Active Supplements

- [ ] **Return to Dashboard**
  - [ ] Today's schedule now shows supplements grouped by time
  - [ ] Morning section shows morning supplements
  - [ ] Stats show correct totals (e.g., "0/6" if 6 supplements added)

- [ ] **Mark as Taken**
  - [ ] Click checkbox next to a supplement
  - [ ] Verifies it becomes checked
  - [ ] Text gets strikethrough style
  - [ ] Stats update (e.g., "1/6" taken)
  - [ ] Refresh page → checkmark persists

- [ ] **Weekly Chart**
  - [ ] Chart displays at bottom
  - [ ] Shows 7 days (Lun-Dim)
  - [ ] Percentages update as you mark supplements taken

### 6. Profile & User Info

- [ ] **Profile Page**
  - [ ] Shows user name and email
  - [ ] Shows "Gratuit" badge
  - [ ] Shows member since date
  - [ ] Premium upgrade CTA displays

### 7. Responsive Design

- [ ] **Mobile View** (resize browser to 375px width)
  - [ ] Landing page is mobile-friendly
  - [ ] Dashboard sidebar becomes hamburger menu (or stacks vertically)
  - [ ] Cards stack in single column
  - [ ] All buttons are tappable

- [ ] **Tablet View** (768px)
  - [ ] 2-column grid for supplement cards
  - [ ] Dashboard layout adjusts properly

### 8. Error Handling

- [ ] **Invalid Login**
  - [ ] Try wrong password → shows error message
  - [ ] Try non-existent email → shows error

- [ ] **Duplicate Email**
  - [ ] Try signing up with existing email → shows error

- [ ] **Network Errors**
  - [ ] Stop backend server
  - [ ] Try an action → should show error or loading state
  - [ ] Restart server → should work again

### 9. Data Persistence

- [ ] **Logout and Login**
  - [ ] Add supplements, mark some as taken
  - [ ] Logout
  - [ ] Login again
  - [ ] Verify all data persists (supplements, taken status)

---

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend + Database)

**Best for:** Easy deployment with minimal config

#### A. Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app
2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository
   - Choose the branch: `claude/suptracker-initial-setup-011CUNt797JCqXgC2zamC9Vo`

3. **Add PostgreSQL**:
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Wait for it to provision

4. **Configure Backend Service**:
   - Click on your backend service
   - Go to "Settings" → "Root Directory"
   - Set to: `server`

5. **Set Environment Variables**:
   - Go to "Variables" tab
   - Add:
     ```
     DATABASE_URL = ${{Postgres.DATABASE_URL}}
     JWT_SECRET = <generate random string>
     CLIENT_URL = https://your-app.vercel.app
     PORT = 3000
     NODE_ENV = production
     ```

6. **Deploy**:
   - Railway auto-deploys on push
   - Copy your backend URL (e.g., `https://your-app.up.railway.app`)

7. **Seed Database**:
   ```bash
   # SSH into Railway or run locally with production DB URL
   DATABASE_URL="your-railway-postgres-url" npm run seed
   ```

#### B. Deploy Frontend to Vercel

1. **Create Vercel Account**: https://vercel.com
2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Build**:
   - Framework Preset: **Vite**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   - Add in Vercel dashboard:
     ```
     VITE_API_URL = https://your-backend.up.railway.app/api
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

---

### Option 2: Render (All-in-One)

**Best for:** Single platform for everything

#### A. Create PostgreSQL Database

1. Go to https://render.com
2. Click "New" → "PostgreSQL"
3. Name: `suptracker-db`
4. Free tier is fine for testing
5. Click "Create Database"
6. Copy the "Internal Database URL"

#### B. Deploy Backend

1. Click "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   ```
   Name: suptracker-backend
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
4. Add Environment Variables:
   ```
   DATABASE_URL = <your-internal-db-url>
   JWT_SECRET = <random-string>
   CLIENT_URL = https://suptracker.onrender.com
   NODE_ENV = production
   ```
5. Click "Create Web Service"

#### C. Deploy Frontend

1. Click "New" → "Static Site"
2. Connect GitHub repository
3. Configure:
   ```
   Name: suptracker
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add Environment Variable:
   ```
   VITE_API_URL = https://suptracker-backend.onrender.com/api
   ```
5. Click "Create Static Site"

#### D. Seed Database

```bash
# Run locally with Render DB URL
DATABASE_URL="your-render-postgres-url" npm run seed
```

---

### Option 3: Replit (Fastest for Testing)

**Best for:** Quick demos and prototyping

1. **Fork to Replit**:
   - Go to https://replit.com
   - Click "Create" → "Import from GitHub"
   - Paste your repo URL

2. **Configure Replit Database**:
   - Replit provides free PostgreSQL
   - Update `.env` with Replit's DB URL

3. **Run**:
   - Install dependencies: `npm install` in both folders
   - Start backend: `cd server && npm start`
   - Start frontend: `cd client && npm run dev`
   - Replit provides a public URL automatically

---

### Option 4: Docker Deployment

**Best for:** Self-hosting or advanced users

Create `Dockerfile` in root:

```dockerfile
# Backend Dockerfile (server/Dockerfile)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Frontend Dockerfile (client/Dockerfile)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: suptracker
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/suptracker
      JWT_SECRET: your-secret-key
      CLIENT_URL: http://localhost
    depends_on:
      - db

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

---

## 🔧 Post-Deployment

### 1. Test Production App

- [ ] Visit your deployed URL
- [ ] Sign up with a new account
- [ ] Add supplements
- [ ] Mark as taken
- [ ] Verify all features work

### 2. Monitor Errors

**Backend Logs:**
- Railway: Dashboard → Logs tab
- Render: Dashboard → Logs
- Check for any errors

**Frontend Errors:**
- Open browser DevTools → Console
- Check for API connection errors

### 3. Set Up Custom Domain (Optional)

**Vercel:**
- Dashboard → Settings → Domains
- Add your domain
- Update DNS records as instructed

**Railway/Render:**
- Similar process in their dashboards

### 4. Database Backups

**Railway:**
- Automatic backups on paid plans
- Free tier: manually export with `pg_dump`

**Render:**
- Automatic daily backups on all tiers

### 5. Performance Optimization

**Frontend:**
```bash
# Analyze bundle size
cd client
npm run build
npx vite-bundle-visualizer
```

**Backend:**
- Add database indexes for frequently queried columns
- Enable connection pooling in production
- Consider Redis for caching

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Verify firewall allows connections

### "JWT token invalid"
- Check `JWT_SECRET` is set
- Clear browser localStorage and re-login

### "CORS error"
- Verify `CLIENT_URL` in backend .env
- Check CORS config in `server/server.js`

### Build fails on Vercel
- Ensure `package.json` has all dependencies
- Check Node version compatibility
- Review build logs for specific errors

### Backend crashes on Railway/Render
- Check environment variables are set
- Review logs for error messages
- Ensure database connection string is correct

---

## 📊 Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=random-64-char-string
CLIENT_URL=https://your-frontend.com
PORT=3000
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.com/api
```

---

## 🎯 Next Steps

After deployment:
1. ✅ Share your live URL with users
2. 📊 Set up analytics (Google Analytics, Plausible)
3. 🔔 Implement push notifications
4. 💳 Add payment integration for Premium tier
5. 🤖 Add interaction detection AI
6. 📱 Build mobile apps with React Native

---

**Need Help?**
- Check logs in your deployment platform
- Review browser console for frontend errors
- Test API endpoints with Postman/Insomnia
- Ensure environment variables are correct

Good luck with your deployment! 🚀
