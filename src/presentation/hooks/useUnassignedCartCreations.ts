import { useCallback, useEffect, useState } from 'react';
import type { UnassignedCartCreation } from '@/core/entities/cartCreation';
import type { PageMeta } from '@/core/entities/page';
import { GetUnassignedCartCreations } from '@/core/usecases/getUnassignedCartCreations';
import { CartCreationRepositoryImpl } from '@/data/repositories/cartCreation';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for cart creations.
 * Wires the domain port → concrete data-layer repo → use case, with
 * client-side pagination state (page / limit). The Authorization header
 * (Bearer JWT) is read from the persisted auth store before the call.
 */
export function useUnassignedCartCreations(defaultLimit = 10) {
  const [items, setItems] = useState<UnassignedCartCreation[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    // Created inside the effect so the composition root stays stable and
    // the effect re-runs only when page/limit/reload actually change.
    const repo = new CartCreationRepositoryImpl();
    const useCase = new GetUnassignedCartCreations(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute({ page, limit }, auth)
      .then((res) => {
        if (!active) return;
        setItems(res.items);
        setMeta(res.meta);
      })
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Failed to load unassigned carts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit, reloadKey]);

  const goToPage = useCallback((next: number) => {
    const max = meta?.total_pages ?? 1;
    const clamped = Math.max(1, Math.min(next, max));
    setPage(clamped);
  }, [meta]);

  const setPageSize = useCallback((n: number) => {
    setLimit(n);
    setPage(1);
  }, []);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return { items, meta, page, limit, loading, error, goToPage, setPageSize, reload };
}
