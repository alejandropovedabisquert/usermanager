'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { useToast } from '@/lib/context/ToastContext';
import { useAuth } from '@/lib/context/AuthContext';

export function useDelete() {
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useAuth();
    const { showError, showSuccess } = useToast();
    const router = useRouter();

    const deleteUser = async (usersIds: string[], onSuccess?: () => void, onClick?: () => void) => {
        setIsLoading(true);
        try {
            if(usersIds.includes(currentUser?._id || '')) {
                throw new Error("You cannot delete your own account, please uncheck it and try again.");
            }
            const filteredIds = usersIds.filter(id => id !== currentUser?._id);
            const response = await usersApi.delete(filteredIds);
            router.push("/");
            showSuccess(response?.message || 'User deleted successfully');
            if (onSuccess) onSuccess();
            if (onClick) onClick();
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