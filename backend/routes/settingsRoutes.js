import express from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

export default router;
