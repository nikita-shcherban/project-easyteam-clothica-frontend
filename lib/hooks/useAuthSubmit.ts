'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import type { User } from '@/types/user';

export function useAuthSubmit<Values>(
  authenticate: (values: Values) => Promise<User>,
  getErrorMessage: (error: unknown) => string,
  notifyError: (message: string) => Promise<void>,
) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const pending = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  async function submit(values: Values) {
    if (pending.current) return;
    pending.current = true;

    try {
      const user = await authenticate(values);
      setUser(user);
      setRedirecting(true);
      router.replace('/');
      router.refresh();
    } catch (cause) {
      const message = getErrorMessage(cause);
      void notifyError(message).catch((notificationError: unknown) => {
        console.error('Failed to display authentication error notification', {
          notificationError,
        });
      });
      pending.current = false;
    }
  }

  return { submit, redirecting };
}
