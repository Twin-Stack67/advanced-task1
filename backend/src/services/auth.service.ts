import bcrypt from 'bcryptjs';
import Company from '../models/Company.model';
import User, { UserRole } from '../models/User.model';
import { generateToken } from '../utils/jwt';

export interface RegisterAdminInput {
  name: string;
  email: string;
  password: string;
}

export const registerCompanyWithAdmin = async (
  companyName: string,
  adminData: RegisterAdminInput
) => {
  const normalizedEmail = adminData.email.trim().toLowerCase();

  // 1. Create Company
  const company = await Company.create({ name: companyName });

  // 2. Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminData.password, salt);

  // 3. Create Admin User linked to the Company ID
  const user = await User.create({
    ...adminData,
    email: normalizedEmail,
    password: hashedPassword,
    role: UserRole.ADMIN,
    companyId: company._id,
  });

  // 4. Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    companyId: company._id.toString(),
    role: user.role,
  });

  return { company, user, token };
};

export const loginUser = async (email: string, pass: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail, isDeleted: false });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken({
    userId: user._id.toString(),
    companyId: user.companyId.toString(),
    role: user.role,
  });

  return { user, token };
};