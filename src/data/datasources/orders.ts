import type {
  OrdersListResponseDTO,
  OrderDetailResponseDTO,
  UpdateOrderStatusRequestDTO,
  UpdateOrderStatusResponseDTO,
} from '../models/order';
import { env } from '@/shared/utils/env';

export interface OrderQueryParams {
  page: number;
  limit: number;
  status?: string;
}

export class OrdersDataSource {
  private static readonly ORDERS_PATH = '/orders';
  private static readonly STATUS_PATH = '/orders/status';

  private listUrl(params: OrderQueryParams): string {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.status && params.status.trim() !== '') {
      query.set('status', params.status.trim());
    }
    return `${env.apiBaseUrl}${OrdersDataSource.ORDERS_PATH}?${query.toString()}`;
  }

  private detailUrl(orderId: string): string {
    return `${env.apiBaseUrl}${OrdersDataSource.ORDERS_PATH}/${encodeURIComponent(orderId)}`;
  }

  private statusUrl(): string {
    return `${env.apiBaseUrl}${OrdersDataSource.STATUS_PATH}`;
  }

  async fetchOrders(
    params: OrderQueryParams,
    authorization?: string,
  ): Promise<OrdersListResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.listUrl(params), { method: 'GET', headers });
    const json = (await res.json()) as OrdersListResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to retrieve orders list');
    }

    return json;
  }

  async fetchOrderDetail(
    orderId: string,
    authorization?: string,
  ): Promise<OrderDetailResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.detailUrl(orderId), { method: 'GET', headers });
    const json = (await res.json()) as OrderDetailResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to retrieve order details');
    }

    return json;
  }

  async updateOrderStatus(
    body: UpdateOrderStatusRequestDTO,
    authorization?: string,
  ): Promise<UpdateOrderStatusResponseDTO> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.statusUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as UpdateOrderStatusResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update order status');
    }

    return json;
  }
}
