import { User } from '@/types/user';
import { getAuthToken, getRefreshToken, setAuthToken } from '@/lib/actions/auth';
import { apiClient } from './client';

const ENDPOINTBASE = '/users';

export const usersApi = {
  getAll: () => apiClient<User[]>(ENDPOINTBASE),
  getById: async (id: string) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const user = await apiClient<User>(`/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return user;
  },
  getCurrentUser: async () => {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    const user = await apiClient<User>(`${ENDPOINTBASE}/myaccount`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    return user;
  },
  login: (username: string, password: string) =>
    apiClient<{ message: string; userId: string, token: string, refreshToken: string }>(`${ENDPOINTBASE}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  register: (username: string, password: string, email: string, firstName: string, lastName: string) =>
    apiClient<{ message: string }>(`${ENDPOINTBASE}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    }),
  create: async (data: User) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    return await apiClient<{ message: string; userId: string }>(ENDPOINTBASE, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  update: async (id: string, data: Partial<Omit<User, 'id'>> & { password?: string }) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await apiClient<{ token: string }>(`${ENDPOINTBASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.token) {
      const { setAuthToken } = await import('@/lib/actions/auth');
      await setAuthToken(response.token);
    }

    return response;
  },
  delete: async (ids: string[]) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }
    console.log('Delete users with IDs:', ids);
    return await apiClient<{ message: string, token: string }>(`${ENDPOINTBASE}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
  },
  refreshToken: async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await apiClient<{ token: string }>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    await setAuthToken(response.token);
    return response.token;
  },
};