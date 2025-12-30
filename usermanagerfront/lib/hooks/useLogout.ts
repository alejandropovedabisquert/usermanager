'use client'

import { removeAuthToken } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

type LogoutError = {
  message: string;
  field?: 'username' | 'password' | 'general';
};

export function useLogout() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<LogoutError | null>(null);
    const router = useRouter();
    const { setUser } = useAuth();

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await removeAuthToken();
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid credentials";
            setError({ message, field: 'general' });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const clearError = () => setError(null);

    return { logout, isLoading, error, clearError };
}