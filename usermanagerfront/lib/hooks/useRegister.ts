'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '../api/users';
import { useToast } from '../context/ToastContext';

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToast();
    const router = useRouter();

    const register = async (username: string, password: string, email: string, firstName: string, lastName: string) => {
        setIsLoading(true);
        try {
            const response = await usersApi.register(username, password, email, firstName, lastName);
            showSuccess(response.message || 'Registration successful');
            router.push('/login');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed";
            showError(message, 'Registration failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading };
}