import { useEffect, useState } from 'react';
import type { UnassignedCartCreation } from '@/core/entities/cartCreation';
import type { CartCreationRepository } from '@/core/usecases/cartCreation';
import { GetUnassignedCartCreations } from '@/core/usecases/getUnassignedCartCreations';
import { CartCreationRepositoryImpl } from '@/data/repositories/cartCreation';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for cart creations.
 * Wires the domain port → concrete data-layer repo → use case.
 *
 * The Authorization header (Bearer JWT) is read from the persisted auth
 * store right before the call, keeping the data layer store-agnostic.
 */
export function useUnassignedCartCreations() {
  const [items, setItems] = useState<UnassignedCartCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const repo: CartCreationRepository = new CartCreationRepositoryImpl();
    const useCase = new GetUnassignedCartCreations(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute(auth)
      .then((data) => active && setItems(data))
      .catch((e) =>
        active &&
        setError(
          e instanceof Error ? e.message : 'Failed to load unassigned carts.',
        ),
      )
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { items, loading, error, reload: () => setReloadKey((k) => k + 1) };
}
