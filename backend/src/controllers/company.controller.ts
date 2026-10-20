import type { Response } from 'express-serve-static-core';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Company from '../models/Company.model';
import User, { UserRole } from '../models/User.model';

export const getCompanyStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized: Tenant info missing' });
    }

    const company = await Company.findById(companyId);
    if (!company || company.isDeleted) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const [totalActive, totalDeleted, managersCount, employeesCount] = await Promise.all([
      User.countDocuments({ companyId, isDeleted: false }),
      User.countDocuments({ companyId, isDeleted: true }),
      User.countDocuments({ companyId, role: UserRole.MANAGER, isDeleted: false }),
      User.countDocuments({ companyId, role: UserRole.EMPLOYEE, isDeleted: false }),
    ]);

    return res.status(200).json({
      message: 'Company stats retrieved successfully',
      data: {
        company,
        metrics: {
          totalActiveUsers: totalActive,
          totalDeletedUsers: totalDeleted,
          managersCount,
          employeesCount,
        },
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ message: err.message || 'Failed to retrieve stats' });
  }
};

export const updateCompany = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;
    const { name, domain } = req.body as { name?: string; domain?: string };

    const company = await Company.findByIdAndUpdate(
      companyId,
      { $set: { name, domain } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({ message: err.message || 'Failed to update company' });
  }
};