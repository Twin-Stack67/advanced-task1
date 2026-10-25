import {
  ApiResponse,
  AuthData,
  CompanyStatsData,
  CreateEmployeePayload,
  GetUsersQueryParams,
  ICompany,
  IUser,
  LoginPayload,
  RegisterPayload,
  UpdateCompanyPayload,
  UpdateEmployeePayload,
} from '@/types';

// Environment variable for backend API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';

export const TOKEN_STORAGE_KEY = 'tp_auth_token';
export const USER_STORAGE_KEY = 'tp_auth_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredAuth(token: string, user: IUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getStoredUser(): IUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();

  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new ApiError(
      'Unable to connect to the backend server. Please verify the backend is running.',
      0,
      err
    );
  }

  let jsonResult: unknown;
  try {
    jsonResult = await response.json();
  } catch {
    jsonResult = null;
  }

  if (!response.ok) {
    const errorBody = jsonResult as { message?: string } | null;
    const message =
      errorBody?.message || `Request failed with status ${response.status}`;
    
    // Automatically clear token on 401 Unauthorized
    if (response.status === 401 && typeof window !== 'undefined') {
      // Don't auto-clear if attempting to login
      if (!endpoint.includes('/auth/login')) {
        clearStoredAuth();
      }
    }

    throw new ApiError(message, response.status, jsonResult);
  }

  return jsonResult as T;
}

// ----------------- Auth API -----------------
export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthData>> => {
    return request<ApiResponse<AuthData>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthData>> => {
    return request<ApiResponse<AuthData>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ----------------- Company API -----------------
export const companyApi = {
  getStats: async (): Promise<ApiResponse<CompanyStatsData>> => {
    return request<ApiResponse<CompanyStatsData>>('/company/stats', {
      method: 'GET',
    });
  },

  updateCompany: async (
    payload: UpdateCompanyPayload
  ): Promise<ApiResponse<ICompany>> => {
    return request<ApiResponse<ICompany>>('/company', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

// ----------------- User / Employee API -----------------
export const userApi = {
  getUsers: async (
    params: GetUsersQueryParams = {}
  ): Promise<ApiResponse<IUser[]>> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.role) query.set('role', params.role);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const qs = query.toString();
    const endpoint = `/users${qs ? `?${qs}` : ''}`;
    return request<ApiResponse<IUser[]>>(endpoint, {
      method: 'GET',
    });
  },

  getUserById: async (id: string): Promise<ApiResponse<IUser>> => {
    return request<ApiResponse<IUser>>(`/users/${id}`, {
      method: 'GET',
    });
  },

  createUser: async (
    payload: CreateEmployeePayload
  ): Promise<ApiResponse<IUser>> => {
    return request<ApiResponse<IUser>>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateUser: async (
    id: string,
    payload: UpdateEmployeePayload
  ): Promise<ApiResponse<IUser>> => {
    return request<ApiResponse<IUser>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (id: string): Promise<ApiResponse<IUser>> => {
    return request<ApiResponse<IUser>>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  restoreUser: async (id: string): Promise<ApiResponse<IUser>> => {
    return request<ApiResponse<IUser>>(`/users/${id}/restore`, {
      method: 'PATCH',
    });
  },
};
