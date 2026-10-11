import type { CartCreationDetailResponseDTO } from '../models/cartCreationDetail';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the cart-creations/{id} detail API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header.
 */
export class CartCreationDetailDataSource {
  /** Stable API path prefix for the detail endpoint. */
  private static readonly DETAIL_PATH = '/cart-creations';

  private url(cartCreationId: string): string {
    return `${env.apiBaseUrl}${CartCreationDetailDataSource.DETAIL_PATH}/${encodeURIComponent(cartCreationId)}`;
  }

  async fetchDetail(
    cartCreationId: string,
    authorization?: string,
  ): Promise<CartCreationDetailResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(cartCreationId), { method: 'GET', headers });
    const json = (await res.json()) as CartCreationDetailResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(
        json.errors || json.message || 'Failed to load cart creation detail',
      );
    }

    return json;
  }
}
