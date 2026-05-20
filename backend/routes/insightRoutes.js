import express from 'express';
import { getInsightsOverview } from '../controllers/insightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getInsightsOverview);

export default router;
