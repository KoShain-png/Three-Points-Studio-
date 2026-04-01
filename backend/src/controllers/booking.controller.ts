import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, date, startTime, notes } = req.body;

    if (!serviceId || !date || !startTime) {
      return res.status(400).json({ error: 'serviceId, date, and startTime are required' });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    // Calculate end time
    const [sh, sm] = startTime.split(':').map(Number);
    const endMinutes = sh * 60 + sm + service.duration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    // Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        date,
        status: { not: 'CANCELLED' },
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (conflict) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.userId,
        serviceId,
        date,
        startTime,
        endTime,
        status: 'CONFIRMED',
        totalPrice: service.price,
        notes,
      },
      include: { service: true, user: { select: { name: true, email: true } } },
    });

    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.userId },
      include: { service: true },
      orderBy: { date: 'desc' },
    });
    res.json({ bookings });
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { service: true, user: { select: { name: true, email: true, phone: true } } },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only allow owner or admin
    if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
      include: { service: true },
    });

    res.json({ message: 'Booking cancelled', booking: updated });
  } catch {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
