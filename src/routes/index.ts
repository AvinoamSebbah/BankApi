import { Router } from 'express';
import customers from './customers.routes.js';
import accounts from './accounts.routes.js';
import transfers from './transfers.routes.js';

const router = Router();
router.use('/customers', customers);
router.use('/accounts', accounts);
router.use('/transfers', transfers);
export default router;
