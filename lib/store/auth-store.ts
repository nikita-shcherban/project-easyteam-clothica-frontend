'use client';

import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
}

// UI state only. Authentication is verified by the backend using cookies.
// Neither passwords nor session tokens belong in localStorage.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
