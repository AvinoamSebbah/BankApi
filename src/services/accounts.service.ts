import { PrismaClient } from '@prisma/client';
import { notFound } from '../libs/httpErrors.js';
const prisma = new PrismaClient();

export async function getAccountOrThrow(id: number) {
  const acc = await prisma.account.findUnique({ where: { id } });
  if (!acc) throw notFound(`Account with id ${id} not found`);
  return acc;
}

export const AccountsService = {
  create: async (customerId: number, initialDeposit: number) => {
    return prisma.account.create({ data: { customerId, balance: initialDeposit } });
  },
  balance: async (id: number) => {
    const acc = await getAccountOrThrow(id);
    return acc.balance;
  },
  history: async (id: number, take = 50, skip = 0) => {
    return prisma.transfer.findMany({
      where: { OR: [{ fromAccount: id }, { toAccount: id }] },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    });
  }
};
