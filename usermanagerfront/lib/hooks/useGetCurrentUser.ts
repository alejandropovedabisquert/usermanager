'use client'

import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types/user';

export function useGetCurrentUser() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const user = await usersApi.getCurrentUser();
                if (!user) {
                    return null;
                } else {
                    setCurrentUser(user);
                }
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching current user:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { 
        currentUser, 
        role: currentUser?.role || null,
        isAdmin: currentUser?.role === 'admin',
        isLoading, 
        error 
    };
}