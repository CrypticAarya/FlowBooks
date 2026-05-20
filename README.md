# FlowBooks — Full-Stack MERN SaaS

Finance tracker with JWT auth, MongoDB, and React frontend.

## Prerequisites

- Node.js 18+
- MongoDB Atlas account

## 1. Configure MongoDB password

Edit **`server/.env`** and replace `YOUR_PASSWORD` with your real Atlas password:

```env
MONGO_URI=mongodb+srv://crypticaarya_db_user:YOUR_ACTUAL_PASSWORD@cluster0.eqa3zb1.mongodb.net/flowbooks?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=flowbooks_super_secret_key
PORT=5000
```

In MongoDB Atlas → **Network Access**, allow your IP (or `0.0.0.0/0` for dev).

## 2. Start the backend

```bash
cd server
npm install
npm run dev
```

Runs on **http://localhost:5000**

## 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

Runs on **http://localhost:5173**

## API routes

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/transactions` | JWT |
| POST | `/api/transactions` | JWT |
| DELETE | `/api/transactions/:id` | JWT |
| GET | `/api/invoices` | JWT |
| POST | `/api/invoices` | JWT |
| DELETE | `/api/invoices/:id` | JWT |

## Project structure

```text
FlowBooks/
├── client/     React + Vite + Tailwind
└── server/     Express + MongoDB + JWT
```
