import express from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.put('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
