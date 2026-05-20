import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getTransactions)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)

export default router
