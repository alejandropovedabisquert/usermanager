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
    const shouldTryRefresh =
      retry &&
      response.status === 401 &&
      endpoint !== '/refresh' &&
      endpoint !== '/users/login' &&
      endpoint !== '/users/register' &&
      endpoint !== '/users/logout';

    if (shouldTryRefresh) {
      try {
        await usersApi.refreshToken();
        return apiClient<T>(endpoint, options, false);
      } catch {
        throw new Error('Session expired. Please log in again.');
      }
    }

    const payload = await response.json().catch(() => null);
    throw new Error(JSON.stringify(payload?.message || 'Request failed'));
  }

  return response.json();
}