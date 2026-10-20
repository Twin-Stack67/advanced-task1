import express from 'express';

import { getCompanyStats, updateCompany } from '../controllers/company.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User.model';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles(UserRole.ADMIN));

router.get('/stats', getCompanyStats);
router.put('/', updateCompany);

export default router;