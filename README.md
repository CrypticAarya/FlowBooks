# FlowBooks — Full-Stack MERN SaaS

Finance tracker with JWT auth, MongoDB, and React frontend.

## Local development

### 1. MongoDB

Edit `server/.env` (copy from `server/.env.example`) and set your Atlas password.

### 2. Backend

```bash
cd server
npm install
npm run dev
```

Runs on **http://localhost:5000**

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Runs on **http://localhost:5173**

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Deploy to production

### Backend — Render

1. Push repo to GitHub.
2. [Render](https://render.com) → **New Web Service** → connect repo.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance:** Free (or paid)
4. Environment variables:

| Key | Value |
|-----|--------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret string |
| `CLIENT_URL` | Your Vercel URL (e.g. `https://flowbooks.vercel.app`) |
| `PORT` | `5000` (Render sets `PORT` automatically — optional) |

5. Deploy. Copy your Render URL, e.g. `https://flowbooks-api.onrender.com`.

6. MongoDB Atlas → **Network Access** → allow `0.0.0.0/0` (or Render IPs).

Test: `https://your-api.onrender.com/api/health`

---

### Frontend — Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → import repo.
2. Settings:
   - **Root Directory:** `client`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment variable:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://your-api.onrender.com/api` |

4. Deploy.

`client/vercel.json` handles SPA routing (refresh on `/dashboard` works).

---

### Connect frontend + backend

1. Render `CLIENT_URL` = your Vercel URL (no trailing slash).
2. Vercel `VITE_API_URL` = Render API URL + `/api`.
3. Redeploy both after changing env vars.

---

## API routes

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET/POST | `/api/transactions` | JWT |
| PUT/DELETE | `/api/transactions/:id` | JWT |
| GET/POST | `/api/invoices` | JWT |
| PUT/DELETE | `/api/invoices/:id` | JWT |

---

## Project structure

```text
FlowBooks/
├── client/     React + Vite + Tailwind (deploy: Vercel)
└── server/     Express + MongoDB (deploy: Render)
```
