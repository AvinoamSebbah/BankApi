import { Router } from 'express';
import { createTransfer } from '../controllers/transfers.controller.js';
import { validate } from '../middlewares/validate.js';
import { createTransferSchema } from '../schemas/transfers.schema.js';

const r = Router();

/**
 * @openapi
 * /transfers:
 *   post:
 *     summary: Transfer money between accounts
 *     description: Transfers a specified amount from one account to another. Supports idempotency to prevent duplicate transfers.
 *     tags: 
 *       - Transfers
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional idempotency key to prevent duplicate transfers (valid for 24h)
 *         example: "transfer-123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccountId
 *               - toAccountId
 *               - amount
 *             properties:
 *               fromAccountId:
 *                 type: integer
 *                 description: Source account ID
 *                 example: 1
 *               toAccountId:
 *                 type: integer
 *                 description: Destination account ID (must be different from source)
 *                 example: 2
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Amount to transfer
 *                 example: 250.75
 *     responses:
 *       201:
 *         description: Transfer completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 fromAccount:
 *                   type: integer
 *                   example: 1
 *                 toAccount:
 *                   type: integer
 *                   example: 2
 *                 amount:
 *                   type: string
 *                   example: "250.75"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request (insufficient funds, validation error, same account transfer)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Insufficient funds"
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Account not found"
 */
r.post('/', validate(createTransferSchema), createTransfer);

export default r;
