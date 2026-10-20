import bcrypt from 'bcryptjs';
import User, { IUser, UserRole } from '../models/User.model';

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const createUser = async (
  companyId: string,
  input: CreateUserInput
): Promise<IUser> => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new Error('A user with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  const user = await User.create({
    ...input,
    password: hashedPassword,
    companyId,
    isDeleted: false,
  });

  return user;
};

export const getUsers = async (
  companyId: string,
  query: GetUsersQuery
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    companyId,
    isDeleted: false,
  };

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      limit,
    },
  };
};

export const getUserById = async (
  companyId: string,
  userId: string
): Promise<IUser | null> => {
  const user = await User.findOne({
    _id: userId,
    companyId,
    isDeleted: false,
  }).select('-password');

  if (!user) {
    throw new Error('User not found or access denied');
  }

  return user;
};

export const updateUser = async (
  companyId: string,
  userId: string,
  updateData: UpdateUserInput
): Promise<IUser | null> => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, companyId, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    throw new Error('User not found or access denied');
  }

  return updatedUser;
};

export const softDeleteUser = async (
  companyId: string,
  userId: string
): Promise<IUser | null> => {
  const deletedUser = await User.findOneAndUpdate(
    { _id: userId, companyId, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  ).select('-password');

  if (!deletedUser) {
    throw new Error('User not found or access denied');
  }

  return deletedUser;
};

export const restoreUser = async (
  companyId: string,
  userId: string
): Promise<IUser | null> => {
  const restoredUser = await User.findOneAndUpdate(
    { _id: userId, companyId, isDeleted: true },
    { $set: { isDeleted: false } },
    { new: true }
  ).select('-password');

  if (!restoredUser) {
    throw new Error('User not found or already active');
  }

  return restoredUser;
};