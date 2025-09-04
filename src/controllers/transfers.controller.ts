import { Request, Response, NextFunction } from 'express';
import { TransfersService } from '../services/transfers.service.js';

export async function createTransfer(req: Request, res: Response, next: NextFunction) {
  try {
    const { fromAccountId, toAccountId, amount } = (req as any).body;
    const idem = req.header('Idempotency-Key') || undefined;
    const transfer = await TransfersService.create(fromAccountId, toAccountId, amount, idem);
    res.status(201).json(transfer);
  } catch (e: any) {
    if (e?.message === 'Insufficient funds') return res.status(400).json({ error: { message: e.message } });
    if (e?.message === 'Account not found') return res.status(404).json({ error: { message: e.message } });
    next(e);
  }
}
