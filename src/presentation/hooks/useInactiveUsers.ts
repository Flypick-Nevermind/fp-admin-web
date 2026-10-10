import { useEffect, useState } from 'react';
import type { InactiveUser } from '@/core/entities/inactiveUser';
import type { InactiveUserRepository } from '@/core/usecases/inactiveUser';
import { GetInactiveUsers } from '@/core/usecases/getInactiveUsers';
import { InactiveUserRepositoryImpl } from '@/data/repositories/inactiveUser';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for inactive / prospect users.
 * Wires the domain port → concrete data-layer repo → use case. The
 * Authorization header (Bearer JWT) is read from the persisted auth store
 * right before the call, keeping the data layer store-agnostic.
 */
export function useInactiveUsers() {
  const [items, setItems] = useState<InactiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const repo: InactiveUserRepository = new InactiveUserRepositoryImpl();
    const useCase = new GetInactiveUsers(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute(auth)
      .then((data) => active && setItems(data))
      .catch((e) =>
        active &&
        setError(e instanceof Error ? e.message : 'Failed to load inactive users.'),
      )
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { items, loading, error, reload: () => setReloadKey((k) => k + 1) };
}
