# FlowBooks

FlowBooks is a simple full-stack finance tracking application built using the MERN stack.

The app helps users:
- track income and expenses
- manage invoices
- monitor financial performance
- view dashboard analytics in real time

Built with a clean dark SaaS-style UI and responsive design.

---

# Features

## Authentication
- User registration
- User login
- JWT authentication
- Protected routes
- Persistent login sessions

---

## Dashboard
- Revenue overview
- Expense tracking
- Profit calculation
- Recent transactions
- Recent invoices
- Dashboard charts

---

## Transactions
- Add transaction
- Edit transaction
- Delete transaction
- Search transactions
- Filter by type
- MongoDB persistence

---

## Invoices
- Create invoice
- Edit invoice
- Delete invoice
- Search invoices
- Filter by status
- Status badges

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Hot Toast

---

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

---

# Project Structure

```bash
FlowBooks/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── utils/
│   │   └── styles/
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/CrypticAarya/FlowBooks.git
cd FlowBooks
```

---

# Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

# Deployment

## Frontend
Deployed on Vercel

## Backend
Deployed on Render

## Database
Hosted on MongoDB Atlas

---

# Future Improvements

- recurring transactions
- export reports
- analytics dashboard
- team accounts
- AI financial insights
