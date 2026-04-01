import { Request, Response } from 'express';
import prisma from '../config/db';

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    res.json({ services });
  } catch {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ service });
  } catch {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, price, imageUrl } = req.body;
    if (!name || !description || !duration || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const service = await prisma.service.create({
      data: { name, description, duration: Number(duration), price: Number(price), imageUrl },
    });
    res.status(201).json({ service });
  } catch {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, price, imageUrl, isActive } = req.body;
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(duration && { duration: Number(duration) }),
        ...(price && { price: Number(price) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    res.json({ service });
  } catch {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await prisma.service.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Service deactivated' });
  } catch {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
