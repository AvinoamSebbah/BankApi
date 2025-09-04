import { Router } from 'express';
import { createAccount, getBalance, getHistory } from '../controllers/accounts.controller.js';
import { validate } from '../middlewares/validate.js';
import { createAccountSchema, accountIdParamSchema } from '../schemas/accounts.schema.js';

const r = Router();

/**
 * @openapi
 * /accounts:
 *   post:
 *     summary: Create a new bank account
 *     description: Creates a new bank account for a customer with optional initial deposit
 *     tags: 
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: ID of the customer
 *                 example: 1
 *               initialDeposit:
 *                 type: number
 *                 minimum: 0
 *                 description: Initial deposit amount
 *                 example: 1000.50
 *                 default: 0
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 customerId:
 *                   type: integer
 *                   example: 1
 *                 balance:
 *                   type: string
 *                   example: "1000.50"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Customer not found
 */
r.post('/', validate(createAccountSchema), createAccount);

/**
 * @openapi
 * /accounts/{id}/balance:
 *   get:
 *     summary: Get account balance
 *     description: Retrieves the current balance of a specific account
 *     tags: 
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Account balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountId:
 *                   type: integer
 *                   example: 1
 *                 balance:
 *                   type: string
 *                   example: "1000.50"
 *       404:
 *         description: Account not found
 */
r.get('/:id/balance', validate(accountIdParamSchema), getBalance);

/**
 * @openapi
 * /accounts/{id}/transactions:
 *   get:
 *     summary: Get account transfer history
 *     description: Retrieves paginated transfer history for a specific account
 *     tags: 
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *         example: 1
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of records to retrieve
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Transfer history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountId:
 *                   type: integer
 *                   example: 1
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fromAccount:
 *                         type: integer
 *                       toAccount:
 *                         type: integer
 *                       amount:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Account not found
 */
r.get('/:id/transactions', validate(accountIdParamSchema), getHistory);

export default r;
