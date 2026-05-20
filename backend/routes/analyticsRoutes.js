import express from 'express';
import { getAnalyticsOverview } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the JWT protect middleware to all analytics routes
router.use(protect);

// GET /api/analytics/overview
router.route('/overview').get(getAnalyticsOverview);

export default router;
