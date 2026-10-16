import { useCallback, useEffect, useState } from 'react';
import type {
  OrderDetail,
  OrderStatus,
  PaymentStatus,
} from '@/core/entities/order';
import {
  GetOrderDetailUseCase,
  UpdateOrderStatusUseCase,
} from '@/core/usecases/order';
import { OrderRepositoryImpl } from '@/data/repositories/orders';
import { getAccessToken } from './useAuthStore';

export function useOrderDetail(orderId: string | null | undefined) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required.');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const repo = new OrderRepositoryImpl();
    const useCase = new GetOrderDetailUseCase(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute(orderId, auth)
      .then((res) => {
        if (active) setOrder(res);
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load order.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const updateStatus = useCallback(
    async (params: {
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
    }) => {
      if (!orderId) return;
      setUpdating(true);
      try {
        const repo = new OrderRepositoryImpl();
        const useCase = new UpdateOrderStatusUseCase(repo);
        const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

        await useCase.execute(
          {
            orderId,
            orderStatus: params.orderStatus,
            paymentStatus: params.paymentStatus,
          },
          auth,
        );

        setReloadKey((k) => k + 1);
      } finally {
        setUpdating(false);
      }
    },
    [orderId],
  );

  return { order, loading, error, updating, updateStatus, reload };
}
