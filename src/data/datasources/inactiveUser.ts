import type { InactiveUsersResponseDTO } from '../models/inactiveUser';
import { env } from '@/shared/utils/env';

export interface InactiveQueryParams {
  page: number;
  limit: number;
}

/**
 * Raw data source — HTTP client for the users-inactive API.
 * The `Authorization` header value is supplied by the presentation layer
 * so the data layer stays store-agnostic.
 */
export class InactiveUserDataSource {
  /** Stable API path for the inactive-users (prospect) endpoint. */
  private static readonly INACTIVE_PATH = '/users/inactive';

  private url(params: InactiveQueryParams): string {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    return `${env.apiBaseUrl}${InactiveUserDataSource.INACTIVE_PATH}?${query.toString()}`;
  }

  async fetchInactive(
    params: InactiveQueryParams,
    authorization?: string,
  ): Promise<InactiveUsersResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(params), { method: 'GET', headers });
    const json = (await res.json()) as InactiveUsersResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(json.errors || json.message || 'Failed to load inactive users');
    }

    return json;
  }
}
