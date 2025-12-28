'use client'

import { setAuthToken } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '@/lib/api/users';

type LoginError = {
  message: string;
  field?: 'username' | 'password' | 'general';
};

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<LoginError | null>(null);
    const router = useRouter();

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await usersApi.login(username, password);

            await setAuthToken(response.token);
            router.push("/");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid credentials";
            setError({ message, field: 'general' });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const clearError = () => setError(null);
    return { login, error, isLoading, clearError };
}