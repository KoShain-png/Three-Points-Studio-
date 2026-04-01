import { Router } from 'express';
import {
  getAllBookings, updateBookingStatus, getAllClients, getStats,
  getBlockedDates, addBlockedDate, removeBlockedDate, getStudioHours, updateStudioHours,
} from '../controllers/admin.controller';
import { createService, updateService, deleteService } from '../controllers/service.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/clients', getAllClients);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);
router.get('/blocked-dates', getBlockedDates);
router.post('/blocked-dates', addBlockedDate);
router.delete('/blocked-dates/:id', removeBlockedDate);
router.get('/studio-hours', getStudioHours);
router.put('/studio-hours', updateStudioHours);

export default router;
