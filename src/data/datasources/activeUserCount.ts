import type { ActiveUserCountResponseDTO } from '../models/activeUserCount';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the users/active/count API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header.
 */
export class ActiveUserCountDataSource {
  /** Stable API path for the active-user-count endpoint. */
  private static readonly ACTIVE_COUNT_PATH = '/users/active/count';

  private url(): string {
    return `${env.apiBaseUrl}${ActiveUserCountDataSource.ACTIVE_COUNT_PATH}`;
  }

  async fetchActiveCount(
    authorization?: string,
  ): Promise<ActiveUserCountResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(), { method: 'GET', headers });
    const json = (await res.json()) as ActiveUserCountResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(
        json.errors || json.message || 'Failed to load active user count',
      );
    }

    return json;
  }
}
