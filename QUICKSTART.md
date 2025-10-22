# ⚡ SUPTRACKER - Quick Start Guide

Get SUPTRACKER running in **5 minutes**!

## 🎯 Prerequisites

You need:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ PostgreSQL 12+ OR use free cloud database (see below)

## 🚀 Option 1: Quick Start with Cloud Database (Recommended)

**No local PostgreSQL needed!**

### Step 1: Get a Free Database

Go to **Neon.tech** (fastest):
1. Visit https://console.neon.tech/signup
2. Sign up (free)
3. Create a project called "suptracker"
4. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

### Step 2: Clone & Setup

```bash
# Clone the repo
git clone https://github.com/HamzaQai/CreditCardFraudDetector.git
cd CreditCardFraudDetector

# Checkout the branch
git checkout claude/suptracker-initial-setup-011CUNt797JCqXgC2zamC9Vo

# Install all dependencies (both frontend & backend)
npm run install:all
```

### Step 3: Configure Environment

Create `.env` file in the root directory:

```env
DATABASE_URL=your-neon-connection-string-here
JWT_SECRET=mysupersecretkey12345678901234567890
CLIENT_URL=http://localhost:5173
PORT=3000
```

**Important:** Replace `your-neon-connection-string-here` with your actual Neon database URL!

### Step 4: Seed Database

```bash
npm run seed
```

You should see:
```
🌱 Starting database seeding...
✅ Added: Vitamine D3
✅ Added: Magnésium Glycinate
...
📊 Total supplements added: 30+
```

### Step 5: Start the App

Open **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

Wait for: `🚀 Server running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

Wait for: `➜  Local:   http://localhost:5173/`

### Step 6: Open in Browser

Go to: **http://localhost:5173**

🎉 **You're done!** Now sign up and start tracking supplements!

---

## 🐳 Option 2: Quick Start with Docker

**Easiest - Everything in one command!**

```bash
# Make sure Docker is installed and running
docker --version

# Clone the repo
git clone https://github.com/HamzaQai/CreditCardFraudDetector.git
cd CreditCardFraudDetector
git checkout claude/suptracker-initial-setup-011CUNt797JCqXgC2zamC9Vo

# Start everything (database, backend, frontend)
docker-compose up
```

Go to: **http://localhost:5173**

That's it! 🚀

---

## 💻 Option 3: Local PostgreSQL

**If you want to run PostgreSQL locally:**

### macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
createdb suptracker
```

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb suptracker
```

### Windows:
Download from https://www.postgresql.org/download/windows/ and install.

Then follow Steps 2-6 from Option 1, using this database URL in `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/suptracker
```

---

## ✅ First Steps After Starting

1. **Sign Up**: Click "S'inscrire" and create an account
2. **Browse Supplements**: Go to "Base de données" tab
3. **Add Supplements**: Click "Ajouter à ma stack" on any supplement
4. **View Dashboard**: See your daily schedule
5. **Mark as Taken**: Check off supplements as you take them
6. **Track Progress**: View your weekly adherence chart

---

## 🎨 Test User Journey

Try this flow to test all features:

1. **Land** → See marketing page
2. **Sign Up** → Create account (e.g., test@example.com)
3. **Dashboard** → Empty state, click "Parcourir la base de données"
4. **Supplements** → Search "vitamine D", click "Ajouter à ma stack"
5. **Configure** → Set dosage "2000 UI", time "Matin", frequency "Quotidien"
6. **My Stack** → See your added supplement
7. **Add More** → Add Magnesium, Omega-3, Créatine
8. **Dashboard** → See today's schedule organized by time
9. **Mark Taken** → Check off Vitamine D
10. **See Stats** → Watch your adherence percentage update
11. **Profile** → View your account info

---

## 📊 Sample Test Data

Try adding these supplements to see the full experience:

**Morning:**
- Vitamine D3 (2000 UI)
- Oméga-3 (1000 mg)
- Multivitamines (1 comprimé)

**Afternoon:**
- Créatine (5g)

**Evening:**
- Magnésium Glycinate (400 mg)
- L-Théanine (200 mg)

Mark some as taken, leave others unchecked, and see your adherence stats!

---

## 🐛 Common Issues

### "Cannot connect to PostgreSQL"
**Solution:**
- Check database is running: `psql -U postgres -d suptracker`
- Verify `DATABASE_URL` in `.env` is correct

### "Module not found" errors
**Solution:**
```bash
npm run install:all
```

### Port 3000 or 5173 already in use
**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
lsof -ti:5173 | xargs kill -9

# Or change ports in .env and vite.config.js
```

### Database tables not created
**Solution:**
```bash
# The server auto-creates tables on startup
# If issues persist, restart the server
npm run dev:server
```

---

## 📱 Mobile Testing

Test responsive design:
1. Open http://localhost:5173
2. Press `F12` (DevTools)
3. Click device toggle (phone icon)
4. Select "iPhone 12 Pro" or similar
5. Test all features on mobile view

---

## 🎯 Next: Deploy to Production

Once local testing works, see **DEPLOYMENT.md** for:
- Deploy to Vercel + Railway (free)
- Deploy to Render (free)
- Docker deployment
- Custom domain setup

---

## 📞 Need Help?

**Logs to check:**

Backend logs:
```bash
# Should show in terminal 1 where you ran dev:server
```

Frontend logs:
```bash
# Browser DevTools → Console tab
```

Database logs:
```bash
# Check PostgreSQL logs in terminal
```

**Quick fixes:**
1. Restart both servers
2. Clear browser cache
3. Check `.env` file exists and has correct values
4. Verify database is accessible

---

**Ready to deploy?** → See `DEPLOYMENT.md`

**Ready to customize?** → Check the code in `client/src/` and `server/`

Happy tracking! 💊✨
