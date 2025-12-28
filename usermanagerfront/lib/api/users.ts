import { User } from '@/types/user';
import { getAuthToken } from '@/lib/actions/auth';
import { apiClient } from './client';

const ENDPOINTBASE = '/users';

export const usersApi = {
  getAll: () => apiClient<User[]>(ENDPOINTBASE),
  getByUsername: async (username: string) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return null;
      }

      const user = await apiClient<User>(`/users/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return user;

    } catch (error) {
      console.error(`Error fetching user ${username}:`, error);
      return null;
    }
  },
  getCurrentUser: async () => {
    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('No auth token found');
      }

      const user = await apiClient<User>(`${ENDPOINTBASE}/myaccount`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        next: {
          revalidate: 60,
          tags: ['current-user']
        }
      });

      return user;

    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  login: (username: string, password: string) =>
    apiClient<{ token: string }>(`${ENDPOINTBASE}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  register: (username: string, password: string, email: string, firstName: string, lastName: string) =>
    apiClient<User>(`${ENDPOINTBASE}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    }),
  create: (data: Omit<User, 'username'>) =>
    apiClient<User>(ENDPOINTBASE, { method: 'POST', body: JSON.stringify(data) }),
  update: async (username: string, data: Partial<Omit<User, 'username'>> & { password?: string }) => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('No auth token found');
    }

    return apiClient<{ token: string }>(`${ENDPOINTBASE}/${username}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  delete: (username: string) =>
    apiClient<void>(`${ENDPOINTBASE}/${username}`, { method: 'DELETE' }),
};