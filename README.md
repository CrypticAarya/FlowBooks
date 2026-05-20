# 📊 FlowBooks — B2B SaaS Financial & Invoicing Dashboard

**[🚀 View Live Demo: flow-books.vercel.app](https://flow-books.vercel.app)**

FlowBooks is a modern, high-density **B2B SaaS financial ledger and invoice management platform** designed for freelancers, agency owners, and growing startups. Crafted with a premium Vercel/Stripe-inspired dark aesthetic, FlowBooks delivers real-time visual insights, responsive transaction tracking, and interactive statement generation through a clean, developer-friendly architecture.

---

## ✨ Key Features

*   **📈 Silky-Smooth Financial Analytics**: Interactive Cash Flow Area Charts designed with Recharts using natural cubic spline paths (`monotone`) and custom glassmorphic hover summary tooltips.
*   **🧾 Live Invoice Statements Builder**: Fully functional transaction ledger featuring instant searching, status-specific filtering tabs (`All`, `Paid`, `Pending`, `Overdue`), and dynamic real-time metric sum cards.
*   **💼 Responsive billing Modal**: Centered invoice generation modal utilizing Ant Design Form validation and custom dark select dropdown lists.
*   **✨ Micro-Interaction Hover Glows**: Custom vertical float and glowing border transition styles (`.hover-card-trigger`) on hover to make pages feel active and premium.
*   **📱 Universal Spacing Responsiveness**: Dynamic layout paddings (`p-4 sm:p-6 md:p-8`) and custom column scroll limits (`scroll={{ x: 680 }}`) to ensure a flawless experience across mobile, tablet, and ultra-wide desktop viewports.
*   **🗺️ URL Location-Sync Navigation**: Real SPA routing built with `react-router-dom` that synchronizes Sidebar and Header elements natively with the browser path history.
*   **🚀 Vercel Deployment Configurations**: Pre-configured rewrite headers (`vercel.json`) to eliminate the notorious SPA browser refresh 404 bug.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React (v19) | Reactive state management & component view tree |
| **Build Tool** | Vite + Rolldown | High-speed hot module replacement (HMR) & minification |
| **Styling Systems** | Tailwind CSS | Utility-first grid layouts & responsive design classes |
| **Component Library** | Ant Design (v5) | Modular tables, forms, icons, notifications, and select components |
| **Charting Engine** | Recharts | Rich SVG cash flow trend analytics |
| **Routing Engine** | React Router DOM (v7) | Declarative browser history routing |

---

## 📂 Repository Folder Structure

```text
FlowBooks/
├── backend/                 # Node.js + Express.js + MongoDB API Service
│   ├── config/              # Database connection pools (db.js)
│   ├── controllers/         # MVC Business controllers (transactionController, invoiceController)
│   ├── middleware/          # Centralized Express error boundary middleware
│   ├── models/              # Mongoose data schema structures (Transaction, Invoice)
│   ├── routes/              # Express API router bindings
│   ├── .env                 # Server configuration variables
│   ├── package.json         # Backend manifest
│   └── server.js            # Express application boot entrypoint
├── frontend/                # React.js + Vite Client Dashboard
│   ├── public/              # Global brand assets, favicons, and vector icons
│   ├── src/
│   │   ├── components/      # Reusable visual components
│   │   │   ├── ui/          # Granular elements (Toasts, StatCards)
│   │   │   ├── Dashboard.jsx# Transaction ledger & interactive graphs
│   │   │   ├── Sidebar.jsx  # Navigation drawer & profile footer
│   │   │   └── Header.jsx   # Search inputs & accessibility tools
│   │   ├── pages/           # High-level page-view routes
│   │   │   ├── Login.jsx    # Premium Vercel-style authentication
│   │   │   └── InvoicesPage.jsx# Interactive invoicing grid & modals
│   │   ├── App.jsx          # Central router & state manager
│   │   ├── index.css        # Tailwind directives & global Ant overrides
│   │   └── main.jsx         # DOM container mounting point
│   ├── tailwind.config.js   # Custom branding typography & layouts
│   ├── vercel.json          # Serverless routing rewriter (SPA helper)
│   ├── vite.config.js       # Vite bundler plugins
│   └── package.json         # Dependency manifest
└── README.md                # Showcase Pitch & Setup documentation
```

---

## ⚙️ Installation & Local Setup

Get the entire FlowBooks MERN application running locally on your machine in under three minutes:

### 1. Prerequisites
Ensure you have **Node.js (v18+)**, **npm (v9+)**, and a local **MongoDB** database instance running on your operating system.

### 2. Clone the Repository
```bash
git clone https://github.com/CrypticAarya/FlowBooks.git
cd FlowBooks
```


### 3. Install & Start the Backend API
In a new terminal window, navigate to the `backend` directory and boot up the development server:
```bash
cd backend
npm install
npm run dev
```
The server will connect to MongoDB and start listening on **`http://localhost:5000`** with dynamic hot-reload enabled by nodemon!

### 4. Install & Start the Frontend Client
In another terminal window, navigate to the `frontend` directory and boot up the client dev server:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to experience the HMR-powered client!

---

## 🚀 Deployment to Vercel

FlowBooks is fully configured for zero-downtime deployments on Vercel:

1. Connect your GitHub account and import the repository on the Vercel dashboard.
2. Select **Vite** as the framework preset.
3. Configure the following project parameters:
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Click **Deploy**. Vercel will build the files and host them securely on its global edge CDN.

> [!NOTE]
> The included `vercel.json` rewrite rule automatically maps all incoming virtual browser refreshes back to `/index.html`, meaning React Router handles subpages perfectly with no server 404 errors!

---

## 🔮 Screenshots Section

### 1. Dashboard Financial Center
*Vercel-style dark interface featuring custom Area Charts, interactive ledger transaction additions, and metrics cards.*

### 2. Statement Manager & Modal
*High-density table showing dynamic pagination, live search filtering, status tab triggers, and customized modal forms.*

### 3. Minimalist Authentication
*Centered high-contrast card login layout with secure validation checks and dark-mode checkbox custom controls.*

---

## 🛣️ Future Roadmap

*   **🔌 Express.js & MongoDB Integration**: Complete MERN-stack backend connection to persist transaction ledgers and client profiles.
*   **💳 Stripe Checkout API**: Enable dynamic credit/debit invoicing directly from customer statement rows.
*   **📧 Automatic Invoice Emailing**: Connect Resend or SendGrid to dispatch professional PDF statements to clients automatically.
