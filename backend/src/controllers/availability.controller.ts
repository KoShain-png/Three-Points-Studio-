import { Request, Response } from 'express';
import prisma from '../config/db';

function generateTimeSlots(openTime: string, closeTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);

  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;

  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0');
    const m = (current % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += 30; // 30-min interval between slot starts
  }
  return slots;
}

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { serviceId, date } = req.query as { serviceId: string; date: string };

    if (!serviceId || !date) {
      return res.status(400).json({ error: 'serviceId and date are required' });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    // Check blocked dates
    const blocked = await prisma.blockedDate.findFirst({ where: { date } });
    if (blocked) {
      return res.json({ slots: [], message: 'Studio is closed on this date' });
    }

    // Check studio hours
    const dayOfWeek = new Date(date + 'T00:00:00').getDay();
    const studioHours = await prisma.studioHours.findFirst({ where: { dayOfWeek } });

    if (!studioHours || !studioHours.isOpen) {
      return res.json({ slots: [], message: 'Studio is closed on this day' });
    }

    // Generate all slots
    const allSlots = generateTimeSlots(studioHours.openTime, studioHours.closeTime, service.duration);

    // Get existing bookings for this date
    const existingBookings = await prisma.booking.findMany({
      where: { date, status: { not: 'CANCELLED' } },
      select: { startTime: true, endTime: true },
    });

    // Filter out conflicting slots
    const available = allSlots.filter((slot) => {
      const slotStart = slot;
      const [sh, sm] = slot.split(':').map(Number);
      const slotEndMinutes = sh * 60 + sm + service.duration;
      const slotEnd = `${Math.floor(slotEndMinutes / 60).toString().padStart(2, '0')}:${(slotEndMinutes % 60).toString().padStart(2, '0')}`;

      return !existingBookings.some((b) => {
        // Check overlap: slotStart < bookingEnd AND slotEnd > bookingStart
        return slotStart < b.endTime && slotEnd > b.startTime;
      });
    });

    res.json({ slots: available, date, serviceId, duration: service.duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};
