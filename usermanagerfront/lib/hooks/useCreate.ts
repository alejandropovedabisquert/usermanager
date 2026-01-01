'use client'

import { useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types/user';

type LoginError = {
  message: string;
  field?: 'username' | 'password' | 'general';
};

export function useCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<LoginError | null>(null);

    const create = async (username: string, password: string, email: string, firstName: string, lastName: string, role: string, isActive: boolean) => {
        setIsLoading(true);
        setError(null);
        try {
            await usersApi.create({ username, password, email, firstName, lastName, role, isActive } as User);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid credentials";
            setError({ message, field: 'general' });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const clearError = () => setError(null);
    return { create, error, isLoading, clearError };
}