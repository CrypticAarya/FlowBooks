import express from 'express';
import { getSubscription, upgradePlan, cancelSubscription, getUsageStats } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSubscription);
router.post('/upgrade', upgradePlan);
router.post('/cancel', cancelSubscription);
router.get('/usage', getUsageStats);

export default router;
