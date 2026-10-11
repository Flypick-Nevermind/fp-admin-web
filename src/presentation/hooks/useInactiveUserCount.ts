import { useEffect, useState } from 'react';
import type { InactiveUserCount } from '@/core/entities/inactiveUserCount';
import { GetInactiveUserCount } from '@/core/usecases/getInactiveUserCount';
import { InactiveUserCountRepositoryImpl } from '@/data/repositories/inactiveUserCount';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for the inactive-user count.
 * Wires the domain port → concrete data-layer repo → use case. The
 * Authorization header (Bearer JWT) is read from the persisted auth store.
 */
export function useInactiveUserCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const repo = new InactiveUserCountRepositoryImpl();
    const useCase = new GetInactiveUserCount(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute(auth)
      .then((res: InactiveUserCount) => {
        if (active) setCount(res.count);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : 'Failed to load inactive users.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { count, loading, error, reload };
}
