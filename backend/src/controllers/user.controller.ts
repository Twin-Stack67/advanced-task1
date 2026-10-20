import type { Response } from 'express-serve-static-core';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User.model';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  restoreUser,
  GetUsersQuery,
} from '../services/user.service';

export const createEmployee = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
    }

    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    };

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password',
      });
    }

    const user = await createUser(companyId, { name, email, password, role });

    const userObj = user.toObject ? user.toObject() : user;
    delete (userObj as { password?: string }).password;

    return res.status(201).json({
      message: 'Employee created successfully',
      data: userObj,
    });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }
    return res.status(400).json({ message: err.message || 'Failed to create employee' });
  }
};

export const getEmployees = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
    }

    const query: GetUsersQuery = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string | undefined,
      role: req.query.role as UserRole | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
    };

    const result = await getUsers(companyId, query);

    return res.status(200).json({
      message: 'Employees retrieved successfully',
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ message: err.message || 'Failed to retrieve employees' });
  }
};

export const getEmployeeById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;
    const id = req.params.id as string;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
    }

    const user = await getUserById(companyId, id);

    return res.status(200).json({
      message: 'Employee retrieved successfully',
      data: user,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(404).json({ message: err.message || 'Employee not found' });
  }
};

export const updateEmployee = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;
    const id = req.params.id as string;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
    }

    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    };

    const updatedUser = await updateUser(companyId, id, {
      name,
      email,
      password,
      role,
    });

    return res.status(200).json({
      message: 'Employee updated successfully',
      data: updatedUser,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({ message: err.message || 'Failed to update employee' });
  }
};

export const deleteEmployee = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;
    const id = req.params.id as string;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
    }

    const deletedUser = await softDeleteUser(companyId, id);

    return res.status(200).json({
      message: 'Employee soft-deleted successfully',
      data: deletedUser,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({ message: err.message || 'Failed to delete employee' });
  }
};

export const restoreEmployee = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;
    const id = req.params.id as string;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
    }

    const restoredUser = await restoreUser(companyId, id);

    return res.status(200).json({
      message: 'Employee restored successfully',
      data: restoredUser,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({ message: err.message || 'Failed to restore employee' });
  }
};