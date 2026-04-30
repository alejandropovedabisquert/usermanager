import { User } from '@/types/user';
import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
} from '@/lib/actions/auth';
import { apiClient } from './client';

const ENDPOINTBASE = '/users';

export const usersApi = {
  getAll: () => apiClient<User[]>(ENDPOINTBASE),

  getById: async (id: string) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    return apiClient<User>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCurrentUser: async () => {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    return apiClient<User>(`${ENDPOINTBASE}/myaccount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
  },

  login: (username: string, password: string) =>
    apiClient<{ message: string; token: string; refreshToken: string }>(
      `${ENDPOINTBASE}/login`,
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    ),

  logout: async () => {
    const refreshToken = await getRefreshToken();

    return apiClient<{ message: string }>(`${ENDPOINTBASE}/logout`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  register: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) =>
    apiClient<{ message: string }>(`${ENDPOINTBASE}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    }),

  create: async (data: User) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    return apiClient<{ message: string; userId: string }>(ENDPOINTBASE, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  update: async (
    id: string,
    data: Partial<Omit<User, 'id'>> & { password?: string }
  ) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    return apiClient<{ message: string; modifiedCount: number }>(
      `${ENDPOINTBASE}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  delete: async (ids: string[]) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    return apiClient<{ message: string }>(`${ENDPOINTBASE}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
  },

  refreshToken: async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient<{ token: string }>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    await setAuthToken(response.token);
    return response.token;
  },
};