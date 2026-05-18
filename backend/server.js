import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

import transactionRoutes from './routes/transactionRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';

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