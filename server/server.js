import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'

dotenv.config()

connectDB()

const app = express()

const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://flow-books-19aq.vercel.app',
    ],
    credentials: true,
  })
)

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'FlowBooks API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/invoices', invoiceRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})