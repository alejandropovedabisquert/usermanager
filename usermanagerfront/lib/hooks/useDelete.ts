'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '@/lib/api/users';

type DeleteError = {
    message: string;
    field?: 'username' | 'password' | 'general';
};

export function useDelete() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<DeleteError | null>(null);
    const router = useRouter();

    const deleteUser = async (userId: string, onSuccess?: () => void) => {
        setIsLoading(true);
        setError(null);
        try {
            await usersApi.delete(userId);
            router.push("/");
            if (onSuccess) onSuccess();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid credentials";
            setError({ message, field: 'general' });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const clearError = () => setError(null);
    return { deleteUser, error, isLoading, clearError };
}