import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumierestudio.com' },
    update: {},
    create: {
      name: 'Studio Admin',
      email: 'admin@lumierestudio.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+65 9000 0000',
    },
  });

  // Test client
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'client@example.com',
      password: clientPassword,
      role: 'CLIENT',
      phone: '+65 9111 1111',
    },
  });

  // Services
  const services = [
    {
      name: 'Portrait Session',
      description: 'A focused 1-hour portrait session with professional lighting. Includes up to 3 outfit changes and 20 edited digital images.',
      duration: 60,
      price: 280,
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    },
    {
      name: 'Couple & Love Story',
      description: 'Romantic 90-minute session for couples. Perfect for engagements, anniversaries, or just celebrating your love. 35 edited images.',
      duration: 90,
      price: 420,
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    },
    {
      name: 'Family Portrait',
      description: 'A 2-hour session designed for families of all sizes. Capture precious moments together with 50 edited digital images.',
      duration: 120,
      price: 580,
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800',
    },
    {
      name: 'Newborn & Baby',
      description: 'Gentle 3-hour newborn session in our warm, safe studio. Includes props and wraps. 40 edited images of your little one.',
      duration: 180,
      price: 680,
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800',
    },
    {
      name: 'Corporate Headshot',
      description: 'Professional 45-minute headshot session for LinkedIn, websites, and corporate use. 10 edited images with multiple backgrounds.',
      duration: 45,
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
    },
    {
      name: 'Full Day Commercial',
      description: 'Full 8-hour studio booking for commercial shoots, product photography, or large productions. Includes studio assistant.',
      duration: 480,
      price: 2400,
      imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: service.name.toLowerCase().replace(/ /g, '-'),
        ...service,
      },
    });
  }

  // Studio hours (Mon-Sat 9am-7pm, Sun closed)
  const hours = [
    { dayOfWeek: 0, openTime: '09:00', closeTime: '17:00', isOpen: false }, // Sun
    { dayOfWeek: 1, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Mon
    { dayOfWeek: 2, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Tue
    { dayOfWeek: 3, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Wed
    { dayOfWeek: 4, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Thu
    { dayOfWeek: 5, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Fri
    { dayOfWeek: 6, openTime: '09:00', closeTime: '17:00', isOpen: true },  // Sat
  ];

  for (const hour of hours) {
    await prisma.studioHours.upsert({
      where: { id: `day-${hour.dayOfWeek}` },
      update: hour,
      create: { id: `day-${hour.dayOfWeek}`, ...hour },
    });
  }

  // Sample booking
  await prisma.booking.create({
    data: {
      userId: client.id,
      serviceId: 'portrait-session',
      date: '2025-02-15',
      startTime: '10:00',
      endTime: '11:00',
      status: 'CONFIRMED',
      totalPrice: 280,
      notes: 'Please prepare a white background option.',
    },
  }).catch(() => {}); // ignore duplicate

  console.log('✅ Seed complete!');
  console.log('');
  console.log('👤 Admin login:  admin@lumierestudio.com / admin123');
  console.log('👤 Client login: client@example.com / client123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
