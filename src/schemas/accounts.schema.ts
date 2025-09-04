import { z } from 'zod';
export const createAccountSchema = z.object({
  body: z.object({
    customerId: z.number().int().positive(),
    initialDeposit: z.number().nonnegative().default(0)
  })
});
export const accountIdParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) })
});
