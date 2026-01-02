// lib/context/ToastContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AlertMessage } from '@/components/common/AlertMessage';

type ToastType = 'default' | 'destructive' | 'success';

type Toast = {
    id: string;
    message: string;
    type: ToastType;
    title?: string;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showSuccess: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'default', title?: string) => {
        const id = Date.now().toString();
        setToast({ id, message, type, title });
    }, []);

    const showError = useCallback((message: string, title?: string) => {
        showToast(message, 'destructive', title || 'Error');
    }, [showToast]);

    const showSuccess = useCallback((message: string, title?: string) => {
        showToast(message, 'success', title || 'Success');
    }, [showToast]);

    const clearToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
            {children}
            {toast && (
                <AlertMessage
                    variant={toast.type}
                    title={toast.title}
                    message={toast.message}
                    show={true}
                    onClose={clearToast}
                />
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}