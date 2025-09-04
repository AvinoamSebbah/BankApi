import { Request, Response, NextFunction } from 'express';
import { AccountsService } from '../services/accounts.service.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerId, initialDeposit } = (req as any).body;
    // Ensure customer exists
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) return res.status(404).json({ error: { message: 'Customer not found' } });
    const account = await AccountsService.create(customerId, initialDeposit ?? 0);
    res.status(201).json(account);
  } catch (e) { next(e); }
}

export async function getBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number((req as any).params.id);
    const balance = await AccountsService.balance(id);
    res.json({ accountId: id, balance });
  } catch (e) { next(e); }
}

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number((req as any).params.id);
    const take = Number(req.query.take ?? 50);
    const skip = Number(req.query.skip ?? 0);
    const items = await AccountsService.history(id, take, skip);
    res.json({ accountId: id, items });
  } catch (e) { next(e); }
}
