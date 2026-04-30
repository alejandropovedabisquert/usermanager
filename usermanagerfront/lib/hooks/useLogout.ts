'use client'

import { removeAuthToken } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { usersApi } from '@/lib/api/users';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { showError, showSuccess } = useToast();

  const logout = async () => {
    setIsLoading(true);

    try {
      await usersApi.logout().catch(() => undefined);
      await removeAuthToken();
      setUser(null);
      router.push('/login');
      router.refresh();
      showSuccess('Logout successful');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Logout failed';
      showError(message, 'Logout failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}