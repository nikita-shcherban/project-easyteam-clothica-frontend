'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
  getCurrentUser,
  updateCurrentUser,
  type UpdateUserData,
} from '@/lib/api/client-api';
import { useAuthStore } from '@/lib/store/auth-store';
import { getServerErrorMessage, showToast } from '@/lib/toast';

export function useUserProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearUser();
        router.replace('/auth/login');
        return;
      }
      setError('Не вдалося завантажити дані користувача');
    } finally {
      setLoading(false);
    }
  }, [setUser, clearUser, router]);
  const saveProfile = async (values: UpdateUserData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateCurrentUser(values);
      setUser(updatedUser);
      return true;
    } catch (error) {
      const message = getServerErrorMessage(error);

      void showToast('error', message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    user,
    loading,
    error,
    loadProfile,
    saveProfile,
  };
}
