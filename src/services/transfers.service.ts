import { PrismaClient, Prisma } from '@prisma/client';
import crypto from 'crypto';
import { notFound, badRequest } from '../libs/httpErrors.js';

const prisma = new PrismaClient();

function hashRequest(payload: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export const TransfersService = {
  create: async (
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    idempotencyKey?: string
  ) => {
    const payload = { fromAccountId, toAccountId, amount };
    const requestHash = hashRequest(payload);

    if (idempotencyKey) {
      const existing = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } });
      if (existing) return existing.responseData as any;
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const from = await tx.account.findUnique({ where: { id: fromAccountId } });
      const to = await tx.account.findUnique({ where: { id: toAccountId } });

      if (!from || !to) throw notFound('One or both accounts not found');
      const fromBal = Number(from.balance);
      if (fromBal < amount) throw badRequest('Insufficient funds');

      await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } }
      });
      await tx.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } }
      });

      const transfer = await tx.transfer.create({
        data: { fromAccount: fromAccountId, toAccount: toAccountId, amount }
      });

      return transfer;
    });

    if (idempotencyKey) {
      await prisma.idempotencyKey.upsert({
        where: { key: idempotencyKey },
        update: { responseData: result, requestHash },
        create: { key: idempotencyKey, requestHash, responseData: result }
      });
    }

    return result;
  }
};
