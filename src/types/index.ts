export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICompany {
  _id: string;
  name: string;
  domain?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMetrics {
  totalActiveUsers: number;
  totalDeletedUsers: number;
  managersCount: number;
  employeesCount: number;
}

export interface CompanyStatsData {
  company: ICompany;
  metrics: CompanyMetrics;
}

export interface PaginationMeta {
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface AuthData {
  user: IUser;
  token: string;
  company?: ICompany;
}

export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UpdateCompanyPayload {
  name?: string;
  domain?: string;
}
