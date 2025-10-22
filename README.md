# 💊 SUPTRACKER - Application de Gestion de Compléments Alimentaires

![React](https://img.shields.io/badge/react-18.2-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-latest-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**Application web progressive (PWA) pour gérer intelligemment vos compléments alimentaires.**

Optimisez votre santé avec un suivi des prises, des rappels personnalisés, une détection d'interactions et des recommandations basées sur une base de données de plus de 30 compléments alimentaires populaires.

---

## 🎯 Fonctionnalités

### ✅ Suivi intelligent
- Programmez vos compléments par moment de la journée (matin, après-midi, soir)
- Marquez vos prises quotidiennes
- Visualisez votre streak de jours consécutifs
- Suivez votre taux d'adhérence hebdomadaire

### 📊 Statistiques détaillées
- Dashboard avec graphiques de progression
- Taux d'adhérence hebdomadaire
- Historique complet des prises
- Statistiques personnalisées

### 🗄️ Base de données complète
- Plus de 30 compléments pré-remplis
- Informations détaillées (bénéfices, warnings, interactions)
- Dosages recommandés
- Liens d'achat (affiliés)

### 👤 Gestion de compte
- Authentification sécurisée (JWT)
- Profils Gratuit et Premium
- Limite de 5 compléments pour les utilisateurs gratuits
- Compléments illimités pour Premium

---

## 🛠️ Stack Technique

### Frontend
- **React 18.2** avec Vite
- **React Router 6** pour la navigation
- **Tailwind CSS 3** pour le styling
- **Lucide React** pour les icônes
- **Axios** pour les appels API
- **date-fns** pour la gestion des dates

### Backend
- **Node.js 18+** avec Express.js
- **PostgreSQL** pour la base de données
- **JSON Web Tokens (JWT)** pour l'authentification
- **bcrypt** pour le hashage des mots de passe
- **express-validator** pour la validation

---

## 📁 Structure du Projet

```
/
├── client/                 # Frontend React
│   ├── public/
│   │   ├── manifest.json  # Configuration PWA
│   │   └── icons/
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Input.jsx
│   │   │   └── CategoryBadge.jsx
│   │   ├── pages/         # Pages principales
│   │   │   ├── Landing.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyStack.jsx
│   │   │   ├── SupplementsDatabase.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/       # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── services/      # Services API
│   │   │   └── api.js
│   │   ├── utils/         # Fonctions utilitaires
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                # Backend Express
│   ├── config/
│   │   └── db.js         # Configuration PostgreSQL
│   ├── routes/
│   │   ├── auth.js       # Routes d'authentification
│   │   ├── supplements.js
│   │   ├── userSupplements.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js       # Middleware JWT
│   ├── seed/
│   │   └── supplements.js # Seed de 30+ compléments
│   ├── server.js         # Point d'entrée
│   └── package.json
│
├── .env                  # Variables d'environnement
└── README.md
```

---

## 🗄️ Schéma de Base de Données

### Table: `users`
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `password` (VARCHAR, NOT NULL) - Hashé avec bcrypt
- `name` (VARCHAR, NOT NULL)
- `subscription_tier` (VARCHAR) - 'free' ou 'premium'
- `created_at`, `updated_at`

### Table: `supplements`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `category` (VARCHAR) - vitamin, mineral, amino_acid, plant, probiotic, omega, other
- `description` (TEXT)
- `recommended_dosage` (VARCHAR)
- `dosage_unit` (VARCHAR)
- `best_time` (VARCHAR) - morning, afternoon, evening, with_meal, empty_stomach, anytime
- `benefits` (TEXT[])
- `warnings` (TEXT[])
- `interactions` (TEXT[])
- `created_at`

### Table: `user_supplements`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (FK → users)
- `supplement_id` (FK → supplements)
- `custom_dosage` (VARCHAR)
- `frequency` (VARCHAR) - daily, weekly, as_needed
- `time_of_day` (VARCHAR)
- `days_of_week` (INTEGER[])
- `start_date` (DATE)
- `notes` (TEXT)
- `is_active` (BOOLEAN)
- `created_at`

### Table: `intake_logs`
- `id` (SERIAL PRIMARY KEY)
- `user_supplement_id` (FK → user_supplements)
- `taken_at` (TIMESTAMP)
- `notes` (TEXT)
- `mood_rating` (INTEGER 1-5)
- `energy_rating` (INTEGER 1-5)

### Table: `affiliate_links`
- `id` (SERIAL PRIMARY KEY)
- `supplement_id` (FK → supplements)
- `store_name` (VARCHAR)
- `url` (TEXT)
- `price` (DECIMAL)
- `currency` (VARCHAR)
- `is_recommended` (BOOLEAN)

---

## 🚀 Installation et Utilisation

### Prérequis
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### 1. Cloner le repository
```bash
git clone <repository-url>
cd CreditCardFraudDetector
```

### 2. Configurer les variables d'environnement
Créer un fichier `.env` à la racine :
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suptracker

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Backend Port
PORT=3000
```

### 3. Installer les dépendances

**Backend :**
```bash
cd server
npm install
```

**Frontend :**
```bash
cd client
npm install
```

### 4. Initialiser la base de données
La base de données sera automatiquement initialisée au démarrage du serveur, mais vous pouvez aussi créer manuellement les tables en vous connectant à PostgreSQL et en exécutant les requêtes SQL du fichier `server/config/db.js`.

### 5. Seed de la base de données (optionnel)
Pour pré-remplir la base avec 30+ compléments :
```bash
cd server
npm run seed
```

### 6. Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd server
npm start
# Serveur sur http://localhost:3000
```

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
# Application sur http://localhost:5173
```

---

## 📱 API Endpoints

### Authentification (`/api/auth`)
- **POST** `/signup` - Créer un compte
- **POST** `/login` - Se connecter
- **GET** `/me` - Obtenir l'utilisateur actuel (protégé)

### Supplements (`/api/supplements`)
- **GET** `/` - Lister tous les compléments (avec filtres optionnels)
- **GET** `/:id` - Obtenir un complément par ID

### User Supplements (`/api/user/supplements`)
- **GET** `/` - Lister les compléments de l'utilisateur
- **POST** `/` - Ajouter un complément
- **PATCH** `/:id` - Modifier un complément
- **DELETE** `/:id` - Supprimer un complément
- **POST** `/:id/log` - Logger une prise

### Dashboard (`/api/dashboard`)
- **GET** `/today` - Programme du jour + stats
- **GET** `/stats?period=week|month` - Statistiques d'adhérence

---

## 🎨 Design System

### Palette de couleurs
- **Primary (Green)**: `#22c55e` (emerald-500)
- **Secondary (Slate)**: `#64748b` (slate-500)
- **Accent (Amber)**: `#f59e0b` (amber-500)

### Composants Tailwind réutilisables
- `.btn-primary` - Bouton principal vert
- `.btn-secondary` - Bouton secondaire gris
- `.btn-outline` - Bouton outline
- `.input` - Champ de saisie
- `.select` - Sélecteur
- `.card` - Carte blanche avec ombre

---

## 🔐 Sécurité

- **Mots de passe hashés** avec bcrypt (salt rounds: 10)
- **JWT tokens** avec expiration de 7 jours
- **Validation des données** avec express-validator
- **Protection CORS** configurée
- **Middleware d'authentification** sur toutes les routes protégées

---

## 💡 Fonctionnalités Futures (Roadmap)

- [ ] **Détection d'interactions** entre compléments (Premium)
- [ ] **Notifications push** via PWA
- [ ] **Gestion des stocks** (date d'expiration, quantité restante)
- [ ] **Recommandations IA** basées sur l'historique
- [ ] **Partage de stacks** entre utilisateurs
- [ ] **Mode sombre**
- [ ] **Application mobile native** (React Native)
- [ ] **Intégration Apple Health / Google Fit**

---

## 📊 Compléments Pré-remplis

La base de données contient 30+ compléments populaires :
- **Vitamines**: D3, B12, C, E, K2, Complexe B
- **Minéraux**: Magnésium, Zinc, Fer, Calcium, Sélénium, Iode
- **Acides aminés**: Créatine, L-Théanine, Glycine, NAC, Taurine, BCAA
- **Plantes**: Ashwagandha, Rhodiola, Curcuma, Ginkgo Biloba, Ginseng, Spiruline
- **Oméga**: Oméga-3 EPA/DHA
- **Probiotiques**: Multi-souches
- **Autres**: CoQ10, Collagène, Mélatonine, Acide Alpha-Lipoïque

Chaque complément inclut :
- Description détaillée
- Bénéfices
- Dosage recommandé
- Meilleur moment de prise
- Warnings et contre-indications
- Interactions potentielles

---

## 👨‍💻 Développement

### Scripts disponibles

**Frontend (client/) :**
```bash
npm run dev      # Démarrer en mode développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
```

**Backend (server/) :**
```bash
npm start        # Démarrer le serveur
npm run dev      # Démarrer avec nodemon (auto-reload)
npm run seed     # Seed de la base de données
```

---

## 📄 Licence

Ce projet est un projet personnel d'apprentissage.

---

## 👨‍💼 Contact

**Développeur**
📧 Email : amza.qaissi@gmail.com
💼 LinkedIn : [Hamza Qaissi](https://www.linkedin.com/in/hamza-qaissi-a7a128137/)

---

## 🙏 Remerciements

- Design inspiré par les meilleures pratiques UX/UI modernes
- Base de données de compléments compilée à partir de sources scientifiques
- Stack technique basée sur les outils les plus populaires de 2024
