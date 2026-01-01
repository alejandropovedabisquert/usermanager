import { User } from '@/types/user';
import { getAuthToken } from '@/lib/actions/auth';
import { apiClient } from './client';

const ENDPOINTBASE = '/users';

export const usersApi = {
  getAll: () => apiClient<User[]>(ENDPOINTBASE),
  getById: async (id: string) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return null;
      }

      const user = await apiClient<User>(`/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return user;

    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }
  },
  getCurrentUser: async () => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return null;
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
  create: async (data: User) =>{
    try{
        const token = await getAuthToken();
    
        if (!token) {
          return null;
        }
        
        return await apiClient<{ token: string }>(ENDPOINTBASE, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    }
    catch(error){
        console.error('Error creating user:', error);
        return null;
    }
  },   
  update: async (id: string, data: Partial<Omit<User, 'id'>> & { password?: string }) => {
    try{
        const token = await getAuthToken();
    
        if (!token) {
          return null;
        }
        console.log(JSON.stringify(data));
        
        return await apiClient<{ token: string }>(`${ENDPOINTBASE}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    }
    catch(error){
        console.error(`Error updating user ${id}:`, error);
        return null;
    }
  },
  delete: async(id: string) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return null;
      }

      return await apiClient<{ token: string }>(`${ENDPOINTBASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      return null;
    }
  },
};