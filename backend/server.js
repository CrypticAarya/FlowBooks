import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import transactionRoutes from './routes/transactionRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Standard request body parsers and cross-origin resource sharing
app.use(cors());
app.use(express.json());

// Basic sanity API ping route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FlowBooks API Server is active and operational!',
  });
});

// RESTful Route bindings
app.use('/api/transactions', transactionRoutes);
app.use('/api/invoices', invoiceRoutes);

// Centralized error interceptor middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 FlowBooks Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful rejection handler
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
