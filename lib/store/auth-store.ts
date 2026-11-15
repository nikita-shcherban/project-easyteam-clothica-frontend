'use client';

import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// UI state only. Authentication is verified by the backend using cookies.
// Neither passwords nor session tokens belong in localStorage.
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthLoading: true,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
}));
