# Store Rating Management System

A full-stack Store Rating Management System built with React.js, Express.js, PostgreSQL, and Prisma ORM. Features JWT authentication, role-based authorization, and a premium dark-themed UI.

## Tech Stack

### Frontend
- React.js (Latest) with Vite
- React Router DOM
- Axios
- Tailwind CSS v4
- React Hook Form
- React Toastify
- Lucide React Icons
- Context API for Authentication

### Backend
- Node.js / Express.js
- JWT Authentication (jsonwebtoken)
- bcryptjs for password hashing
- Express Validator
- Helmet, CORS, Morgan
- Cookie Parser
- Prisma ORM v6

### Database
- PostgreSQL

---

## Project Structure

```
Store-Rating-System/
├── backend/
│   ├── config/          # Prisma client initialization
│   ├── controllers/     # Route handlers (auth, admin, store, rating)
│   ├── middleware/       # Auth, validation, error handling
│   ├── prisma/           # Schema & seed script
│   ├── routes/           # API route definitions
│   ├── utils/            # Response formatter
│   ├── validations/      # Express-validator rules
│   ├── app.js            # Express app configuration
│   ├── server.js         # Server entry point
│   └── .env              # Environment variables
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # AuthContext (Context API)
│       ├── layouts/      # Dashboard layout
│       ├── pages/        # All page views
│       ├── routes/       # Route definitions
│       ├── services/     # Axios API instance
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running
- npm or yarn

### 1. Clone the Repository
```bash
cd Store-Rating-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Variables

Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/store_rating?schema=public"
JWT_SECRET="SuperSecretStoreRatingJWTKey123!#"
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

### 4. Database Setup (Prisma Migration)
```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Seed the Database
```bash
cd backend
npx prisma db seed
```

This creates:
- 1 Admin
- 10 Normal Users
- 5 Store Owners
- 20 Stores
- 100 Ratings

### 6. Frontend Setup
```bash
cd frontend
npm install
```

### 7. Run Backend
```bash
cd backend
npm run dev
```
Server starts on `http://localhost:5000`

### 8. Run Frontend
```bash
cd frontend
npm run dev
```
App starts on `http://localhost:5173`

---

## Test Credentials

All seeded accounts use the password: `Password123!`

| Role         | Email                        |
|--------------|------------------------------|
| Admin        | admin@storerating.com        |
| Normal User  | user1@storerating.com        |
| Store Owner  | owner1@storerating.com       |

---

## API Documentation

### Authentication
| Method | Endpoint                  | Description          | Auth |
|--------|---------------------------|----------------------|------|
| POST   | `/api/auth/register`      | Register new user    | No   |
| POST   | `/api/auth/login`         | Login                | No   |
| POST   | `/api/auth/logout`        | Logout               | No   |
| PUT    | `/api/auth/change-password` | Change password    | Yes  |

### Admin
| Method | Endpoint              | Description          | Auth  |
|--------|-----------------------|----------------------|-------|
| GET    | `/api/admin/dashboard`| Dashboard stats      | Admin |
| POST   | `/api/admin/users`    | Create user          | Admin |
| POST   | `/api/admin/stores`   | Create store + owner | Admin |
| GET    | `/api/admin/users`    | List users           | Admin |
| GET    | `/api/admin/stores`   | List stores          | Admin |
| GET    | `/api/admin/user/:id` | User details         | Admin |

### Stores
| Method | Endpoint                 | Description          | Auth |
|--------|--------------------------|----------------------|------|
| GET    | `/api/stores`            | List all stores      | Yes  |
| GET    | `/api/stores/:id`        | Store details        | Yes  |
| GET    | `/api/stores/owner/stats`| Owner's store stats  | Store Owner |

### Ratings
| Method | Endpoint                    | Description          | Auth |
|--------|-----------------------------|----------------------|------|
| POST   | `/api/ratings`              | Submit/upsert rating | User |
| PUT    | `/api/ratings/:id`          | Update rating        | User |
| GET    | `/api/ratings/store/:storeId` | Get store ratings  | Yes  |

---

## Roles

### Admin
- View dashboard (Total Users, Stores, Ratings)
- Add Users and Stores
- View User/Store lists with search, sort, pagination, filters
- View user details (with Store Owner avg rating)

### Normal User
- Register/Login
- Browse stores with search and sort
- Submit ratings (1-5 stars, one per store)
- Edit existing ratings
- Change password

### Store Owner
- Login
- View store dashboard (Average Rating, Total Ratings)
- See users who submitted ratings (name, email, rating, date)
- Change password

---

## Form Validations

| Field    | Rule                                                    |
|----------|---------------------------------------------------------|
| Name     | 20-60 characters                                        |
| Address  | Max 400 characters                                      |
| Password | 8-16 chars, 1 uppercase, 1 number, 1 special character |
| Email    | Standard email validation                               |
| Rating   | Integer between 1 and 5                                 |

---

## Security Features

- Password hashing (bcryptjs)
- JWT Authentication
- Role-based authorization middleware
- Input validation & sanitization (express-validator)
- Helmet (HTTP security headers)
- CORS configuration
- HttpOnly cookie support
- SQL injection protection (Prisma ORM)

---



ISC
