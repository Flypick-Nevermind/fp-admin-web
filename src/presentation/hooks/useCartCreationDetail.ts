import { useCallback, useEffect, useState } from 'react';
import type { CartCreationDetail } from '@/core/entities/cartCreationDetail';
import { GetCartCreationDetail } from '@/core/usecases/getCartCreationDetail';
import { CartCreationDetailRepositoryImpl } from '@/data/repositories/cartCreationDetail';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for a single cart creation.
 * Wires the domain port → concrete data-layer repo → use case. The
 * Authorization header (Bearer JWT) is read from the persisted auth store.
 *
 * `cartCreationId` is typically taken from the route params.
 * Exposes `reload` so a parent can refetch after a mutation (e.g. a
 * status update) without remounting the page.
 */
export function useCartCreationDetail(cartCreationId: string | null) {
  const [detail, setDetail] = useState<CartCreationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!cartCreationId) {
      setError('No cart creation id.');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    setDetail(null);

    // Created inside the effect so the composition root stays stable.
    const repo = new CartCreationDetailRepositoryImpl();
    const useCase = new GetCartCreationDetail(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute(cartCreationId, auth)
      .then((res) => {
        if (active) setDetail(res);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : 'Failed to load cart creation.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cartCreationId, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { detail, loading, error, reload };
}
