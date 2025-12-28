'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '../api/users';

type RegisterError = {
  message: string;
  field?: 'username' | 'password' | 'firstName' | 'lastName' | 'email' | 'general';
};

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<RegisterError | null>(null);
    const router = useRouter();

    const register = async (username: string, password: string, email: string, firstName: string, lastName: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await usersApi.register(username, password, email, firstName, lastName);
            router.push('/login');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed";
            setError({ message, field: 'general' });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const clearError = () => setError(null);
    return { register, error, isLoading, clearError };
}