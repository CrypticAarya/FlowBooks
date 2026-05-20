import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

import transactionRoutes from './routes/transactionRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FlowBooks API Server is running successfully!',
  });
});

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/reports', reportRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start Server
const server = app.listen(PORT, () => {
  console.log(
    `🚀 FlowBooks Server running in ${process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  );
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Promise Rejection: ${err.message}`);

  server.close(() => process.exit(1));
});