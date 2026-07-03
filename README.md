# 🌟 Store Rating Management System

A production-ready, full-stack **Store Rating Management System** built as a FullStack Intern Coding Challenge. Users can browse and rate stores, Admins manage the entire platform, and Store Owners track their store's performance — all secured with role-based authentication.

🔗 **Live App:** https://store-rating-app-olive.vercel.app
📦 **GitHub Repo:** https://github.com/udayasathwika06/store-rating-app

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack & Why We Chose It](#tech-stack--why-we-chose-it)
3. [Project Architecture](#project-architecture)
4. [User Roles & Functionalities](#user-roles--functionalities)
5. [Form Validations](#form-validations)
6. [API Reference](#api-reference)
7. [Local Development Setup](#local-development-setup)
8. [Production Deployment](#production-deployment)
9. [Test Credentials](#test-credentials)
10. [Security Features](#security-features)

---

## Overview

This application allows users to submit ratings (1–5 stars) for registered stores. It uses a single login system with three role-based access levels: **System Administrator**, **Normal User**, and **Store Owner**.

---

## 🛠 Tech Stack & Why We Chose It

### Frontend

| Tool | What It Does | Why We Used It |
|------|-------------|----------------|
| **React.js (Vite)** | Builds the entire user interface | Fast builds, component-based, industry standard |
| **React Router DOM** | Handles page navigation (Login → Dashboard → etc.) | Enables SPA routing without full page reloads |
| **Axios** | Sends HTTP requests to the backend API | Cleaner than fetch, supports interceptors for auto token injection |
| **Tailwind CSS v4** | Styles every component | Utility-first CSS — extremely fast to build premium dark UIs |
| **React Hook Form** | Manages all form inputs and validations | Lightweight, performant, avoids unnecessary re-renders |
| **React Toastify** | Shows success/error popup notifications | Clean UX feedback for every user action |
| **Lucide React** | Provides all icons (Star, User, Shield, etc.) | Consistent, modern open-source icon library |
| **Context API** | Stores the logged-in user's data globally | Built into React — no extra library needed for auth state management |

### Backend

| Tool | What It Does | Why We Used It |
|------|-------------|----------------|
| **Node.js** | Runs JavaScript on the server | Fast, non-blocking, same language as frontend |
| **Express.js** | Creates the REST API (routes, middleware) | Minimal, flexible, the most popular Node.js framework |
| **Prisma ORM v6** | Talks to the database using clean JavaScript | Type-safe queries, prevents SQL injection, auto schema generation |
| **jsonwebtoken (JWT)** | Creates secure login tokens | Stateless authentication — no sessions stored on server |
| **bcryptjs** | Hashes/encrypts passwords before saving | Passwords are NEVER stored as plain text |
| **express-validator** | Validates all form inputs server-side | Backend validates even if someone bypasses the frontend |
| **Helmet** | Adds HTTP security headers automatically | Protects against XSS, clickjacking, and other common web attacks |
| **CORS** | Controls which websites can call your API | Prevents unauthorized domains from accessing the backend |
| **Morgan** | Logs every incoming HTTP request | Useful for debugging — see what is hitting the server |
| **Cookie Parser** | Reads JWT tokens from HTTP cookies | Supports both cookie-based and header-based authentication |

### Database & Hosting

| Tool | What It Does | Why We Used It |
|------|-------------|----------------|
| **PostgreSQL** | Stores all users, stores, and ratings data | Reliable, relational, industry-standard SQL database |
| **Neon** | Hosts PostgreSQL in the cloud (free) | Serverless PostgreSQL — easy setup, free tier, auto-scales |
| **Render** | Hosts the Node.js backend server | Free tier, auto-deploys from GitHub, supports env variables |
| **Vercel** | Hosts the React frontend | Free, instant deploys from GitHub, perfect for Vite/React |
| **GitHub** | Stores all source code | Version control — Render and Vercel redeploy on every push |

---

## 🏗 Project Architecture

```
store-rating-app/
├── backend/                        # Node.js + Express API Server
│   ├── config/
│   │   └── db.js                   # Prisma client singleton
│   ├── controllers/
│   │   ├── authController.js       # register, login, logout, changePassword
│   │   ├── adminController.js      # dashboard, createUser, createStore, getUsers, getStores
│   │   ├── storeController.js      # getStores, getStoreById, getOwnerStoreStats
│   │   └── ratingController.js     # submitRating, updateRating, getStoreRatings
│   ├── middleware/
│   │   ├── authMiddleware.js       # authenticate (JWT verify) + authorize (role check)
│   │   ├── validationMiddleware.js # express-validator error formatter
│   │   └── errorMiddleware.js      # global error handler
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── adminRoutes.js          # /api/admin/* (Admin only)
│   │   ├── storeRoutes.js          # /api/stores/*
│   │   └── ratingRoutes.js         # /api/ratings/*
│   ├── prisma/
│   │   ├── schema.prisma           # DB models: User, Store, Rating
│   │   └── seed.js                 # Seeds 1 Admin, 5 Owners, 10 Users, 20 Stores, 100 Ratings
│   ├── validations/
│   │   ├── authValidation.js       # register & changePassword rules
│   │   ├── userValidation.js       # admin create user rules
│   │   ├── storeValidation.js      # admin create store rules
│   │   └── ratingValidation.js     # rating submission rules
│   ├── utils/
│   │   └── response.js             # Standardized API response formatter
│   ├── app.js                      # Express app config (middleware, routes)
│   ├── server.js                   # Server entry point
│   └── .env                        # Secret environment variables (NOT in GitHub)
│
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top bar with user info + logout button
│   │   │   ├── Sidebar.jsx         # Left sidebar with role-based navigation links
│   │   │   ├── Table.jsx           # Reusable sortable + searchable + paginated table
│   │   │   ├── Modal.jsx           # Reusable popup modal component
│   │   │   ├── Breadcrumb.jsx      # Page path navigator (Home > Role > Page)
│   │   │   ├── LoadingSpinner.jsx  # Animated loading indicator
│   │   │   └── SkeletonLoader.jsx  # Skeleton placeholder for loading states
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (user, login, logout functions)
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx # Protected layout: Sidebar + Navbar + Page Outlet
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login form page
│   │   │   ├── Register.jsx        # Signup form (Normal Users only)
│   │   │   ├── AdminDashboard.jsx  # Stats cards + recent activity feed
│   │   │   ├── AdminUsersList.jsx  # Users table + Add User modal + View Details modal
│   │   │   ├── AdminStoresList.jsx # Stores table + Add Store & Owner modal
│   │   │   ├── UserDashboard.jsx   # Store cards with search, sort, and star rating
│   │   │   ├── StoreOwnerDashboard.jsx # Owner stats + ratings ledger table
│   │   │   ├── ChangePassword.jsx  # Change password form (all roles)
│   │   │   ├── Unauthorized.jsx    # 403 access denied page
│   │   │   └── NotFound.jsx        # 404 not found page
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx       # All routes with role-based guards
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with base URL + auth interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json                 # Redirects all routes to index.html (SPA fix)
│   └── index.html
│
├── .gitignore                      # Excludes node_modules, .env, dist
└── README.md
```

---

## 👥 User Roles & Functionalities

### 🔴 System Administrator
- ✅ Log in with Admin credentials
- ✅ Dashboard: Total Users count, Total Stores count, Total Ratings count, Recent Activity Feed
- ✅ Add new Users (Name, Email, Password, Address, Role)
- ✅ Add new Stores — automatically creates the Store Owner account
- ✅ View Users list: search by Name/Email/Address, filter by Role, sort by any column, pagination
- ✅ View Stores list: search, sort by Name or Rating, pagination
- ✅ View any user's full details — if Store Owner, shows their store's average rating
- ✅ Log out

### 🟢 Normal User
- ✅ Self-register via public Signup page (Name, Email, Address, Password)
- ✅ Log in and access Stores Listing
- ✅ Search stores by Name or Address
- ✅ Sort stores by Name (A-Z/Z-A) or Overall Rating (High/Low)
- ✅ Store cards show: Store Name, Address, Overall Rating, My Submitted Rating
- ✅ Submit a rating (1–5 stars) for any store
- ✅ Edit/modify a previously submitted rating
- ✅ Change password
- ✅ Log out

### 🔵 Store Owner
- ✅ Log in with credentials created by Admin
- ✅ Store Dashboard: Average Rating, Total Ratings received
- ✅ Full table of all users who rated their store (Name, Email, Rating, Date)
- ✅ Change password
- ✅ Log out

---

## ✅ Form Validations

Enforced on **both frontend (React Hook Form) and backend (express-validator)**.

| Field | Rule |
|-------|------|
| **Name** | Min 20 characters, Max 60 characters |
| **Email** | Standard email format (e.g., user@example.com) |
| **Password** | 8–16 characters, min 1 uppercase, 1 number, 1 special character |
| **Address** | Max 400 characters |
| **Rating** | Integer between 1 and 5 |

---

## 📡 API Reference

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register Normal User | No |
| `POST` | `/login` | Login any role | No |
| `POST` | `/logout` | Clear session | No |
| `PUT` | `/change-password` | Update password | ✅ Yes |

### Admin (`/api/admin`) — Admin only
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Stats + recent activity |
| `POST` | `/users` | Create any user |
| `POST` | `/stores` | Create store + owner |
| `GET` | `/users` | Paginated users list |
| `GET` | `/stores` | Paginated stores list |
| `GET` | `/user/:id` | Full user details |

### Stores (`/api/stores`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | All stores + my rating | ✅ |
| `GET` | `/owner/stats` | Owner's store stats | ✅ Store Owner |
| `GET` | `/:id` | Single store details | ✅ |

### Ratings (`/api/ratings`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/` | Submit or update rating | ✅ |
| `PUT` | `/:id` | Update specific rating | ✅ |
| `GET` | `/store/:storeId` | All ratings for store | ✅ |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (local or Neon cloud)

### Steps

```bash
# 1. Clone the project
git clone https://github.com/udayasathwika06/store-rating-app.git
cd store-rating-app

# 2. Install backend dependencies
cd backend
npm install

# 3. Create backend/.env file with:
#    PORT=5000
#    DATABASE_URL="postgresql://postgres:password@localhost:5432/store_rating"
#    JWT_SECRET="YourSecretKeyHere123!"
#    CLIENT_URL="http://localhost:5173"
#    NODE_ENV="development"

# 4. Push database schema
npx prisma db push

# 5. Seed test data
node prisma/seed.js

# 6. Start backend (runs on http://localhost:5000)
npm start

# 7. In a new terminal - install & run frontend (runs on http://localhost:5173)
cd ../frontend
npm install
npm run dev
```

---

## 🚀 Production Deployment

| Layer | Service | Notes |
|-------|---------|-------|
| **Database** | [Neon.tech](https://neon.tech) | Free PostgreSQL cloud database |
| **Backend API** | [Render.com](https://render.com) | Root Dir: `backend`, Build: `npm install && npx prisma generate && npx prisma db push`, Start: `npm start` |
| **Frontend** | [Vercel.com](https://vercel.com) | Root Dir: `frontend`, Framework: Vite |

**Render Environment Variables:**
```
DATABASE_URL = <your Neon connection string>
JWT_SECRET   = <your secret key>
CLIENT_URL   = https://store-rating-app-olive.vercel.app
```

> Every `git push` to GitHub automatically redeploys both Render and Vercel. No manual steps needed.

---

## 🔑 Test Credentials

Run `node prisma/seed.js` first (with your live DATABASE_URL), then use:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@storerating.com` | `Password123!` |
| **Store Owner 1** | `owner1@storerating.com` | `Password123!` |
| **Store Owner 2** | `owner2@storerating.com` | `Password123!` |
| **Normal User 1** | `user1@storerating.com` | `Password123!` |
| **Normal User 2** | `user2@storerating.com` | `Password123!` |

Seed creates: **1 Admin, 5 Store Owners, 10 Users, 20 Stores, 100 Ratings**

---

## 🔒 Security Features

| Feature | How |
|---------|-----|
| Password hashing | `bcryptjs` with 10 salt rounds — plain text never stored |
| JWT Auth | Signed tokens expire in 7 days |
| Role-based guards | `authorize()` middleware blocks wrong-role requests with 403 |
| Input validation | React Hook Form (frontend) + express-validator (backend) |
| HTTP security headers | `helmet` middleware |
| CORS protection | Only the Vercel URL is whitelisted |
| SQL injection protection | Prisma ORM parameterized queries |
| HttpOnly cookies | Token also stored in cookie — JS cannot access it |

---

## 📄 License

ISC
