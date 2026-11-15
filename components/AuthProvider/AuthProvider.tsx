'use client';
import axios from 'axios';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/api/client-api';
import { useAuthStore } from '@/lib/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          clearUser();
        }
      } finally {
        setAuthLoading(false);
      }
    };

    void checkAuth();
  }, [setUser, clearUser, setAuthLoading]);
  return <>{children}</>;
}
