import type { InactiveUser } from '../entities/inactiveUser';
import type { PageMeta } from '../entities/page';

/** Query params the caller passes when paging the list. */
export interface InactiveUserQuery {
  page: number;
  limit: number;
}

export interface InactiveUserPage {
  items: InactiveUser[];
  meta: PageMeta;
}

/**
 * Port (repository interface) owned by the domain layer.
 */
export interface InactiveUserRepository {
  getInactive(
    query: InactiveUserQuery,
    authorization?: string,
  ): Promise<InactiveUserPage>;
}
