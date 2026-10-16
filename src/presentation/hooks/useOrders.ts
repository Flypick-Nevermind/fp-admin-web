import { useCallback, useEffect, useState } from 'react';
import type { OrderListItem } from '@/core/entities/order';
import type { PageMeta } from '@/core/entities/page';
import { GetOrdersUseCase } from '@/core/usecases/order';
import { OrderRepositoryImpl } from '@/data/repositories/orders';
import { getAccessToken } from './useAuthStore';

export function useOrders(defaultLimit = 10) {
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const repo = new OrderRepositoryImpl();
    const useCase = new GetOrdersUseCase(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute({ page, limit, status: status || undefined }, auth)
      .then((res) => {
        if (!active) return;
        setItems(res.items);
        setMeta(res.meta);
      })
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Failed to load orders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit, status, reloadKey]);

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

  const setStatusFilter = useCallback((newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return {
    items,
    meta,
    page,
    limit,
    status,
    loading,
    error,
    goToPage,
    setPageSize,
    setStatusFilter,
    reload,
  };
}
