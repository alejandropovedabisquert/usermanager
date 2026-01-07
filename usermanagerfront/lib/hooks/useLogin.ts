'use client'

import { setAuthToken, setRefreshToken } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';


export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { showError, showSuccess } = useToast();
    const { refreshUser } = useAuth();

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await usersApi.login(username, password);
            await setAuthToken(response.token);
            await setRefreshToken(response.refreshToken);
            await refreshUser();
            showSuccess(response?.message || 'Login successful');
            router.push("/");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid credentials";
            showError(message, 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    return { login, isLoading };
}