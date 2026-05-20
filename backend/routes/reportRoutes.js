import express from 'express';
import { getBusinessSummary, exportCSV } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/business-summary', getBusinessSummary);
router.get('/export/csv', exportCSV);

export default router;
