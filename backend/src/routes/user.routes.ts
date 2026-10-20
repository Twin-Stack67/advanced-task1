import express from 'express';

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
} from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validateUserId, validateUserPayload } from '../middlewares/user.middleware';
import { UserRole } from '../models/User.model';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
  validateUserPayload,
  createEmployee
);

router.get(
  '/',
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  getEmployees
);

router.get(
  '/:id',
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  validateUserId,
  getEmployeeById
);

router.put(
  '/:id',
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
  validateUserId,
  validateUserPayload,
  updateEmployee
);

router.delete(
  '/:id',
  authorizeRoles(UserRole.ADMIN),
  validateUserId,
  deleteEmployee
);

router.patch(
  '/:id/restore',
  authorizeRoles(UserRole.ADMIN),
  validateUserId,
  restoreEmployee
);

export default router;