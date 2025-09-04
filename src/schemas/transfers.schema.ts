import { z } from 'zod';
export const createTransferSchema = z.object({
  body: z.object({
    fromAccountId: z.number().int().positive(),
    toAccountId: z.number().int().positive(),
    amount: z.number().positive()
  })
}).refine((data) => data.body.fromAccountId !== data.body.toAccountId, {
  message: 'fromAccountId and toAccountId must differ',
  path: ['body', 'toAccountId']
});
