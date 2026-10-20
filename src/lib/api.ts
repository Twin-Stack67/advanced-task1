const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // 1. Retrieve stored JWT token
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // 2. Prepare Headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 3. Make HTTP Call to Backend
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during API request');
  }

  return data;
}