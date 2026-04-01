import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, cancelBooking } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', createBooking);
router.get('/mine', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
