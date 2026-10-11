import { useCallback, useEffect, useState } from 'react';
import type { AssignedCartCreation } from '@/core/entities/assignedCartCreation';
import type { PageMeta } from '@/core/entities/page';
import { GetAssignedCartCreations } from '@/core/usecases/getAssignedCartCreations';
import { AssignedCartCreationRepositoryImpl } from '@/data/repositories/assignedCartCreation';
import { getAccessToken, useAuthStore } from './useAuthStore';

/**
 * Presentation-layer composition root for assigned carts.
 * Wires the domain port → concrete data-layer repo → use case, with
 * client-side pagination state (page / limit).
 *
 * The `user_admin_id` query param is the logged-in admin's own id, read
 * from the persisted auth store; the `Authorization` header (Bearer JWT)
 * comes from the same store.
 */
export function useAssignedCartCreations(defaultLimit = 10) {
  const [items, setItems] = useState<AssignedCartCreation[]>([]);
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

    const userAdminId = useAuthStore.getState().session?.adminId;
    if (!userAdminId) {
      // No admin session: surface a clear error, don't fire the request.
      setError('Not signed in.');
      setLoading(false);
      return () => {
        active = false;
      };
    }

    // Created inside the effect so the composition root stays stable and
    // the effect re-runs only when page/limit/reload actually change.
    const repo = new AssignedCartCreationRepositoryImpl();
    const useCase = new GetAssignedCartCreations(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute({ page, limit, userAdminId }, auth)
      .then((res) => {
        if (!active) return;
        setItems(res.items);
        setMeta(res.meta);
      })
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Failed to load assigned carts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit, reloadKey]);

  const goToPage = useCallback(
    (next: number) => {
      const max = meta?.total_pages ?? 1;
      setPage(Math.max(1, Math.min(next, max)));
    },
    [meta],
  );

  const setPageSize = useCallback((n: number) => {
    setLimit(n);
    setPage(1);
  }, []);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return { items, meta, page, limit, loading, error, goToPage, setPageSize, reload };
}
