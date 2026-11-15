'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { notifyAuthError } from '@/lib/auth/notify';
import { useAuthStore } from '@/lib/store/auth-store';
import type { User } from '@/types/user';

export function useAuthSubmit<Values>(
  authenticate: (values: Values) => Promise<User>,
  getErrorMessage: (error: unknown) => string = getAuthErrorMessage,
) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const pending = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  async function submit(values: Values) {
    if (pending.current) return;
    pending.current = true;
    setError(null);

    try {
      const user = await authenticate(values);
      setUser(user);
      setRedirecting(true);
      router.replace('/');
      router.refresh();
    } catch (cause) {
      const message = getErrorMessage(cause);
      setError(message);
      void notifyAuthError(message).catch((notificationError: unknown) => {
        console.error('Failed to display authentication error notification', {
          notificationError,
        });
      });
      pending.current = false;
    }
  }

  return { submit, error, redirecting };
}
