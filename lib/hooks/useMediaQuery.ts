import { useCallback, useSyncExternalStore } from 'react';

/** null на сервері / до гідратації, далі true | false */
export function useMediaQuery(query: string): boolean | null {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
