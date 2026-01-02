'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { useToast } from '../context/ToastContext';

export function useDelete() {
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToast();
    const router = useRouter();

    const deleteUser = async (userId: string, onSuccess?: () => void) => {
        setIsLoading(true);
        try {
            const response =await usersApi.delete(userId);
            router.push("/");
            showSuccess(response?.message || 'User deleted successfully');
            if (onSuccess) onSuccess();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid credentials";
            showError(message, 'Deletion failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteUser, isLoading };
}