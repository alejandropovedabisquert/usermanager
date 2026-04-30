'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types/user';

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = async () => {
    try {
      const user = await usersApi.getCurrentUser();
      setCurrentUser(user || null);
      setError(null);
    } catch (err) {
      setCurrentUser(null);
      setError(err as Error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);

      try {
        let user = await usersApi.getCurrentUser();

        if (!user) {
          await usersApi.refreshToken();
          user = await usersApi.getCurrentUser();
        }

        setCurrentUser(user || null);
        setError(null);
      } catch {
        setCurrentUser(null);
        setError(new Error('Session expired'));
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const isAuthenticated = !isLoading && currentUser !== null;
  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  const hasRole = (role: string) => {
    return isAuthenticated && currentUser?.role === role;
  };

  const setUser = (user: User | null) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        hasRole,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}