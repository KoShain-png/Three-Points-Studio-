import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && { status }),
        ...(date && { date }),
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        service: true,
      },
      orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
    });
    res.json({ bookings });
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: { service: true, user: { select: { name: true, email: true } } },
    });
    res.json({ booking });
  } catch {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

export const getAllClients = async (_req: Request, res: Response) => {
  try {
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true, name: true, email: true, phone: true, createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ clients });
  } catch {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [totalBookings, confirmedBookings, totalRevenue, totalClients] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.aggregate({
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { totalPrice: true },
      }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, service: { select: { name: true } } },
    });

    res.json({
      stats: {
        totalBookings,
        confirmedBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalClients,
      },
      recentBookings,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getBlockedDates = async (_req: Request, res: Response) => {
  try {
    const dates = await prisma.blockedDate.findMany({ orderBy: { date: 'asc' } });
    res.json({ blockedDates: dates });
  } catch {
    res.status(500).json({ error: 'Failed to fetch blocked dates' });
  }
};

export const addBlockedDate = async (req: Request, res: Response) => {
  try {
    const { date, reason } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });
    const blocked = await prisma.blockedDate.create({ data: { date, reason } });
    res.status(201).json({ blockedDate: blocked });
  } catch {
    res.status(500).json({ error: 'Failed to add blocked date' });
  }
};

export const removeBlockedDate = async (req: Request, res: Response) => {
  try {
    await prisma.blockedDate.delete({ where: { id: req.params.id } });
    res.json({ message: 'Blocked date removed' });
  } catch {
    res.status(500).json({ error: 'Failed to remove blocked date' });
  }
};

export const getStudioHours = async (_req: Request, res: Response) => {
  try {
    const hours = await prisma.studioHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
    res.json({ hours });
  } catch {
    res.status(500).json({ error: 'Failed to fetch studio hours' });
  }
};

export const updateStudioHours = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, openTime, closeTime, isOpen } = req.body;
    const hours = await prisma.studioHours.upsert({
      where: { id: `day-${dayOfWeek}` },
      update: { openTime, closeTime, isOpen },
      create: { id: `day-${dayOfWeek}`, dayOfWeek, openTime, closeTime, isOpen },
    });
    res.json({ hours });
  } catch {
    res.status(500).json({ error: 'Failed to update studio hours' });
  }
};
