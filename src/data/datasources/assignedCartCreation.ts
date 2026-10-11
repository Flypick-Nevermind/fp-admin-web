import type {
  AssignedCartCreationsResponseDTO,
} from '../models/assignedCartCreation';
import { env } from '@/shared/utils/env';

export interface AssignedCartQueryParams {
  page: number;
  limit: number;
  /** The admin whose assigned carts to fetch (logged-in admin's own id). */
  userAdminId: string;
}

/**
 * Raw data source — HTTP client for the cart-creations/assigned API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller supplies
 * the `Authorization` header. The `user_admin_id` query param is the
 * logged-in admin's own id, resolved by the presentation layer.
 */
export class AssignedCartCreationDataSource {
  /** Stable API path for the assigned-carts endpoint. */
  private static readonly ASSIGNED_PATH = '/cart-creations/assigned';

  private url(params: AssignedCartQueryParams): string {
    const query = new URLSearchParams({
      user_admin_id: params.userAdminId,
      page: String(params.page),
      limit: String(params.limit),
    });
    return `${env.apiBaseUrl}${AssignedCartCreationDataSource.ASSIGNED_PATH}?${query.toString()}`;
  }

  async fetchAssigned(
    params: AssignedCartQueryParams,
    authorization?: string,
  ): Promise<AssignedCartCreationsResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(params), { method: 'GET', headers });
    const json = (await res.json()) as AssignedCartCreationsResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(json.errors || json.message || 'Failed to load assigned carts');
    }

    return json;
  }
}
