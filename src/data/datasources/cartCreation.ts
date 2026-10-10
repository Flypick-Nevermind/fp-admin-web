import type { CartCreationsResponseDTO } from '../models/cartCreation';
import { env } from '@/shared/utils/env';

export interface CartCreationQueryParams {
  page: number;
  limit: number;
}

/**
 * Raw data source — HTTP client for the cart-creations API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header. The data layer stays decoupled from
 * the presentation store — it just receives an already-built header value.
 */
export class CartCreationDataSource {
  /** Stable API path for the unassigned-carts endpoint. */
  private static readonly UNASSIGNED_PATH = '/cart-creations/unassigned';

  private url(params: CartCreationQueryParams): string {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    return `${env.apiBaseUrl}${CartCreationDataSource.UNASSIGNED_PATH}?${query.toString()}`;
  }

  /**
   * @param authorization value for the `Authorization` header
   *        (typically `Bearer <jwt>`). Omitted when no session yet.
   */
  async fetchUnassigned(
    params: CartCreationQueryParams,
    authorization?: string,
  ): Promise<CartCreationsResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(params), {
      method: 'GET',
      headers,
    });

    const json = (await res.json()) as CartCreationsResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(json.message || `Cart creations request failed (${res.status})`);
    }

    return json;
  }
}
