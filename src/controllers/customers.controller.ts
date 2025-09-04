import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = (req as any).body;
    const customer = await prisma.customer.create({ data: { name, email } });
    res.status(201).json(customer);
  } catch (e) { next(e); }
}
