'use client'

import { useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types/user';
import { useToast } from '@/lib/context/ToastContext';

export function useCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToast();

    const create = async (
      username: string, 
      password: string, 
      email: string, 
      firstName: string, 
      lastName: string, 
      role: string, 
      isActive: boolean
    ) => {
        setIsLoading(true);
        
        try {
            const response = await usersApi.create({ 
              username, 
              password, 
              email, 
              firstName, 
              lastName, 
              role, 
              isActive 
            } as User);
            
            showSuccess(response.message || 'User created successfully');
            
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create user";
            showError(message, 'Creation failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    
    return { create, isLoading };
}