import type { InactiveUserCountResponseDTO } from '../models/inactiveUserCount';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the users/inactive/count API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header.
 */
export class InactiveUserCountDataSource {
  /** Stable API path for the inactive-user-count endpoint. */
  private static readonly INACTIVE_COUNT_PATH = '/users/inactive/count';

  private url(): string {
    return `${env.apiBaseUrl}${InactiveUserCountDataSource.INACTIVE_COUNT_PATH}`;
  }

  async fetchInactiveCount(
    authorization?: string,
  ): Promise<InactiveUserCountResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(), { method: 'GET', headers });
    const json = (await res.json()) as InactiveUserCountResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(
        json.errors || json.message || 'Failed to load inactive user count',
      );
    }

    return json;
  }
}
