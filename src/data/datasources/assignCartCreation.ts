import type { AssignCartCreationResponseDTO } from '../models/assignCartCreation';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the cart-creations/assign API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header.
 */
export class AssignCartCreationDataSource {
  /** Stable API path for the assign endpoint. */
  private static readonly ASSIGN_PATH = '/cart-creations/assign';

  private url(): string {
    return `${env.apiBaseUrl}${AssignCartCreationDataSource.ASSIGN_PATH}`;
  }

  async assign(
    body: { cart_creation_id: string; user_admin_id: string },
    authorization?: string,
  ): Promise<AssignCartCreationResponseDTO> {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as AssignCartCreationResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(
        json.errors || json.message || 'Failed to assign cart creation',
      );
    }

    return json;
  }
}
