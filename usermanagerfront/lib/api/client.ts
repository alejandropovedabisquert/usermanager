import { usersApi } from './users';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
  retry = true
): Promise<T> {
  const isServer = typeof window === 'undefined';
  const API_BASE_URL = isServer
    ? process.env.API_URL || 'http://backend:5050'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if ((response.status === 498) && retry) {
      try {
        await usersApi.refreshToken();
        return apiClient<T>(endpoint, options, false);
      } catch (refreshError) {
        throw new Error('Session expired. Please log in again.');
      }
    }
    throw new Error(JSON.stringify(await response.json().then(data => data.message || data)));
  }

  return response.json();
}